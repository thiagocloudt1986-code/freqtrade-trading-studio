export type BotStatus = 'running' | 'paused' | 'stopped' | 'reloading';
export type TradingMode = 'dry-run' | 'live';
export type TradeDirection = 'long' | 'short';
export type ExitReason = 'roi' | 'stop_loss' | 'trailing_stop_loss' | 'exit_signal' | 'custom_exit' | 'force_exit' | 'emergency_exit';

export interface OpenTrade {
  id: number;
  pair: string;
  direction: TradeDirection;
  stakeAmount: number;
  amount: number;
  openRate: number;
  currentRate: number;
  currentProfit: number; // USDT
  currentProfitPct: number; // %
  stopLossRate: number;
  stopLossPct: number;
  initialStopLossRate: number;
  trailingStopLoss: boolean;
  roiTargetRate: number;
  roiTargetPct: number;
  openTimestamp: number;
  openDate: string;
  durationMinutes: number;
  leverage: number;
  liquidationPrice?: number;
  strategy: string;
  timeframe: string;
  freqaiPrediction?: {
    predictedGainPct: number;
    dissimilarityIndex: number;
    modelConfidence: number;
  };
}

export interface ClosedTrade {
  id: number;
  pair: string;
  direction: TradeDirection;
  stakeAmount: number;
  amount: number;
  openRate: number;
  closeRate: number;
  profitUsdt: number;
  profitPct: number;
  openDate: string;
  closeDate: string;
  duration: string;
  exitReason: ExitReason;
  strategy: string;
  leverage: number;
  fees: number;
}

export interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
  bbUpper?: number;
  bbLower?: number;
  bbMiddle?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHist?: number;
  freqaiPredictedClose?: number;
  freqaiDI?: number;
  signal?: 'buy_long' | 'buy_short' | 'exit_long' | 'exit_short';
  tradeMarker?: {
    type: 'entry' | 'exit';
    price: number;
    text: string;
    profitPct?: number;
  };
}

export interface TickerData {
  symbol: string;
  rawSymbol: string;
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
}

export interface FreqAIState {
  enabled: boolean;
  modelName: string;
  algorithm: 'LightGBM' | 'XGBoost' | 'CatBoost' | 'PyTorch' | 'ReinforcementLearning';
  trainWindowDays: number;
  candlesTrained: number;
  lastTrainedTime: string;
  retrainIntervalHours: number;
  dissimilarityThreshold: number;
  currentDI: number;
  outlierCutoff: number;
  featureImportance: { feature: string; importance: number; description: string }[];
  modelMetrics: {
    mse: number;
    r2Score: number;
    accuracyWinRate: number;
    outlierPercent: number;
    epochs: number;
  };
  liveSignals: {
    pair: string;
    targetGainPct: number;
    diScore: number;
    validSignal: boolean;
    recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STANDBY (DI HIGH)';
  }[];
}

export interface BacktestParams {
  strategyName: string;
  timeframe: string;
  timerangeDays: number;
  startingCapital: number;
  maxOpenTrades: number;
  stakeAmount: number;
  enableFreqAI: boolean;
  stoploss: number;
  trailingStop: boolean;
  selectedPairs: string[];
}

export interface BacktestResults {
  summary: {
    totalTrades: number;
    wins: number;
    losses: number;
    draws: number;
    winRatePct: number;
    startingBalance: number;
    finalBalance: number;
    totalProfitUsdt: number;
    totalProfitPct: number;
    cagrPct: number;
    profitFactor: number;
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    maxDrawdownPct: number;
    maxDrawdownUsdt: number;
    avgTradeDuration: string;
    avgProfitPerTradePct: number;
  };
  equityCurve: {
    date: string;
    balance: number;
    profitUsdt: number;
    drawdownPct: number;
    benchmarkBtcBalance: number;
  }[];
  monthlyReturns: {
    year: number;
    month: string;
    profitPct: number;
    trades: number;
  }[];
  exitReasons: {
    reason: ExitReason;
    count: number;
    profitUsdt: number;
    pct: number;
  }[];
  pairPerformance: {
    pair: string;
    trades: number;
    wins: number;
    winRate: number;
    totalProfitUsdt: number;
    totalProfitPct: number;
    avgProfitPct: number;
    avgDuration: string;
  }[];
}

export interface HyperOptEpoch {
  epoch: number;
  loss: number;
  totalProfitPct: number;
  totalProfitUsdt: number;
  trades: number;
  winRatePct: number;
  drawdownPct: number;
  sharpe: number;
  params: {
    roi_0: number;
    roi_20: number;
    roi_60: number;
    stoploss: number;
    trailing_stop_positive: number;
    trailing_stop_positive_offset: number;
    rsi_buy_threshold: number;
    rsi_sell_threshold: number;
    ema_fast: number;
    ema_slow: number;
  };
  isBest?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG' | 'FREQAI';
  module: string;
  message: string;
}

