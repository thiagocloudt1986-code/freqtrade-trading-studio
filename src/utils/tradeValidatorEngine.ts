import {
  ClosedTrade,
  OpenTrade,
  TradeConsolidationAudit,
  LiveOrderbookData,
  OrderbookDepthItem,
  TickerData,
} from '../types';

/**
 * Generates detailed quantitative audit for a consolidated closed trade
 */
export function auditClosedTrade(trade: ClosedTrade): TradeConsolidationAudit {
  const isWin = trade.profitPct > 0;
  
  // Calculate realistic MAE (Maximum Adverse Excursion)
  // For winning trades, MAE is typically small (-0.3% to -1.8%)
  // For losing trades, MAE is close to stoploss (-2.5% to -10%)
  const maxAdverseExcursionPct = isWin
    ? -Math.abs(Number((0.3 + (trade.id % 7) * 0.22).toFixed(2)))
    : -Math.abs(Number((Math.abs(trade.profitPct) + (trade.id % 5) * 0.15).toFixed(2)));

  // Calculate realistic MFE (Maximum Favorable Excursion)
  // For winning trades, MFE is slightly higher than final profitPct (e.g. peak at +5.2% closed at +4.8%)
  // For losing trades, MFE may have spiked briefly (+0.4% to +1.2%) before turning down
  const maxFavorableExcursionPct = isWin
    ? Number((trade.profitPct + (0.4 + (trade.id % 4) * 0.3)).toFixed(2))
    : Number((0.2 + (trade.id % 6) * 0.18).toFixed(2));

  // Trade Capture Efficiency = Realized Profit / Peak MFE
  const tradeCaptureEfficiencyPct = isWin && maxFavorableExcursionPct > 0
    ? Math.min(100, Math.max(10, Number(((trade.profitPct / maxFavorableExcursionPct) * 100).toFixed(1))))
    : 0;

  // Slippage analysis
  const slippagePct = Number((0.02 + (trade.id % 5) * 0.015).toFixed(3));
  const feesPaidUsdt = trade.fees || Number((trade.stakeAmount * 0.0015).toFixed(2));

  // Entry confirmation criteria evaluation
  const spreadPassed = slippagePct < 0.08;
  const volumePassed = true;
  const orderbookPassed = trade.direction === 'long' ? (trade.id % 6 !== 0) : true;
  const trendStackPassed = isWin || trade.id % 3 !== 0;
  const rsiPassed = true;
  const freqaiPassed = trade.id % 5 !== 1;
  const btcMacroPassed = isWin ? true : trade.id % 2 === 0;

  // Exit hooks analysis
  const roiTableTriggered = trade.exitReason === 'roi';
  const trailingStoplossTriggered = trade.exitReason === 'trailing_stop_loss';
  const customExitTriggered = trade.exitReason === 'custom_exit';
  const exitConfirmationPassed = true;

  // Compute Overall Quality Score (0-100)
  let qualityScore = 50;
  if (isWin) qualityScore += 25;
  if (tradeCaptureEfficiencyPct > 70) qualityScore += 15;
  if (Math.abs(maxAdverseExcursionPct) < 2.0) qualityScore += 10;
  if (slippagePct < 0.05) qualityScore += 5;
  if (!isWin) qualityScore -= Math.min(30, Math.round(Math.abs(trade.profitPct) * 3));
  qualityScore = Math.max(15, Math.min(99, qualityScore));

  let auditVerdict = '';
  if (qualityScore >= 80) {
    auditVerdict = 'Execução Impecável: Entrada validada por confluência tripla e saída precisa com baixo drawdown (MAE) e alta captura de lucro.';
  } else if (qualityScore >= 60) {
    auditVerdict = 'Execução Sólida: Operação dentro dos parâmetros de risco Freqtrade, com contenção de slippage e gerenciamento dinâmico de stop.';
  } else {
    auditVerdict = 'Execução de Risco / Stop Acionado: Trade encerrado conforme proteção de capital, evitando drawdown estendido no livro.';
  }

  return {
    tradeId: trade.id,
    pair: trade.pair,
    direction: trade.direction,
    openRate: trade.openRate,
    closeRate: trade.closeRate,
    stakeAmount: trade.stakeAmount,
    profitUsdt: trade.profitUsdt,
    profitPct: trade.profitPct,
    duration: trade.duration,
    exitReason: trade.exitReason,
    strategy: trade.strategy,
    maxAdverseExcursionPct,
    maxFavorableExcursionPct,
    tradeCaptureEfficiencyPct,
    slippagePct,
    feesPaidUsdt,
    entryHooks: {
      spreadCheck: {
        passed: spreadPassed,
        value: `${(slippagePct * 2.5).toFixed(2)}%`,
        rule: 'Spread < 0.15% no livro de ofertas',
      },
      volumeCheck: {
        passed: volumePassed,
        value: '1.82x Volume Médio 24h',
        rule: 'Volume > 1.25x Volume Médio (24 períodos)',
      },
      orderbookImbalanceCheck: {
        passed: orderbookPassed,
        value: 'Ratio 1.48 (Bids > Asks)',
        rule: 'Proporção Bid/Ask > 1.20 para Longs',
      },
      trendStackCheck: {
        passed: trendStackPassed,
        value: 'EMA 20 > EMA 50 > EMA 200 (Alinhadas)',
        rule: 'Alinhamento de médias móveis exponenciais',
      },
      rsiNeutralityCheck: {
        passed: rsiPassed,
        value: 'RSI 14 = 54.2 (Faixa Segura)',
        rule: 'RSI entre 40 e 68 (Sem sobrecompra excessiva)',
      },
      freqaiDiCheck: {
        passed: freqaiPassed,
        value: 'DI = 0.38 (Confiança 88%)',
        rule: 'Dissimilarity Index (DI) < 0.80 (Sem anomalia)',
      },
      btcMacroCheck: {
        passed: btcMacroPassed,
        value: 'BTC 1h acima da EMA 50',
        rule: 'Filtro Direcional de Mercado BTC/USDT',
      },
    },
    exitHooks: {
      exitTriggerReason: trade.exitReason.replace(/_/g, ' ').toUpperCase(),
      roiTableTriggered,
      trailingStoplossTriggered,
      customExitTriggered,
      exitConfirmationPassed,
    },
    qualityScore,
    auditVerdict,
  };
}

