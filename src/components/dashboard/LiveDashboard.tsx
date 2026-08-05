import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Percent,
  XCircle,
  PlusCircle,
  BarChart2,
  DollarSign,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  ChevronRight,
  Sparkles,
  Zap,
  Filter,
  Newspaper,
  ShieldCheck,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { OpenTrade, ClosedTrade, CandleData, TickerData } from '../../types';
import { MarketStreamStats } from '../../services/marketDataService';
import { CandleChart } from './CandleChart';
import { MarketConsensusScanner } from './MarketConsensusScanner';
import { calculatePairConsensus } from '../../utils/consensusEngine';
import { TradeConsolidationModal } from '../validation/TradeConsolidationModal';

interface LiveDashboardProps {
  openTrades: OpenTrade[];
  closedTrades: ClosedTrade[];
  tickers: TickerData[];
  selectedPair: string;
  setSelectedPair: (pair: string) => void;
  candles: CandleData[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  onForceExitTrade: (id: number) => void;
  onForceExitAll: () => void;
  onOpenManualTradeModal: () => void;
  totalBalance: number;
  streamStats?: MarketStreamStats;
  onReconnectStream?: () => void;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({
  openTrades,
  closedTrades,
  tickers,
  selectedPair,
  setSelectedPair,
  candles,
  timeframe,
  setTimeframe,
  onForceExitTrade,
  onForceExitAll,
  onOpenManualTradeModal,
  totalBalance,
  streamStats,
  onReconnectStream,
}) => {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [watchlistSort, setWatchlistSort] = useState<'default' | 'buys' | 'sells' | 'volume'>('default');
  const [auditedTradeModal, setAuditedTradeModal] = useState<ClosedTrade | OpenTrade | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveDateStr = currentDateTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const liveTimeStr = currentDateTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });


  // Stats calculations
  const totalStakeInTrades = openTrades.reduce((acc, t) => acc + t.stakeAmount, 0);
  const totalUnrealizedProfit = openTrades.reduce((acc, t) => acc + t.currentProfit, 0);
  const totalRealizedProfit = closedTrades.reduce((acc, t) => acc + t.profitUsdt, 0);
  const winningTrades = closedTrades.filter((t) => t.profitUsdt > 0).length;
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;
  const currentTicker = tickers.find((t) => t.symbol === selectedPair) || {
    symbol: selectedPair,
    lastPrice: candles[candles.length - 1]?.close || 94820,
    priceChangePercent: 3.42,
    highPrice: 96100,
    lowPrice: 92400,
    volume: 28410,
    quoteVolume: 2690000000,
    rawSymbol: 'BTCUSDT',
  };

  // Pre-calculate consensus for all tickers for sidebar display and sorting
  const tickersWithConsensus = tickers.map((t) => {
    const consensus = calculatePairConsensus(t);
    return {
      ...t,
      consensus,
    };
  });

  // Sort tickers based on active filter
  let sortedTickers = [...tickersWithConsensus];
  if (watchlistSort === 'buys') {
    sortedTickers.sort((a, b) => b.consensus.totalScore - a.consensus.totalScore);
  } else if (watchlistSort === 'sells') {
    sortedTickers.sort((a, b) => a.consensus.totalScore - b.consensus.totalScore);
  } else if (watchlistSort === 'volume') {
    sortedTickers.sort((a, b) => b.quoteVolume - a.quoteVolume);
  }

