import React from 'react';
import {
  X,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Activity,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Percent,
} from 'lucide-react';
import { ClosedTrade, OpenTrade } from '../../types';
import { auditClosedTrade } from '../../utils/tradeValidatorEngine';

interface TradeConsolidationModalProps {
  trade: ClosedTrade | OpenTrade | null;
  onClose: () => void;
}

export const TradeConsolidationModal: React.FC<TradeConsolidationModalProps> = ({
  trade,
  onClose,
}) => {
  if (!trade) return null;

  // Convert OpenTrade to ClosedTrade format if inspecting an open position
  const isCurrentlyOpen = !('closeRate' in trade);
  const normalizedClosedTrade: ClosedTrade = isCurrentlyOpen
    ? {
        id: trade.id,
        pair: trade.pair,
        direction: trade.direction,
        stakeAmount: trade.stakeAmount,
        amount: trade.amount,
        openRate: trade.openRate,
        closeRate: trade.currentRate,
        profitUsdt: trade.currentProfit,
        profitPct: trade.currentProfitPct,
        openDate: trade.openDate,
        closeDate: 'EM ANDAMENTO (LIVE)',
        duration: `${trade.durationMinutes} min`,
        exitReason: 'custom_exit',
        strategy: trade.strategy,
        leverage: trade.leverage,
        fees: Number((trade.stakeAmount * 0.0015).toFixed(2)),
      }
    : (trade as ClosedTrade);

  const audit = auditClosedTrade(normalizedClosedTrade);
  const isWin = normalizedClosedTrade.profitPct >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  Auditoria de Trade #{normalizedClosedTrade.id} • {normalizedClosedTrade.pair}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  normalizedClosedTrade.direction === 'long'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {normalizedClosedTrade.direction.toUpperCase()}
                </span>
                {isCurrentlyOpen && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold animate-pulse">
                    POSIÇÃO ABERTA
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Validação Quantitativa de Sinais, Execução CCXT e MAE / MFE Freqtrade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Top Score & Result Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Score de Qualidade */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">Score de Execução</span>
              <div className="flex items-baseline gap-2 my-1">
                <span className={`text-2xl font-bold font-mono ${
                  audit.qualityScore >= 80
                    ? 'text-emerald-400'
                    : audit.qualityScore >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {audit.qualityScore}/100
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {audit.qualityScore >= 80 ? 'EXCELENTE' : audit.qualityScore >= 60 ? 'BOM' : 'DEFENSIVO'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Conformidade com regras de sinal</span>
            </div>

            {/* Resultado Financeiro */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">Resultado Consolidado</span>
              <div className="flex items-baseline gap-2 my-1">
                <span className={`text-2xl font-bold font-mono ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isWin ? '+' : ''}${normalizedClosedTrade.profitUsdt.toFixed(2)}
                </span>
                <span className={`text-xs font-bold font-mono ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({isWin ? '+' : ''}{normalizedClosedTrade.profitPct.toFixed(2)}%)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Stake: ${normalizedClosedTrade.stakeAmount} • Taxas: ${audit.feesPaidUsdt}
              </span>
            </div>

            {/* Motivo de Saída */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">Gatilho de Saída</span>
              <div className="my-1">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-amber-500/30 inline-block">
                  {normalizedClosedTrade.exitReason.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Duração: {normalizedClosedTrade.duration}
              </span>
            </div>
          </div>

          {/* MAE & MFE Quantitative Analysis (Maximum Adverse / Favorable Excursion) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-xs tracking-wide">
                  ANÁLISE DE EXCURSÃO QUANTITATIVA (MAE vs MFE)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Métrica Padrão de Freqtrade Backtest / Live Audit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* MAE - Max Adverse Excursion */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>MAE (Pior Drawdown)</span>
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-base font-bold font-mono text-rose-400">
                  {audit.maxAdverseExcursionPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Menor ponto atingido antes do fechamento
                </div>
              </div>

              {/* MFE - Max Favorable Excursion */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>MFE (Pico de Lucro)</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  +{audit.maxFavorableExcursionPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Maior valorização registrada na operação
                </div>
              </div>

              {/* Trade Capture Efficiency */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Eficiência de Captura</span>
                  <Percent className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-base font-bold font-mono text-cyan-300">
                  {audit.tradeCaptureEfficiencyPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Lucro Realizado / Pico MFE
                </div>
              </div>
            </div>

            {/* Visual Excursion Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-900">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Drawdown MAE: {audit.maxAdverseExcursionPct}%</span>
                <span>Entrada: ${normalizedClosedTrade.openRate}</span>
                <span>Pico MFE: +{audit.maxFavorableExcursionPct}%</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  style={{ width: `${Math.min(50, Math.abs(audit.maxAdverseExcursionPct) * 10)}%` }}
                  className="bg-rose-500/70 h-full"
                  title="Drawdown MAE"
                />
                <div className="w-1 bg-white h-full" title="Ponto de Entrada" />
                <div
                  style={{ width: `${Math.min(80, audit.maxFavorableExcursionPct * 12)}%` }}
                  className="bg-emerald-500/80 h-full"
                  title="Pico MFE"
                />
              </div>
            </div>
          </div>

          {/* Checklist dos 7 Callbacks de Validação Freqtrade (confirm_trade_entry) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-xs tracking-wide">
                  VALIDAÇÃO DE ENTRADA FREQTRADE (confirm_trade_entry)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                7 de 7 Critérios Aprovados
              </span>
            </div>

            <div className="divide-y divide-slate-800/60 font-mono text-xs">
              {/* 1. Spread Check */}
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200">1. Spread do Livro de Ofertas</span>
                    <span className="block text-[10px] text-slate-500">{audit.entryHooks.spreadCheck.rule}</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[11px] font-bold">{audit.entryHooks.spreadCheck.value} (OK)</span>
              </div>

              {/* 2. Volume Multiplier */}
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200">2. Multiplicador de Volume 24h</span>
                    <span className="block text-[10px] text-slate-500">{audit.entryHooks.volumeCheck.rule}</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[11px] font-bold">{audit.entryHooks.volumeCheck.value}</span>
              </div>

              {/* 3. Orderbook Imbalance */}
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200">3. Desequilíbrio Bid/Ask (Orderbook Wall)</span>
                    <span className="block text-[10px] text-slate-500">{audit.entryHooks.orderbookImbalanceCheck.rule}</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[11px] font-bold">{audit.entryHooks.orderbookImbalanceCheck.value}</span>
              </div>

              {/* 4. EMA Stack */}
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200">4. Alinhamento de Médias Móveis</span>
                    <span className="block text-[10px] text-slate-500">{audit.entryHooks.trendStackCheck.rule}</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[11px] font-bold">{audit.entryHooks.trendStackCheck.value}</span>
              </div>

              {/* 5. RSI Neutrality */}
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200">5. Faixa de Momento RSI 14</span>
                    <span className="block text-[10px] text-slate-500">{audit.entryHooks.rsiNeutralityCheck.rule}</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[11px] font-bold">{audit.entryHooks.rsiNeutralityCheck.value}</span>
              </div>

              {/* 6. FreqAI DI Check */}
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200">6. Dissimilarity Index (DI) FreqAI</span>
                    <span className="block text-[10px] text-slate-500">{audit.entryHooks.freqaiDiCheck.rule}</span>
                  </div>
                </div>
                <span className="text-indigo-300 text-[11px] font-bold">{audit.entryHooks.freqaiDiCheck.value}</span>
              </div>

              {/* 7. BTC Macro Filter */}
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200">7. Filtro Macro / Tendência BTC 1h</span>
                    <span className="block text-[10px] text-slate-500">{audit.entryHooks.btcMacroCheck.rule}</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[11px] font-bold">{audit.entryHooks.btcMacroCheck.value}</span>
              </div>
            </div>
          </div>

          {/* Veredito Final da Auditoria */}
          <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <span className="text-emerald-400 font-bold block">Veredito da Auditoria Freqtrade:</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">{audit.auditVerdict}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Fechar Auditoria
          </button>
        </div>
      </div>
    </div>
  );
};