export interface StrategyCatalogItem {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  author: string;
  rating: number;
  tags: string[];
  code: string;
  usesFreqAI: boolean;
}

export interface FreqtradeConfig {
  max_open_trades: number;
  stake_currency: string;
  stake_amount: number | string;
  tradable_balance_ratio?: number;
  dry_run: boolean;
  dry_run_wallet: number;
  cancel_open_orders_on_exit?: boolean;
  timeframe: string;
  trailing_stop?: boolean;
  trailing_stop_positive?: number;
  trailing_stop_positive_offset?: number;
  trailing_only_offset_is_reached?: boolean;
  use_exit_signal?: boolean;
  exit_profit_only?: boolean;
  exit_profit_offset?: number;
  ignore_roi_if_entry_signal?: boolean;
  exchange: {
    name: string;
    key?: string;
    secret?: string;
    ccxt_config?: Record<string, unknown>;
    ccxt_async_config?: Record<string, unknown>;
    pair_whitelist: string[];
    pair_blacklist: string[];
  } | string;
  pair_whitelist?: string[];
  pair_blacklist?: string[];
  strategy?: string;
  entry_pricing?: {
    price_side: string;
    use_order_book: boolean;
    order_book_top: number;
    price_last_balance: number;
  };
  exit_pricing?: {
    price_side: string;
    use_order_book: boolean;
    order_book_top: number;
  };
  freqai?: {
    enabled: boolean;
    purge_old_models: boolean;
    train_period_days: number;
    backtest_period_days: number;
    identifier: string;
    feature_parameters: Record<string, unknown>;
    data_kitchen_thread_count: number;
    model_training_parameters: Record<string, unknown>;
  };
  telegram?: {
    enabled: boolean;
    token: string;
    chat_id: string;
    notification_settings?: Record<string, string>;
  };
  api_server?: {
    enabled: boolean;
    listen_ip_address: string;
    listen_port: number;
    verbosity: string;
    enable_openapi: boolean;
    jwt_secret_key?: string;
    CORS_origins?: string[];
    username?: string;
    password?: string;
  };
  bot_name?: string;
  initial_state?: string;
  force_entry_enable?: boolean;
}

export type PropensityClassification = 'FORTE COMPRA' | 'COMPRA' | 'NEUTRO' | 'VENDA' | 'FORTE VENDA';

export type TimeframeKey = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export interface TimeframeSignalData {
  timeframe: TimeframeKey;
  bias: 'COMPRA' | 'VENDA' | 'NEUTRO';
  score: number; // -100 to +100
  strength: 'FORTE' | 'MODERADO' | 'FRACA' | 'NEUTRO';
  rsi: number;
  trend: string;
  aiGain: number;
  statusColor: 'emerald' | 'rose' | 'amber' | 'slate';
  summary: string;
}

export interface MultiTimeframeConfluence {
  timeframes: Record<TimeframeKey, TimeframeSignalData>;
  alignedCount: number; // e.g. 5 of 6
  totalTimeframes: number; // 6
  confluenceRatio: number; // 0.0 to 1.0 (e.g. 0.83 = 83%)
  dominantBias: 'COMPRA' | 'VENDA' | 'NEUTRO';
  isSolidConfluence: boolean; // True only if >= 4 timeframes align with high score and higher timeframes (1h/4h) do not contradict
  solidSignalStatus:
    | 'SINAL SÓLIDO: FORTE COMPRA'
    | 'SINAL SÓLIDO: COMPRA'
    | 'SINAL SÓLIDO: FORTE VENDA'
    | 'SINAL SÓLIDO: VENDA'
    | 'DIVERGÊNCIA MTF (BLOQUEADO)'
    | 'NEUTRO (SEM BASE SÓLIDA)';
  hasContradiction: boolean; // e.g. 5m says buy, but 1h/4h say strong sell
  contradictionReason?: string;
  executionAllowed: boolean; // Whether bot/user should activate
  solidRationale: string;
}

export interface CryptoNewsItem {
  id: string;
  title: string;
  source: string;
  url?: string;
  publishedAt: string;
  timeAgo: string;
  relatedSymbols: string[]; // e.g. ['BTC/USDT'] or ['SUI/USDT'] or ['MARKET_MACRO']
  category: 'REGULATORY' | 'ETF_FLOW' | 'ON_CHAIN' | 'MACRO' | 'TECH_UPGRADE' | 'EXCHANGE' | 'WHALE';
  sentimentScore: number; // -100 to +100
  sentimentType: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impactLevel: 'ALTO' | 'MÉDIO' | 'BAIXO';
  summary: string;
  aiTradingImpact: string; // Como afeta a decisão de compra/venda do robô
  confidenceScore: number; // 0 to 100
  isBreaking?: boolean;
}