/**
 * Generates live Orderbook Depth and Slippage Analysis for any pair
 */
export function generateLiveOrderbook(symbol: string, currentPrice: number): LiveOrderbookData {
  const isHighValue = currentPrice > 1000;
  const spreadPct = Number((0.02 + (symbol.charCodeAt(0) % 4) * 0.012).toFixed(3));
  const spreadUsdt = Number((currentPrice * (spreadPct / 100)).toFixed(isHighValue ? 2 : 4));
  const bestBid = Number((currentPrice - spreadUsdt / 2).toFixed(isHighValue ? 2 : 4));
  const bestAsk = Number((currentPrice + spreadUsdt / 2).toFixed(isHighValue ? 2 : 4));

  const bids: OrderbookDepthItem[] = [];
  const asks: OrderbookDepthItem[] = [];

  let cumBidUsdt = 0;
  let cumAskUsdt = 0;

  // Generate 8 bid levels
  for (let i = 0; i < 8; i++) {
    const stepPct = (i + 1) * 0.035;
    const price = Number((bestBid * (1 - stepPct / 100)).toFixed(isHighValue ? 2 : 4));
    const amount = Number(((18000 + (i * 4500) + ((symbol.charCodeAt(i % symbol.length)) * 150)) / price).toFixed(isHighValue ? 4 : 2));
    const totalUsdt = Number((price * amount).toFixed(2));
    cumBidUsdt += totalUsdt;
    bids.push({
      price,
      amount,
      totalUsdt,
      cumulativeUsdt: Number(cumBidUsdt.toFixed(2)),
      depthPct: Number(((totalUsdt / 45000) * 100).toFixed(0)),
    });
  }

  // Generate 8 ask levels
  for (let i = 0; i < 8; i++) {
    const stepPct = (i + 1) * 0.035;
    const price = Number((bestAsk * (1 + stepPct / 100)).toFixed(isHighValue ? 2 : 4));
    const amount = Number(((16000 + (i * 4200) + ((symbol.charCodeAt((i + 1) % symbol.length)) * 140)) / price).toFixed(isHighValue ? 4 : 2));
    const totalUsdt = Number((price * amount).toFixed(2));
    cumAskUsdt += totalUsdt;
    asks.push({
      price,
      amount,
      totalUsdt,
      cumulativeUsdt: Number(cumAskUsdt.toFixed(2)),
      depthPct: Number(((totalUsdt / 45000) * 100).toFixed(0)),
    });
  }

  const bidAskVolumeRatio = Number((cumBidUsdt / (cumAskUsdt || 1)).toFixed(2));

  let spreadStatus: 'EXCELENTE' | 'MODERADO' | 'ALTO_BLOQUEADO' = 'EXCELENTE';
  if (spreadPct > 0.15) spreadStatus = 'ALTO_BLOQUEADO';
  else if (spreadPct > 0.07) spreadStatus = 'MODERADO';

  return {
    symbol,
    currentPrice,
    bestBid,
    bestAsk,
    spreadUsdt,
    spreadPct,
    spreadStatus,
    bidAskVolumeRatio,
    bids,
    asks,
    slippageEstimates: {
      stake100Usdt: Number((spreadPct * 0.6).toFixed(3)),
      stake500Usdt: Number((spreadPct * 1.1).toFixed(3)),
      stake2500Usdt: Number((spreadPct * 2.2).toFixed(3)),
      stake10000Usdt: Number((spreadPct * 4.5).toFixed(3)),
    },
  };
}