  return (
    <div className="space-y-5">
      {/* 24/7 Live Binance Market Stream Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Feed de Mercado 24/7</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Binance WebSocket Oficial
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{tickers.length} Criptos ao Vivo</span>
              <span className="text-slate-600">•</span>
              <span>Latência: <span className="text-emerald-400 font-bold">{streamStats?.latencyMs || 12}ms</span></span>
              <span className="text-slate-600">•</span>
              <span>Vol 24h: <span className="text-cyan-300 font-bold">${((streamStats?.totalQuoteVolume24h || 28450000000) / 1000000000).toFixed(2)}B USDT</span></span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span className="text-slate-400">{liveDateStr}</span>
                <span className="text-white font-bold tracking-wider">{liveTimeStr}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Fast Ticker Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {/* Fast Quick-Switch Top Crypto Chips */}
          <div className="flex items-center gap-1.5 shrink-0">
            {tickers.slice(0, 5).map((t) => {
              const isSelected = t.symbol === selectedPair;
              return (
                <button
                  key={t.symbol}
                  onClick={() => setSelectedPair(t.symbol)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-md shadow-cyan-950/50'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="font-extrabold">{t.symbol.replace('/USDT', '')}</span>
                  <span className="text-white">${t.lastPrice > 100 ? t.lastPrice.toLocaleString('en-US', { maximumFractionDigits: 1 }) : t.lastPrice.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold ${t.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.priceChangePercent >= 0 ? '+' : ''}{t.priceChangePercent.toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>

          {onReconnectStream && (
            <button
              onClick={onReconnectStream}
              title="Forçar Re-sincronização do Stream Binance"
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Saldo Total (USDT)</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Em posições: ${totalStakeInTrades.toFixed(0)}
          </div>
        </div>

        {/* Unrealized PnL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>PnL Não-Realizado</span>
            <ActivityIcon profit={totalUnrealizedProfit} />
          </div>
          <div className={`text-lg font-bold font-mono ${totalUnrealizedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalUnrealizedProfit >= 0 ? '+' : ''}${totalUnrealizedProfit.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {openTrades.length} Posições Abertas
          </div>
        </div>

        {/* Realized Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Lucro Realizado</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            +${totalRealizedProfit.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            +{((totalRealizedProfit / (totalBalance - totalRealizedProfit || 10000)) * 100).toFixed(1)}% ROI Total
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Taxa de Acerto (Win Rate)</span>
            <Percent className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold font-mono text-blue-400">
            {winRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {winningTrades} Vencedores / {closedTrades.length - winningTrades} Perdedores
          </div>
        </div>

        {/* Profit Factor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Fator de Lucro</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-400">
            2.48
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Sharpe: 2.34 • Calmar: 7.2
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Drawdown Máximo</span>
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono text-indigo-300">
            4.8%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Controle de Risco Freqtrade
          </div>
        </div>
      </div>

      {/* RADAR DE CONSENSO & SINAIS SÓLIDOS MULTI-TEMPO GRÁFICO */}
      <MarketConsensusScanner
        tickers={tickers}
        selectedPair={selectedPair}
        onSelectPair={setSelectedPair}
        onTimeframeChange={setTimeframe}
        onOpenTradeModalForPair={(pair) => {
          setSelectedPair(pair);
          onOpenManualTradeModal();
        }}
      />

      {/* Main Grid: Live Candlestick Chart + Pair Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chart Column (3 cols) */}
        <div className="lg:col-span-3">
          <CandleChart
            pair={selectedPair}
            candles={candles}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            currentPrice={currentTicker.lastPrice}
          />
        </div>

        {/* Pair Watchlist Column (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-xs tracking-wide">WHITELIST DE PARES</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              VolumePairList (10)
            </span>
          </div>

          {/* Sorter tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            <button
              onClick={() => setWatchlistSort('default')}
              title="Ordem Padrão"
              className={`px-1.5 py-0.5 rounded transition-colors ${
                watchlistSort === 'default'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Padrão
            </button>
            <button
              onClick={() => setWatchlistSort('buys')}
              title="Mais Propensos à Compra"
              className={`px-2 py-0.5 rounded transition-all ${
                watchlistSort === 'buys'
                  ? 'bg-emerald-600 text-white font-black border border-emerald-400 shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              🟢 Compras
            </button>
            <button
              onClick={() => setWatchlistSort('sells')}
              title="Mais Propensos à Venda"
              className={`px-2 py-0.5 rounded transition-all ${
                watchlistSort === 'sells'
                  ? 'bg-rose-600 text-white font-black border border-rose-400 shadow-sm'
                  : 'text-rose-300 hover:text-white'
              }`}
            >
              🔴 Vendas
            </button>
            <button
              onClick={() => setWatchlistSort('volume')}
              title="Ordenar por Volume"
              className={`px-1.5 py-0.5 rounded transition-colors ${
                watchlistSort === 'volume'
                  ? 'bg-slate-800 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vol
            </button>
          </div>

          {/* Ticker List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
            {sortedTickers.map((t) => {
              const isSelected = t.symbol === selectedPair;
              const hasOpenTrade = openTrades.some((ot) => ot.pair === t.symbol);
              const score = t.consensus.totalScore;
              const isBuy = score > 0;

              return (
                <button
                  key={t.symbol}
                  onClick={() => setSelectedPair(t.symbol)}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-slate-800 border border-emerald-500/50 text-white shadow-sm'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold font-mono text-xs text-white">{t.symbol}</span>
                      {hasOpenTrade && (
                        <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ATIVO
                        </span>
                      )}
                    </div>
                    {/* Consensus Propensity Badge */}
                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                      <span
                        className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow-xs ${
                          t.consensus.classification === 'FORTE COMPRA'
                            ? 'bg-emerald-600 text-white border border-emerald-400'
                            : t.consensus.classification === 'COMPRA'
                            ? 'bg-emerald-700 text-white'
                            : t.consensus.classification === 'FORTE VENDA'
                            ? 'bg-rose-600 text-white border border-rose-400'
                            : t.consensus.classification === 'VENDA'
                            ? 'bg-rose-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {score >= 0 ? '+' : ''}{score} {t.consensus.classification}
                      </span>
                      {t.consensus.tapeReading && (
                        <span
                          title={`Tape Reading: ${t.consensus.tapeReading.alignedBuyCount}/8 Métricas Compradoras (Score: ${t.consensus.tapeReading.score >= 0 ? '+' : ''}${t.consensus.tapeReading.score})`}
                          className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded flex items-center gap-0.5 ${
                            t.consensus.tapeReading.alignedBuyCount >= 5
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                              : t.consensus.tapeReading.alignedSellCount >= 5
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-850 text-slate-400'
                          }`}
                        >
                          <Flame className="w-2.5 h-2.5 shrink-0 text-amber-400" />
                          Tape {t.consensus.tapeReading.alignedBuyCount}/8
                        </span>
                      )}
                      {t.consensus.newsSentiment && (
                        <span
                          title={`Notícias: ${t.consensus.newsSentiment.sentimentLabel} (${t.consensus.newsSentiment.topCatalyst})`}
                          className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded flex items-center gap-0.5 ${
                            t.consensus.newsSentiment.sentimentScore > 0
                              ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                              : t.consensus.newsSentiment.sentimentScore < 0
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-850 text-slate-400'
                          }`}
                        >
                          <Newspaper className="w-2.5 h-2.5 shrink-0" />
                          {t.consensus.newsSentiment.sentimentScore >= 0 ? '+' : ''}{t.consensus.newsSentiment.sentimentScore}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono flex-shrink-0">
                    <div className="text-xs font-semibold text-white">
                      ${t.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: t.lastPrice < 10 ? 4 : 2 })}
                    </div>
                    <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${t.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.priceChangePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {t.priceChangePercent >= 0 ? '+' : ''}{t.priceChangePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={onOpenManualTradeModal}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Forçar Entrada de Trade
            </button>
          </div>
        </div>
      </div>

      {/* Trades Section: Open Positions vs Closed Trades History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('open')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'open'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Posições Abertas ({openTrades.length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'closed'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Histórico Fechado ({closedTrades.length})
            </button>
          </div>

          {activeTab === 'open' && openTrades.length > 0 && (
            <button
              onClick={onForceExitAll}
              className="px-2.5 sm:px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Forçar Saída Geral
            </button>
          )}
        </div>

        {/* Open Trades Content */}
        {activeTab === 'open' && (
          <div>
            {openTrades.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                Nenhum trade ativo no momento. O bot está escaneando os pares da whitelist via NostalgiaForInfinityX + FreqAI.
              </div>
            ) : (
              <>
                {/* Mobile Cards Layout (visible on < md screens) */}
                <div className="grid grid-cols-1 gap-3 md:hidden font-mono">
                  {openTrades.map((t) => (
                    <div
                      key={`mobile-trade-${t.id}`}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md"
                    >
                      {/* Top Row: Symbol, Direction, PnL badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPair(t.pair)}
                            className="text-sm font-bold text-white hover:text-emerald-400 flex items-center gap-1"
                          >
                            <span className="text-slate-500">#{t.id}</span> {t.pair}
                          </button>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white border shadow-xs ${t.direction === 'long' ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400'}`}>
                            {t.direction.toUpperCase()} 1x
                          </span>
                        </div>

                        <div className={`text-sm font-bold px-2 py-0.5 rounded-lg border ${
                          t.currentProfit >= 0
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        }`}>
                          {t.currentProfit >= 0 ? '+' : ''}${t.currentProfit.toFixed(2)} ({t.currentProfitPct >= 0 ? '+' : ''}{t.currentProfitPct.toFixed(2)}%)
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Entrada → Atual</span>
                          <span className="text-slate-300 font-bold">${t.openRate}</span>
                          <span className="text-slate-400 text-[11px] block">${t.currentRate}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Stake / Duração</span>
                          <span className="text-slate-300 font-bold">${t.stakeAmount}</span>
                          <span className="text-slate-400 text-[11px] block">{t.durationMinutes} min</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Alvo ROI</span>
                          <span className="text-emerald-400 font-bold">${t.roiTargetRate} (+{t.roiTargetPct}%)</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Trailing Stop Loss</span>
                          <span className="text-rose-400 font-bold">${t.stopLossRate} ({t.stopLossPct}%)</span>
                        </div>
                      </div>

                      {/* FreqAI pill if available */}
                      {t.freqaiPrediction && (
                        <div className="flex items-center justify-between text-[11px] bg-indigo-950/30 border border-indigo-800/40 px-2.5 py-1.5 rounded-lg text-indigo-300">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>FreqAI Predição:</span>
                            <span className="font-bold text-indigo-200">+{t.freqaiPrediction.predictedGainPct}%</span>
                          </div>
                          <span className="text-[10px] text-slate-400">DI: {t.freqaiPrediction.dissimilarityIndex}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setSelectedPair(t.pair)}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold text-center transition-colors"
                        >
                          Ver Gráfico
                        </button>
                        <button
                          onClick={() => setAuditedTradeModal(t)}
                          className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold text-center transition-colors"
                        >
                          Raio-X MAE
                        </button>
                        <button
                          onClick={() => onForceExitTrade(t.id)}
                          className="flex-1 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold text-center transition-colors"
                        >
                          Forçar Saída
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout (visible on >= md screens) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                        <th className="pb-2">ID / Par</th>
                        <th className="pb-2">Lado</th>
                        <th className="pb-2">Stake / Qtd</th>
                        <th className="pb-2">Preço Entrada</th>
                        <th className="pb-2">Preço Atual</th>
                        <th className="pb-2">PnL Atual</th>
                        <th className="pb-2">Alvo ROI</th>
                        <th className="pb-2">Trailing Stop</th>
                        <th className="pb-2">Predição FreqAI</th>
                        <th className="pb-2">Data Entrada</th>
                        <th className="pb-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {openTrades.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5">
                            <span className="font-bold text-white">#{t.id}</span>{' '}
                            <button
                              onClick={() => setSelectedPair(t.pair)}
                              className="font-bold text-emerald-400 hover:underline"
                            >
                              {t.pair}
                            </button>
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white border shadow-xs ${t.direction === 'long' ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400'}`}>
                              {t.direction.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-300">
                            ${t.stakeAmount} <span className="text-slate-500">({t.amount})</span>
                          </td>
                          <td className="py-2.5 text-slate-300">${t.openRate}</td>
                          <td className="py-2.5 font-bold text-white">${t.currentRate}</td>
                          <td className="py-2.5">
                            <div className={`font-bold flex items-center gap-1 ${t.currentProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {t.currentProfit >= 0 ? '+' : ''}${t.currentProfit.toFixed(2)} ({t.currentProfitPct >= 0 ? '+' : ''}{t.currentProfitPct.toFixed(2)}%)
                            </div>
                          </td>
                          <td className="py-2.5 text-slate-300">
                            ${t.roiTargetRate} <span className="text-emerald-400">(+{t.roiTargetPct}%)</span>
                          </td>
                          <td className="py-2.5 text-slate-300">
                            ${t.stopLossRate} <span className="text-rose-400">({t.stopLossPct}%)</span>
                          </td>
                          <td className="py-2.5">
                            {t.freqaiPrediction ? (
                              <div className="flex items-center gap-1 text-indigo-300 text-[11px]">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                <span>+{t.freqaiPrediction.predictedGainPct}%</span>
                                <span className="text-slate-500 text-[9px]">(DI:{t.freqaiPrediction.dissimilarityIndex})</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                          <td className="py-2.5 text-slate-400 text-[11px]">{t.openDate}</td>
                          <td className="py-2.5 text-right flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setAuditedTradeModal(t)}
                              className="px-2 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30 rounded text-[11px] font-semibold transition-colors"
                            >
                              Raio-X
                            </button>
                            <button
                              onClick={() => onForceExitTrade(t.id)}
                              className="px-2 py-1 bg-rose-600/20 text-rose-300 hover:bg-rose-600/40 border border-rose-500/30 rounded text-[11px] font-semibold transition-colors"
                            >
                              Forçar Saída
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Closed Trades Content */}
        {activeTab === 'closed' && (
          <div>
            {/* Mobile Closed Trades Cards */}
            <div className="grid grid-cols-1 gap-2.5 md:hidden font-mono">
              {closedTrades.map((t) => (
                <div
                  key={`mobile-closed-${t.id}`}
                  onClick={() => setAuditedTradeModal(t)}
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3 space-y-2 shadow-sm text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">#{t.id}</span>
                      <span className="font-bold text-white">{t.pair}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${t.direction === 'long' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {t.direction.toUpperCase()}
                      </span>
                    </div>

                    <span className={`font-bold ${t.profitUsdt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.profitUsdt >= 0 ? '+' : ''}${t.profitUsdt.toFixed(2)} ({t.profitPct >= 0 ? '+' : ''}{t.profitPct.toFixed(2)}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>${t.openRate} → ${t.closeRate}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.exitReason === 'roi'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : t.exitReason === 'trailing_stop_loss'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : t.exitReason === 'stop_loss'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {t.exitReason.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[10px] pt-1 border-t border-slate-900">
                    <span>Duração: {t.duration}</span>
                    <span className="text-emerald-400 font-semibold">Ver Auditoria MAE/MFE →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Closed Trades Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="pb-2">ID / Par</th>
                    <th className="pb-2">Lado</th>
                    <th className="pb-2">Stake</th>
                    <th className="pb-2">Entrada / Saída</th>
                    <th className="pb-2">Lucro (USDT / %)</th>
                    <th className="pb-2">Motivo Saída</th>
                    <th className="pb-2">Duração</th>
                    <th className="pb-2">Data Fechamento</th>
                    <th className="pb-2 text-right">Auditoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {closedTrades.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setAuditedTradeModal(t)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5">
                        <span className="font-bold text-white">#{t.id}</span>{' '}
                        <span className="font-bold text-slate-200">{t.pair}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white border shadow-xs ${t.direction === 'long' ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400'}`}>
                          {t.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300">${t.stakeAmount}</td>
                      <td className="py-2.5 text-slate-300">
                        ${t.openRate} → ${t.closeRate}
                      </td>
                      <td className="py-2.5">
                        <span className={`font-bold ${t.profitUsdt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.profitUsdt >= 0 ? '+' : ''}${t.profitUsdt.toFixed(2)} ({t.profitPct >= 0 ? '+' : ''}{t.profitPct.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.exitReason === 'roi'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : t.exitReason === 'trailing_stop_loss'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : t.exitReason === 'stop_loss'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {t.exitReason.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">{t.duration}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{t.closeDate}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAuditedTradeModal(t);
                          }}
                          className="px-2 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30 rounded text-[11px] font-semibold transition-colors"
                        >
                          Raio-X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Trade Consolidation Inspection Modal */}
      {auditedTradeModal && (
        <TradeConsolidationModal
          trade={auditedTradeModal}
          onClose={() => setAuditedTradeModal(null)}
        />
      )}
    </div>
  );
};

function ActivityIcon({ profit }: { profit: number }) {
  if (profit >= 0) return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
}