export interface PairNewsSentiment {
  symbol: string;
  sentimentScore: number; // -100 to +100 (ex: +78)
  sentimentLabel: 'MUITO BULLISH' | 'BULLISH' | 'NEUTRO' | 'BEARISH' | 'MUITO BEARISH';
  bullishArticlesCount: number;
  bearishArticlesCount: number;
  neutralArticlesCount: number;
  articleCount?: number;
  topCatalyst: string;
  newsRiskWarning?: string;
  impactOnBotDecision: string;
  lastUpdated: string;
}

export interface MarketMacroSentiment {
  fearAndGreedIndex: number; // 0-100 (ex: 76 - Ganância)
  fearAndGreedLabel: 'Extremo Medo' | 'Medo' | 'Neutro' | 'Ganância' | 'Extrema Ganância';
  macroScore: number; // -100 to +100
  dominantNarrative: string;
  fedInterestRateBias: string;
  etfNetInflows24hUsd: string;
  whaleActivityBias: 'Acumulação Forte' | 'Distribuição' | 'Neutro';
  newsFilterActive: boolean;
}

export interface SellValidationAnalysis {
  symbol: string;
  dumpRiskScore: number; // 0 to 100 (ex: 85 = Alto Risco de Despejo / Venda Forte)
  riskLevel: 'CRÍTICO' | 'ALTO' | 'MODERADO' | 'BAIXO';
  
  // Gatilhos específicos de validação de venda
  volumeExhaustionDivergence: {
    detected: boolean;
    type: 'Divergência de Baixa Regular' | 'Exaustão de Volume no Topo' | 'Absorção Vendedora no Ask' | 'Sem Divergência';
    severity: 'ALTA' | 'MÉDIA' | 'BAIXA' | 'NENHUMA';
    description: string;
  };
  
  orderbookImbalance: {
    bidAskRatio: number; // ex: 0.38 (38% compradores vs 62% vendedores)
    askWallVolumeUsd: string; // ex: "$4.8M em 3 níveis de resistência"
    whaleDumpDetected: boolean;
    whaleFlowDescription: string;
  };
  
  liquiditySweepTrap: {
    detected: boolean;
    trapType: 'Stop-Hunt de Topo (Liquidity Grab)' | 'Rejeição de Máxima Anterior' | 'Falso Rompimento (Bull Trap)' | 'Nenhum';
    description: string;
  };
  
  marketStructureBreak: {
    broken: boolean;
    level: string; // ex: "Perda do fundo de 15m em $1.72"
    timeframe: string; // ex: "15m / 1h"
    description: string;
  };
  
  sellConfirmationVerdict: string;
  isSellConfirmed: boolean; // Flag indicando que a venda possui validação técnica e institucional sólida
}

export interface TapeReadingMetricItem {
  id: 'cvd' | 'imbalance' | 'absorption' | 'vwap' | 'mfi' | 'ofi' | 'vp' | 'vwrsi';
  name: string;
  what: string;
  value: string;
  status: 'bullish' | 'bearish' | 'neutral';
  buyCondition: string;
  isBuyAligned: boolean;
  isSellAligned: boolean;
  tag: string;
}

export interface TapeReadingAnalysis {
  symbol: string;
  score: number; // -100 to +100
  status: 'bullish' | 'bearish' | 'neutral';
  alignedBuyCount: number; // ex: 7 de 8
  alignedSellCount: number; // ex: 1 de 8
  confluenceRatio: number; // ex: 0.88 (7/8)
  confluenceStatus: 'PERFEITA_COMPRA' | 'FORTE_COMPRA' | 'PERFEITA_VENDA' | 'FORTE_VENDA' | 'MISTA_NEUTRA';
  isOrderFlowConfirmed: boolean; // >= 5/8 métricas alinhadas
  metrics: TapeReadingMetricItem[];
  verdict: string;
  details: {
    cvdDelta: number;
    cvdDirection: 'ALTA_ACUMULACAO' | 'QUEDA_DISTRIBUICAO' | 'NEUTRO';
    imbalanceRatio: number;
    absorptionType: 'Acumulação na Base (Smart Money)' | 'Distribuição no Topo' | 'Neutro';
    vwapDevPct: number;
    mfiValue: number;
    ofiValue: number;
    vpLevel: number;
    vwrsiValue: number;
  };
}