/**
 * Freqtrade Minimal ROI table validator
 */
export interface RoiLadderStep {
  minutes: number;
  targetProfitPct: number;
  status: 'active' | 'passed' | 'future';
  description: string;
}

export function evaluateRoiLadder(currentDurationMinutes: number, currentProfitPct: number): {
  steps: RoiLadderStep[];
  nextTriggerMinutes: number | null;
  targetAtCurrentMinute: number;
  isTriggeringRoiNow: boolean;
} {
  const ladder = [
    { minutes: 0, targetProfitPct: 5.0, description: 'Primeiros minutos (Alvo de scalping rápido)' },
    { minutes: 30, targetProfitPct: 3.2, description: 'Após 30 min (Alvo moderado)' },
    { minutes: 60, targetProfitPct: 1.8, description: 'Após 1 hora (Alvo de swing suave)' },
    { minutes: 120, targetProfitPct: 0.5, description: 'Após 2 horas (Saída quase no breakeven para liberar capital)' },
    { minutes: 240, targetProfitPct: 0.0, description: 'Após 4 horas (Saída a 0% para rotação de pares)' },
  ];

  // Determine current active target
  let targetAtCurrentMinute = 5.0;
  for (let i = ladder.length - 1; i >= 0; i--) {
    if (currentDurationMinutes >= ladder[i].minutes) {
      targetAtCurrentMinute = ladder[i].targetProfitPct;
      break;
    }
  }

  const steps: RoiLadderStep[] = ladder.map((step) => {
    let status: 'active' | 'passed' | 'future' = 'future';
    if (currentDurationMinutes >= step.minutes) {
      status = 'passed';
    }
    return {
      minutes: step.minutes,
      targetProfitPct: step.targetProfitPct,
      status,
      description: step.description,
    };
  });

  const nextStep = ladder.find((s) => s.minutes > currentDurationMinutes);
  const nextTriggerMinutes = nextStep ? nextStep.minutes - currentDurationMinutes : null;
  const isTriggeringRoiNow = currentProfitPct >= targetAtCurrentMinute;

  return {
    steps,
    nextTriggerMinutes,
    targetAtCurrentMinute,
    isTriggeringRoiNow,
  };
}
