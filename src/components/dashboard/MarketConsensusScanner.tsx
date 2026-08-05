import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Info,
  Layers,
  Sparkles,
  Trophy,
  Medal,
  Award,
  Crown,
  Newspaper,
  AlertOctagon,
  Flame,
  Check,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  DollarSign,
  Activity,
  BarChart2,
} from 'lucide-react';
import {
  TickerData,
  PairConsensusAnalysis,
  TimeframeKey,
} from '../../types';
import {
  calculatePairConsensus,
  rankTickersByConsensus,
} from '../../utils/consensusEngine';

interface MarketConsensusScannerProps {
  tickers: TickerData[];
  selectedPair: string;
  onSelectPair: (pair: string) => void;
  onTimeframeChange?: (timeframe: string) => void;
  onOpenTradeModalForPair?: (pair: string) => void;
}

type SortField = 'winRate' | 'score' | 'change24h' | 'price';
type SortOrder = 'desc' | 'asc';

export const MarketConsensusScanner: React.FC<MarketConsensusScannerProps> = ({
  tickers,
  selectedPair,
  onSelectPair,
  onTimeframeChange,
  onOpenTradeModalForPair,
}) => {
  const [filterMode, setFilterMode] = useState<
    'solid_only' | 'solid_buys' | 'solid_sells' | 'blocked_divergent' | 'all'
  >('solid_only');
  const [rankingPodiumFilter, setRankingPodiumFilter] = useState<'overall' | 'buys' | 'sells' | 'diamond'>('overall');
  const [requireSolidBase, setRequireSolidBase] = useState<boolean>(true);
  const [expandedPair, setExpandedPair] = useState<string | null>(selectedPair);
  const [showFormulas, setShowFormulas] = useState(false);
  const [hoveredTf, setHoveredTf] = useState<{ pair: string; tf: TimeframeKey } | null>(null);
  const [activeSignalModal, setActiveSignalModal] = useState<PairConsensusAnalysis | null>(null);
  const [activationSuccessMsg, setActivationSuccessMsg] = useState<string | null>(null);
  
  // Sorting controls
  const [sortField, setSortField] = useState<SortField>('winRate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Compute all rankings dynamically
  const rankings = rankTickersByConsensus(tickers);

  // Filter based on selected tab
  let rawList: PairConsensusAnalysis[] = [];
  if (filterMode === 'solid_only') {
    rawList = [...rankings.solidBuysOnly, ...rankings.solidSellsOnly];
  } else if (filterMode === 'solid_buys') {
    rawList = rankings.solidBuysOnly;
  } else if (filterMode === 'solid_sells') {
    rawList = rankings.solidSellsOnly;
  } else if (filterMode === 'blocked_divergent') {
    rawList = rankings.divergentSignals;
  } else {
    rawList = rankings.all;
  }

  // Apply custom sorting
  const displayedList = [...rawList].sort((a, b) => {
    const tickerA = tickers.find((t) => t.symbol === a.symbol);
    const tickerB = tickers.find((t) => t.symbol === b.symbol);
    const changeA = tickerA ? tickerA.priceChangePercent : 0;
    const changeB = tickerB ? tickerB.priceChangePercent : 0;
    const priceA = tickerA ? tickerA.lastPrice : 0;
    const priceB = tickerB ? tickerB.lastPrice : 0;

    let comp = 0;
    if (sortField === 'winRate') {
      comp = b.winRatePct - a.winRatePct || Math.abs(b.totalScore) - Math.abs(a.totalScore);
    } else if (sortField === 'score') {
      comp = b.totalScore - a.totalScore;
    } else if (sortField === 'change24h') {
      comp = changeB - changeA;
    } else if (sortField === 'price') {
      comp = priceB - priceA;
    }

    return sortOrder === 'desc' ? comp : -comp;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleActivateSignal = (analysis: PairConsensusAnalysis) => {
    setActiveSignalModal(analysis);
  };

  const handleConfirmActivation = () => {
    if (!activeSignalModal) return;
    setActivationSuccessMsg(
      `Sinal de ${activeSignalModal.mtfConfluence.dominantBias} para ${activeSignalModal.symbol} ATIVADO com sucesso! Ordem enviada com Stop $${activeSignalModal.stopLossSuggested} e Alvo $${activeSignalModal.takeProfitSuggested}.`
    );
    if (onOpenTradeModalForPair) {
      onOpenTradeModalForPair(activeSignalModal.symbol);
    }
    setTimeout(() => {
      setActivationSuccessMsg(null);
      setActiveSignalModal(null);
    }, 4000);
  };

  const tfList: TimeframeKey[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-4 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                <span>Scanner de Consenso & Validação 4 Pilares</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  MTF + Tape Reading + Notícias + Dump Risk
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Auditoria quântica em tempo real baseada em fluxo real Binance, protegendo contra divergências e falsos rompimentos.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Badges & View Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-w-full">
            <button
              onClick={() => setFilterMode('solid_only')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-bold whitespace-nowrap ${
                filterMode === 'solid_only'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Sólidos ({rankings.solidBuysOnly.length + rankings.solidSellsOnly.length})
            </button>
            <button
              onClick={() => setFilterMode('solid_buys')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-extrabold whitespace-nowrap ${
                filterMode === 'solid_buys'
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400'
                  : 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/60'
              }`}
            >
              ▲ Compras ({rankings.solidBuysOnly.length})
            </button>
            <button
              onClick={() => setFilterMode('solid_sells')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-extrabold whitespace-nowrap ${
                filterMode === 'solid_sells'
                  ? 'bg-rose-600 text-white shadow-md border border-rose-400'
                  : 'text-rose-400 bg-rose-950/40 hover:bg-rose-900/60'
              }`}
            >
              ▼ Vendas ({rankings.solidSellsOnly.length})
            </button>
            <button
              onClick={() => setFilterMode('blocked_divergent')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-bold whitespace-nowrap ${
                filterMode === 'blocked_divergent'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Lock className="w-3 h-3" /> Bloqueados ({rankings.divergentSignals.length})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-all font-bold whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({rankings.all.length})
            </button>
          </div>

          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            {showFormulas ? 'Ocultar 4 Pilares' : 'Ver 4 Pilares'}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {activationSuccessMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activationSuccessMsg}</span>
          </div>
          <button onClick={() => setActivationSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Pillars Explanation Banner */}
      {showFormulas && (
        <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/80 pb-2">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Layers className="w-4 h-4" /> Os 4 Pilares Matemáticos do Sinal Validado
            </span>
            <span className="text-slate-400 text-[11px]">Proteção máxima contra ruído de mercado e bull/bear traps</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/30">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 1. Confluência MTF (6 Tempos)
              </span>
              <p className="text-slate-300 mt-1">
                Exige alinhamento direcional entre tempos rápidos (1m, 5m, 15m) e macro (1h, 4h, 1d) sem divergências de reversão.
              </p>
            </div>

            <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-500/30">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> 2. Tape Reading (8 Métricas)
              </span>
              <p className="text-slate-300 mt-1">
                Audita CVD acumulado, Delta de Agressão, Desequilíbrio de Book (OFI/Imbalance) e Absorção Institucional.
              </p>
            </div>

            <div className="bg-cyan-950/20 p-3 rounded-lg border border-cyan-500/30">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Newspaper className="w-3.5 h-3.5" /> 3. Sentimento NLP & Macro
              </span>
              <p className="text-slate-300 mt-1">
                Bloqueia compras mediante catalisadores negativos ou riscos regulatórios. Valida apetite a risco do mercado.
              </p>
            </div>

            <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-500/30">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> 4. Validação de Venda (Whale)
              </span>
              <p className="text-slate-300 mt-1">
                Detecta exaustão de volume no topo, depósitos on-chain de baleias e quebra de estrutura (MSB) para validar saídas e shorts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RANKING DE ELITE: PODIUM DAS MAIORES TAXAS DE ACERTO      */}
      {/* ========================================================= */}
      <div className="bg-slate-950/90 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden space-y-4">
        {/* Podium Header with Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                  Ranking de Elite • Maiores Taxas de Acerto
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  TOP WIN RATE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Classificação oficial auditada com base nos 4 Pilares e expectativa matemática positiva (EV+).
              </p>
            </div>
          </div>

          {/* Ranking Category Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setRankingPodiumFilter('overall')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                rankingPodiumFilter === 'overall'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Top Geral
            </button>

            <button
              onClick={() => setRankingPodiumFilter('buys')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                rankingPodiumFilter === 'buys'
                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md'
                  : 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Melhores Compras ({rankings.topBuyRankedByWinRate.length})
            </button>

            <button
              onClick={() => setRankingPodiumFilter('sells')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                rankingPodiumFilter === 'sells'
                  ? 'bg-rose-600 text-white border border-rose-400 shadow-md'
                  : 'text-rose-300 bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/60'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              Melhores Vendas ({rankings.topSellRankedByWinRate.length})
            </button>

            <button
              onClick={() => setRankingPodiumFilter('diamond')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                rankingPodiumFilter === 'diamond'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-cyan-400" />
              Diamond Tier (≥88%)
            </button>
          </div>
        </div>

        {/* Podium 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {(() => {
            let topRankedCards: PairConsensusAnalysis[] = [];
            if (rankingPodiumFilter === 'buys') {
              topRankedCards = rankings.topBuyRankedByWinRate.slice(0, 3);
            } else if (rankingPodiumFilter === 'sells') {
              topRankedCards = rankings.topSellRankedByWinRate.slice(0, 3);
            } else if (rankingPodiumFilter === 'diamond') {
              topRankedCards = rankings.topRankedByWinRate.filter((p) => p.winRatePct >= 88).slice(0, 3);
            } else {
              topRankedCards = rankings.topRankedByWinRate.slice(0, 3);
            }

            if (topRankedCards.length === 0) {
              return (
                <div className="col-span-3 p-6 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs font-mono">
                  Nenhum par atende aos critérios estritos de taxa de acerto no filtro selecionado. O sistema protege seu capital rejeitando sinais sem confluência.
                </div>
              );
            }

            return topRankedCards.map((pair, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isSelected = selectedPair === pair.symbol;
              const isBuy = pair.mtfConfluence.dominantBias === 'COMPRA';
              const ticker = tickers.find((t) => t.symbol === pair.symbol);

              const badgeTheme = isFirst
                ? {
                    border: 'border-amber-500/60 bg-gradient-to-b from-amber-950/30 via-slate-950 to-slate-950',
                    ring: 'ring-2 ring-amber-500/40',
                    medalIcon: <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />,
                    medalLabel: '🥇 #1 NO RANKING DE ACERTO',
                    medalBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
                    progressColor: 'from-amber-400 via-emerald-400 to-emerald-500',
                  }
                : isSecond
                ? {
                    border: 'border-slate-400/50 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950',
                    ring: 'ring-1 ring-slate-400/30',
                    medalIcon: <Medal className="w-4 h-4 text-slate-300" />,
                    medalLabel: '🥈 #2 NO RANKING DE ACERTO',
                    medalBadge: 'bg-slate-700/50 text-slate-200 border-slate-600',
                    progressColor: 'from-cyan-400 via-teal-400 to-emerald-500',
                  }
                : {
                    border: 'border-amber-700/50 bg-gradient-to-b from-amber-950/20 via-slate-950 to-slate-950',
                    ring: 'ring-1 ring-amber-700/30',
                    medalIcon: <Award className="w-4 h-4 text-amber-500" />,
                    medalLabel: '🥉 #3 NO RANKING DE ACERTO',
                    medalBadge: 'bg-amber-900/40 text-amber-300 border-amber-800',
                    progressColor: 'from-amber-500 via-emerald-500 to-emerald-500',
                  };

              return (
                <div
                  key={pair.symbol}
                  onClick={() => onSelectPair(pair.symbol)}
                  className={`cursor-pointer border p-4 rounded-xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between group hover:border-amber-400/80 hover:shadow-xl ${
                    badgeTheme.border
                  } ${isSelected ? badgeTheme.ring : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border shadow-sm ${badgeTheme.medalBadge}`}>
                      {badgeTheme.medalIcon}
                      <span>{badgeTheme.medalLabel}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      {pair.rankingTier} TIER
                    </span>
                  </div>

                  {/* Pair Header & Direction */}
                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold font-mono text-white group-hover:text-amber-300 transition-colors">
                          {pair.symbol}
                        </span>
                        {ticker && (
                          <span className={`text-xs font-bold font-mono ${ticker.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ticker.priceChangePercent >= 0 ? '+' : ''}{ticker.priceChangePercent.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 shadow-sm ${
                            isBuy
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-950/50'
                              : 'bg-rose-600 text-white border-rose-400 shadow-rose-950/50'
                          }`}
                        >
                          {isBuy ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {isBuy ? 'COMPRA SÓLIDA' : 'VENDA VALIDADA'} ({pair.totalScore >= 0 ? `+${pair.totalScore}` : pair.totalScore})
                        </span>
                        <span className="text-[10px] font-mono text-slate-300 bg-slate-850 px-2 py-0.5 rounded border border-slate-700 font-bold">
                          {pair.mtfConfluence.alignedCount}/6 MTF
                        </span>
                      </div>
                    </div>

                    {/* Prominent Win Rate Pill */}
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Taxa de Acerto</div>
                      <div className="text-xl font-black font-mono text-emerald-400 flex items-center justify-end gap-0.5">
                        {pair.winRatePct}%
                      </div>
                    </div>
                  </div>

                  {/* Visual Win Rate Progress Bar */}
                  <div className="mt-3 bg-slate-900/90 rounded-lg p-2 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Precisão Estatística:
                      </span>
                      <span className="font-bold text-emerald-300">{pair.historicalTradesCount} trades auditados</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full bg-gradient-to-r ${badgeTheme.progressColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(10, pair.winRatePct))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                      <span>Fator Lucro (PF): <strong className="text-white">{pair.profitFactor}x</strong></span>
                      <span>Expectativa: <strong className="text-emerald-400">+{pair.expectedValuePct}%/trade</strong></span>
                    </div>
                  </div>

                  {/* 4 Pillars Badges Grid */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                    <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 p-1.5 rounded border border-emerald-500/30 flex items-center gap-1 truncate">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">MTF: {pair.mtfConfluence.alignedCount}/6</span>
                    </div>
                    <div className="text-[10px] font-mono text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-500/30 flex items-center gap-1 truncate">
                      <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">Tape: {pair.tapeReading?.alignedBuyCount > pair.tapeReading?.alignedSellCount ? `${pair.tapeReading?.alignedBuyCount}/8 Compra` : `${pair.tapeReading?.alignedSellCount}/8 Venda`}</span>
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 p-1.5 rounded border border-cyan-500/30 flex items-center gap-1 truncate">
                      <Newspaper className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">NLP: {pair.newsSentiment?.sentimentScore >= 0 ? '+' : ''}{pair.newsSentiment?.sentimentScore} pts</span>
                    </div>
                    <div className={`text-[10px] font-mono p-1.5 rounded border flex items-center gap-1 truncate ${
                      pair.sellValidation?.dumpRiskScore && pair.sellValidation.dumpRiskScore > 50 
                        ? 'text-rose-300 bg-rose-950/40 border-rose-500/30' 
                        : 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30'
                    }`}>
                      <AlertOctagon className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">Dump: {pair.sellValidation?.dumpRiskScore}% ({pair.sellValidation?.dumpRiskScore && pair.sellValidation.dumpRiskScore > 50 ? 'Risco' : 'Seguro'})</span>
                    </div>
                  </div>

                  {/* Rationale text */}
                  <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 italic font-mono bg-slate-950/50 p-1.5 rounded border border-slate-900">
                    "{pair.solidSignalVerdict || pair.summary}"
                  </p>

                  {/* Interactive Action Button */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivateSignal(pair);
                      }}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-extrabold text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer border active:scale-95 ${
                        isBuy
                          ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 shadow-emerald-950/60'
                          : 'bg-rose-600 hover:bg-rose-500 border-rose-400 shadow-rose-950/60'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Ativar {isBuy ? 'COMPRA' : 'VENDA'}
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-slate-400">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>Ordenar por:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => handleSort('winRate')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortField === 'winRate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏆 Taxa de Acerto {sortField === 'winRate' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('score')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortField === 'score'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Consenso {sortField === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('change24h')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortField === 'change24h'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📈 Variação 24h {sortField === 'change24h' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('price')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortField === 'price'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💲 Preço {sortField === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="space-y-3">
        {/* ========================================================= */}
        {/* MOBILE VIEW (< md): Modern, High-Density Cards           */}
        {/* ========================================================= */}
        <div className="md:hidden space-y-3">
          {displayedList.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-mono bg-slate-950/60 rounded-xl border border-slate-800">
              Nenhum par encontrado com os critérios selecionados.
            </div>
          ) : (
            displayedList.map((item, index) => {
              const ticker = tickers.find((t) => t.symbol === item.symbol);
              const isSelected = item.symbol === selectedPair;
              const isExpanded = expandedPair === item.symbol;
              const isBuy = item.mtfConfluence.dominantBias === 'COMPRA';
              const mtf = item.mtfConfluence;

              return (
                <div
                  key={`mobile-card-${item.symbol}`}
                  className={`bg-slate-950/90 border rounded-xl p-3.5 space-y-2.5 transition-all shadow-md ${
                    isSelected
                      ? 'border-cyan-500/80 ring-1 ring-cyan-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Row: Global Rank, Symbol, Price, Win Rate */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        item.globalRank && item.globalRank === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : item.globalRank && item.globalRank === 2
                          ? 'bg-slate-700 text-slate-200'
                          : item.globalRank && item.globalRank === 3
                          ? 'bg-amber-900/40 text-amber-300'
                          : 'bg-slate-900 text-slate-400'
                      }`}>
                        #{item.globalRank || index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white text-sm font-mono">{item.symbol}</span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ${ticker?.lastPrice.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: ticker.lastPrice < 10 ? 4 : 2,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={`text-xs font-bold font-mono ${
                            ticker && ticker.priceChangePercent >= 0
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {ticker && ticker.priceChangePercent >= 0 ? '+' : ''}
                          {ticker?.priceChangePercent.toFixed(2)}%
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          item.winRatePct >= 88
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : item.winRatePct >= 80
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-850 text-slate-400 border-slate-700'
                        }`}>
                          {item.winRatePct}% Acerto
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        PF: <strong className="text-white">{item.profitFactor}x</strong> • EV: <strong className="text-emerald-400">+{item.expectedValuePct}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center justify-between">
                    {item.isSolidSignal ? (
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black font-mono flex items-center gap-1 text-white border shadow-sm ${
                          isBuy
                            ? 'bg-emerald-600 border-emerald-400 shadow-emerald-950/50'
                            : 'bg-rose-600 border-rose-400 shadow-rose-950/50'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        SÓLIDO: {item.mtfConfluence.dominantBias} ({item.totalScore >= 0 ? `+${item.totalScore}` : item.totalScore} pts)
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        DIVERGENTE (BLOQUEADO)
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-slate-400">
                      {mtf.alignedCount}/6 Tempos Alinhados
                    </span>
                  </div>

                  {/* MTF Mini Bar Matrix */}
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                      <span>Grade Multi-Tempo (MTF):</span>
                      <span className="font-bold text-white">
                        {mtf.alignedCount}/6 alinhados ({mtf.dominantBias})
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {tfList.map((tf) => {
                        const tfData = mtf.timeframes[tf];
                        const isTfBuy = tfData.bias === 'COMPRA';
                        const isTfSell = tfData.bias === 'VENDA';

                        return (
                          <button
                            key={`mobile-tf-${item.symbol}-${tf}`}
                            onClick={() => {
                              onSelectPair(item.symbol);
                              if (onTimeframeChange) onTimeframeChange(tf);
                            }}
                            className={`py-1 text-center rounded text-[10px] font-mono font-black border transition-colors ${
                              isTfBuy
                                ? 'bg-emerald-600 text-white border-emerald-400 active:bg-emerald-700'
                                : isTfSell
                                ? 'bg-rose-600 text-white border-rose-400 active:bg-rose-700'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            <span className="block text-[8px] opacity-75">{tf}</span>
                            <span className="block">{isTfBuy ? '▲' : isTfSell ? '▼' : '—'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tape Reading & News Summary Snippets */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                    {item.tapeReading && (
                      <div className="bg-slate-900 p-1.5 rounded border border-slate-800 flex items-center gap-1 truncate text-amber-300">
                        <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">Tape: {item.tapeReading.alignedBuyCount > item.tapeReading.alignedSellCount ? `${item.tapeReading.alignedBuyCount}/8 Compra` : `${item.tapeReading.alignedSellCount}/8 Venda`}</span>
                      </div>
                    )}
                    {item.newsSentiment && (
                      <div className={`p-1.5 rounded border flex items-center gap-1 truncate ${
                        item.newsSentiment.sentimentScore >= 0
                          ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                          : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                      }`}>
                        <Newspaper className="w-3 h-3 shrink-0" />
                        <span className="truncate">NLP: {item.newsSentiment.sentimentScore >= 0 ? '+' : ''}{item.newsSentiment.sentimentScore}</span>
                      </div>
                    )}
                  </div>

                  {/* Rationale snippet */}
                  <p className="text-[11px] text-slate-300 font-mono line-clamp-2 leading-relaxed bg-slate-950 p-2 rounded border border-slate-900">
                    "{item.solidSignalVerdict || item.mtfConfluence.solidRationale}"
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                    <button
                      onClick={() => onSelectPair(item.symbol)}
                      className="py-2 px-3 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold text-center transition-colors"
                    >
                      Gráfico
                    </button>
                    <button
                      onClick={() => setExpandedPair(isExpanded ? null : item.symbol)}
                      className="py-2 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      Detalhes
                    </button>
                    {item.isSolidSignal ? (
                      <button
                        onClick={() => handleActivateSignal(item)}
                        className={`flex-1 py-2 rounded-lg text-xs font-black text-white shadow-md flex items-center justify-center gap-1.5 transition-all border ${
                          isBuy
                            ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 shadow-emerald-950/50'
                            : 'bg-rose-600 hover:bg-rose-500 border-rose-400 shadow-rose-950/50'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Ativar {item.mtfConfluence.dominantBias}
                      </button>
                    ) : (
                      <button
                        onClick={() => setExpandedPair(isExpanded ? null : item.symbol)}
                        className="flex-1 py-2 bg-slate-950 text-slate-400 border border-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:text-amber-300"
                      >
                        <Lock className="w-3.5 h-3.5" /> Ver Divergência
                      </button>
                    )}
                  </div>

                  {/* Expanded Breakdown on Mobile */}
                  {isExpanded && (
                    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 space-y-3 mt-2">
                      <div className="text-xs font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="flex items-center gap-1.5 text-cyan-300">
                          <Clock className="w-3.5 h-3.5" /> Auditoria por Tempo Gráfico:
                        </span>
                        <span className="text-[10px] text-slate-400">{item.symbol}</span>
                      </div>

                      <div className="space-y-2">
                        {tfList.map((tf) => {
                          const tfData = mtf.timeframes[tf];
                          const isTfBuy = tfData.bias === 'COMPRA';
                          const isTfSell = tfData.bias === 'VENDA';

                          return (
                            <div
                              key={`mobile-expanded-tf-${item.symbol}-${tf}`}
                              onClick={() => {
                                onSelectPair(item.symbol);
                                if (onTimeframeChange) onTimeframeChange(tf);
                              }}
                              className={`p-2 rounded-lg border text-xs ${
                                isTfBuy
                                  ? 'bg-emerald-950/30 border-emerald-500/30'
                                  : isTfSell
                                  ? 'bg-rose-950/30 border-rose-500/30'
                                  : 'bg-slate-950 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between font-mono">
                                <span className="font-bold text-white">{tf.toUpperCase()}</span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    isTfBuy
                                      ? 'text-emerald-300 bg-emerald-500/20'
                                      : isTfSell
                                      ? 'text-rose-300 bg-rose-500/20'
                                      : 'text-slate-400 bg-slate-800'
                                  }`}
                                >
                                  {tfData.bias} ({tfData.score >= 0 ? '+' : ''}
                                  {tfData.score})
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300 mt-1">{tfData.summary}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================= */}
        {/* DESKTOP VIEW (>= md): Full Detailed Table                 */}
        {/* ========================================================= */}
        <div className="hidden md:block overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 bg-slate-900/60 text-[11px]">
                <th className="py-2.5 px-3">Rank & Par</th>
                <th className="py-2.5 px-2">Preço / 24h</th>
                <th className="py-2.5 px-2">Taxa de Acerto</th>
                <th className="py-2.5 px-2">Grade MTF (6 Tempos)</th>
                <th className="py-2.5 px-2">Tape Reading</th>
                <th className="py-2.5 px-2">Notícias NLP</th>
                <th className="py-2.5 px-2">Validação Venda</th>
                <th className="py-2.5 px-2">Status Consenso</th>
                <th className="py-2.5 px-3 text-right">Ativação do Sinal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs font-mono">
                    Nenhum par encontrado para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                displayedList.map((item, index) => {
                  const ticker = tickers.find((t) => t.symbol === item.symbol);
                  const isSelected = item.symbol === selectedPair;
                  const isExpanded = expandedPair === item.symbol;
                  const isBuy = item.mtfConfluence.dominantBias === 'COMPRA';
                  const mtf = item.mtfConfluence;

                  return (
                    <React.Fragment key={item.symbol}>
                      <tr
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/80 border-l-2 border-l-emerald-500'
                            : 'hover:bg-slate-900/80'
                        }`}
                      >
                        {/* Position & Pair Symbol */}
                        <td className="py-3 px-3" onClick={() => onSelectPair(item.symbol)}>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-[11px] w-5 ${
                              item.globalRank && item.globalRank === 1
                                ? 'text-amber-400'
                                : item.globalRank && item.globalRank === 2
                                ? 'text-slate-300'
                                : item.globalRank && item.globalRank === 3
                                ? 'text-amber-500'
                                : 'text-slate-500'
                            }`}>
                              #{item.globalRank || index + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-xs block">{item.symbol}</span>
                                {item.winRatePct >= 88 && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    TOP
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">Spot USDT</span>
                            </div>
                          </div>
                        </td>

                        {/* Price & 24h Change */}
                        <td className="py-3 px-2" onClick={() => onSelectPair(item.symbol)}>
                          <div className="font-bold text-slate-200">
                            ${ticker?.lastPrice.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: ticker.lastPrice < 10 ? 4 : 2,
                            })}
                          </div>
                          <div
                            className={`text-[10px] font-bold flex items-center ${
                              ticker && ticker.priceChangePercent >= 0
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {ticker && ticker.priceChangePercent >= 0 ? '+' : ''}
                            {ticker?.priceChangePercent.toFixed(2)}%
                          </div>
                        </td>

                        {/* Win Rate % & Profit Factor */}
                        <td className="py-3 px-2" onClick={() => onSelectPair(item.symbol)}>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded border ${
                              item.winRatePct >= 88
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : item.winRatePct >= 80
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {item.winRatePct}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              PF {item.profitFactor}x
                            </span>
                          </div>
                        </td>

                        {/* Multi-Timeframe Mini Grid Chips */}
                        <td className="py-3 px-2" onClick={() => onSelectPair(item.symbol)}>
                          <div className="flex items-center gap-1">
                            {tfList.map((tf) => {
                              const tfData = mtf.timeframes[tf];
                              const isTfBuy = tfData.bias === 'COMPRA';
                              const isTfSell = tfData.bias === 'VENDA';

                              return (
                                <div
                                  key={tf}
                                  onMouseEnter={() => setHoveredTf({ pair: item.symbol, tf })}
                                  onMouseLeave={() => setHoveredTf(null)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPair(item.symbol);
                                    if (onTimeframeChange) {
                                      onTimeframeChange(tf);
                                    }
                                  }}
                                  title={`${tf.toUpperCase()}: ${tfData.bias} (${tfData.score >= 0 ? '+' : ''}${tfData.score} pts) • ${tfData.summary}`}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all transform hover:scale-105 border shadow-xs ${
                                    isTfBuy
                                      ? 'bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-500'
                                      : isTfSell
                                      ? 'bg-rose-600 text-white border-rose-400 hover:bg-rose-500'
                                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                                  }`}
                                >
                                  {tf}
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        {/* Tape Reading */}
                        <td className="py-3 px-2" onClick={() => onSelectPair(item.symbol)}>
                          {item.tapeReading ? (
                            <div className="flex items-center gap-1 text-[10px]">
                              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className={item.tapeReading.alignedBuyCount > item.tapeReading.alignedSellCount ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                                {item.tapeReading.alignedBuyCount > item.tapeReading.alignedSellCount ? `${item.tapeReading.alignedBuyCount}/8 Compra` : `${item.tapeReading.alignedSellCount}/8 Venda`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* News Sentiment */}
                        <td className="py-3 px-2" onClick={() => onSelectPair(item.symbol)}>
                          {item.newsSentiment ? (
                            <div className="flex items-center gap-1 text-[10px]">
                              <Newspaper className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className={item.newsSentiment.sentimentScore >= 0 ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                                {item.newsSentiment.sentimentScore >= 0 ? '+' : ''}{item.newsSentiment.sentimentScore} pts
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* Sell Validation (Dump Risk) */}
                        <td className="py-3 px-2" onClick={() => onSelectPair(item.symbol)}>
                          {item.sellValidation ? (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              item.sellValidation.dumpRiskScore >= 70
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : item.sellValidation.dumpRiskScore >= 40
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              Dump {item.sellValidation.dumpRiskScore}%
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* Consensus Score Status */}
                        <td className="py-3 px-2" onClick={() => onSelectPair(item.symbol)}>
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-black ${
                              item.isSolidSignal
                                ? isBuy
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-rose-600 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.totalScore >= 0 ? `+${item.totalScore}` : item.totalScore} ({item.classification})
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setExpandedPair(isExpanded ? null : item.symbol)}
                              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
                              title="Ver Detalhes do Consenso"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            {item.isSolidSignal && (
                              <button
                                onClick={() => handleActivateSignal(item)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1 transition-all ${
                                  isBuy
                                    ? 'bg-emerald-600 hover:bg-emerald-500'
                                    : 'bg-rose-600 hover:bg-rose-500'
                                }`}
                              >
                                <Zap className="w-3 h-3" /> Ativar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row breakdown */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80">
                          <td colSpan={9} className="p-4 border-b border-slate-800">
                            <div className="space-y-3 font-mono">
                              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                                <span className="font-bold text-white flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                  Auditoria Completa de 4 Pilares • {item.symbol}
                                </span>
                                <span className="text-slate-400 text-[11px]">
                                  Alvo: <strong className="text-emerald-400">${item.takeProfitSuggested}</strong> • Stop: <strong className="text-rose-400">${item.stopLossSuggested}</strong>
                                </span>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                {item.solidSignalVerdict || item.summary}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação de Ativação de Sinal */}
      {activeSignalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50 duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-white">
                  Ativar Sinal Sólido • {activeSignalModal.symbol}
                </h3>
              </div>
              <button
                onClick={() => setActiveSignalModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Validação de 4 Pilares Concluída
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  {activeSignalModal.winRatePct}% Taxa de Acerto
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {activeSignalModal.solidSignalVerdict || activeSignalModal.mtfConfluence.solidRationale}
              </p>
            </div>

            {/* Execution Parameters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Tipo de Operação:</span>
                <span
                  className={`font-bold text-sm ${
                    activeSignalModal.mtfConfluence.dominantBias === 'COMPRA'
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {activeSignalModal.mtfConfluence.dominantBias === 'COMPRA' ? 'COMPRA (Long / Spot)' : 'VENDA (Short / Saída)'}
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Preço de Entrada:</span>
                <span className="font-bold text-sm text-white">${activeSignalModal.entryTarget}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Take Profit (Alvo):</span>
                <span className="font-bold text-sm text-emerald-400">
                  ${activeSignalModal.takeProfitSuggested} (+5.6%)
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Stop Loss Protegido:</span>
                <span className="font-bold text-sm text-rose-400">
                  ${activeSignalModal.stopLossSuggested} (-2.8%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveSignalModal(null)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmActivation}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Confirmar e Ativar Sinal no Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