export interface SignalComponent {
  id: string;
  name: string;
  category: 'ai' | 'momentum' | 'trend' | 'volatility' | 'volume' | 'news' | 'sell_validation' | 'tape_reading';
  weight: number; // Weight in final consensus (e.g. 0.30 = 30%)
  score: number; // -100 (Strong Bearish / Sell) to +100 (Strong Bullish / Buy)
  rawValue: string;
  status: 'bullish' | 'bearish' | 'neutral';
  explanation: string;
}

export interface PairConsensusAnalysis {
  symbol: string;
  totalScore: number; // -100 to +100
  classification: PropensityClassification;
  confidence: number; // % 0-100
  summary: string;
  components: SignalComponent[];
  freqaiPredPct: number;
  dissimilarityIndex: number;
  rsi: number;
  emaTrend: string;
  bollingerStatus: string;
  volumeStatus: string;
  recommendedAction: string;
  entryTarget: number;
  stopLossSuggested: number;
  takeProfitSuggested: number;
  mtfConfluence: MultiTimeframeConfluence;
  isSolidSignal: boolean;
  solidSignalVerdict: string;
  winRatePct: number; // Taxa de acerto histórica/estimada (ex: 92.4%)
  profitFactor: number; // Fator de Lucro (ex: 3.82)
  expectedValuePct: number; // Expectativa matemática média por trade (ex: +4.2%)
  historicalTradesCount: number; // Volume de trades históricos auditados
  rankingTier: 'DIAMOND' | 'GOLD' | 'SILVER' | 'BRONZE' | 'UNRANKED';
  globalRank?: number; // Posição oficial no ranking global auditado (1, 2, 3...)
  newsSentiment?: PairNewsSentiment;
  newsCatalystSummary?: string;
  newsValidationPassed?: boolean;
  sellValidation?: SellValidationAnalysis;
  tapeReading?: TapeReadingAnalysis;
  tapeReadingSummary?: string;
  tapeReadingPassed?: boolean;
  solidSignalBreakdown?: {
    mtfPassed: boolean;
    newsPassed: boolean;
    sellValidationPassed: boolean;
    tapeReadingPassed: boolean;
    finalReason: string;
  };
}

// -------------------------------------------------------------
// FERRAMENTAS DE VALIDAÇÃO DE TRADES CONSOLIDADOS FREQTRADE
// -------------------------------------------------------------

export interface TradeConsolidationAudit {
  tradeId: number;
  pair: string;
  direction: TradeDirection;
  openRate: number;
  closeRate: number;
  stakeAmount: number;
  profitUsdt: number;
  profitPct: number;
  duration: string;
  exitReason: ExitReason;
  strategy: string;

  // Quantitative MAE / MFE Metrics
  maxAdverseExcursionPct: number; // Pior drawdown suportado durante a operação (ex: -1.2%)
  maxFavorableExcursionPct: number; // Melhor pico de lucro alcançado durante a operação (ex: +4.8%)
  tradeCaptureEfficiencyPct: number; // % do pico MFE capturado no encerramento (ex: 82%)
  slippagePct: number; // Slippage entre sinal da vela e fill real (ex: 0.04%)
  feesPaidUsdt: number;

  // Auditoria dos Hooks de Validação Freqtrade
  entryHooks: {
    spreadCheck: { passed: boolean; value: string; rule: string };
    volumeCheck: { passed: boolean; value: string; rule: string };
    orderbookImbalanceCheck: { passed: boolean; value: string; rule: string };
    trendStackCheck: { passed: boolean; value: string; rule: string };
    rsiNeutralityCheck: { passed: boolean; value: string; rule: string };
    freqaiDiCheck: { passed: boolean; value: string; rule: string };
    btcMacroCheck: { passed: boolean; value: string; rule: string };
  };

  exitHooks: {
    exitTriggerReason: string;
    roiTableTriggered: boolean;
    trailingStoplossTriggered: boolean;
    customExitTriggered: boolean;
    exitConfirmationPassed: boolean;
  };

  qualityScore: number; // 0-100 score de qualidade da execução
  auditVerdict: string;
}

export interface OrderbookDepthItem {
  price: number;
  amount: number;
  totalUsdt: number;
  cumulativeUsdt: number;
  depthPct: number;
}

export interface LiveOrderbookData {
  symbol: string;
  currentPrice: number;
  bestBid: number;
  bestAsk: number;
  spreadUsdt: number;
  spreadPct: number;
  spreadStatus: 'EXCELENTE' | 'MODERADO' | 'ALTO_BLOQUEADO';
  bidAskVolumeRatio: number;
  bids: OrderbookDepthItem[];
  asks: OrderbookDepthItem[];
  slippageEstimates: {
    stake100Usdt: number; // % slippage
    stake500Usdt: number;
    stake2500Usdt: number;
    stake10000Usdt: number;
  };
}

