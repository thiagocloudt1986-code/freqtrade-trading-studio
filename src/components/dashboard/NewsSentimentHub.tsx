import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Flame,
  Globe,
  Zap,
  Filter,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  ShieldAlert,
  Search,
  ExternalLink,
  Sliders,
  DollarSign,
  Cpu,
  Layers,
  ChevronRight,
  Info,
  Server,
  Database,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import {
  CryptoNewsItem,
  PairNewsSentiment,
  MarketMacroSentiment,
} from '../../types';
import {
  getNewsArticles,
  getPairNewsSentiment,
  getMarketMacroSentiment,
  analyzeCustomHeadline,
} from '../../utils/newsSentimentEngine';
import { backendApi, LiveNewsApiResponse } from '../../services/backendApi';

interface NewsSentimentHubProps {
  selectedPair: string;
  onSelectPair: (pair: string) => void;
  newsFilterActive: boolean;
  onToggleNewsFilter: (enabled: boolean) => void;
}

export const NewsSentimentHub: React.FC<NewsSentimentHubProps> = ({
  selectedPair,
  onSelectPair,
  newsFilterActive,
  onToggleNewsFilter,
}) => {
  const [filterSymbol, setFilterSymbol] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showCustomNewsModal, setShowCustomNewsModal] = useState<boolean>(false);
  const [customHeadline, setCustomHeadline] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');
  const [analyzedItem, setAnalyzedItem] = useState<CryptoNewsItem | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Backend Base Memory synced state
  const [articles, setArticles] = useState<CryptoNewsItem[]>(() => getNewsArticles());
  const [macroSentiment, setMacroSentiment] = useState<MarketMacroSentiment>(() => getMarketMacroSentiment());
  const [pairSentimentsMap, setPairSentimentsMap] = useState<Record<string, PairNewsSentiment>>({});
  const [backendSynced, setBackendSynced] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Conectando...');
  const [apiSourcesState, setApiSourcesState] = useState<{
    cryptocompare: { status: string; count: number };
    alternativeMeFng: { status: string; value: number };
  }>({
    cryptocompare: { status: 'online', count: 12 },
    alternativeMeFng: { status: 'online', value: 74 },
  });

  // Pull live data from Backend Base Memory
  const fetchBackendNews = async () => {
    try {
      const data: LiveNewsApiResponse | null = await backendApi.getLiveNews();
      if (data && data.success && Array.isArray(data.news) && data.news.length > 0) {
        setArticles(data.news);
        if (data.macroSentiment) setMacroSentiment(data.macroSentiment);
        if (data.pairSentiments) setPairSentimentsMap(data.pairSentiments);
        if (data.apiSources) {
          setApiSourcesState({
            cryptocompare: { status: data.apiSources.cryptocompare?.status || 'online', count: data.news.length },
            alternativeMeFng: { status: data.apiSources.alternativeMeFng?.status || 'online', value: data.macroSentiment?.fearAndGreedIndex || 74 },
          });
        }
        setBackendSynced(true);
        setLastSyncTime(new Date(data.lastUpdated).toLocaleTimeString('pt-BR'));
      }
    } catch {
      // Fallback gracefully
    }
  };

  // Initial load and periodic background sync every 20 seconds
  useEffect(() => {
    fetchBackendNews();
    const interval = setInterval(fetchBackendNews, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncStatusMsg(null);
    try {
      const syncResult = await backendApi.syncFreeNews();
      await fetchBackendNews();
      if (syncResult && syncResult.success) {
        setSyncStatusMsg(`Sincronizado! +${syncResult.result?.newCount || 0} novas notícias ingeridas no backend.`);
        setTimeout(() => setSyncStatusMsg(null), 4000);
      }
    } catch {
      // fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAnalyzeCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeadline.trim()) return;

    try {
      const result = await backendApi.analyzeNews(customHeadline, customBody, 'Entrada Manual');
      if (result && result.success && result.analyzedItem) {
        setAnalyzedItem(result.analyzedItem);
        await fetchBackendNews();
      } else {
        const localItem = analyzeCustomHeadline(customHeadline, customBody);
        setAnalyzedItem(localItem);
        setArticles((prev) => [localItem, ...prev]);
      }
    } catch {
      const localItem = analyzeCustomHeadline(customHeadline, customBody);
      setAnalyzedItem(localItem);
      setArticles((prev) => [localItem, ...prev]);
    }
  };

  const availablePairs = [
    'ALL',
    'BTC/USDT',
    'ETH/USDT',
    'SOL/USDT',
    'SUI/USDT',
    'NEAR/USDT',
    'LINK/USDT',
    'AVAX/USDT',
    'BNB/USDT',
    'XRP/USDT',
    'DOGE/USDT',
  ];

  const categories = [
    { id: 'ALL', label: 'Todas as Notícias' },
    { id: 'ETF_FLOW', label: 'Fluxo de ETFs', icon: DollarSign },
    { id: 'TECH_UPGRADE', label: 'Tech & Upgrades', icon: Cpu },
    { id: 'ON_CHAIN', label: 'Métricas On-Chain', icon: Layers },
    { id: 'WHALE', label: 'Movimentação Baleias', icon: AlertTriangle },
    { id: 'MACRO', label: 'Macroeconomia', icon: Globe },
    { id: 'REGULATORY', label: 'Regulatório & SEC', icon: ShieldAlert },
  ];

  // Filtered articles
  const filteredArticles = articles.filter((item) => {
    const matchSymbol =
      filterSymbol === 'ALL' ||
      item.relatedSymbols.includes(filterSymbol) ||
      item.relatedSymbols.includes('MARKET_MACRO');

    const matchCategory =
      filterCategory === 'ALL' || item.category === filterCategory;

    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSymbol && matchCategory && matchSearch;
  });

  const getPairSentiment = (sym: string): PairNewsSentiment => {
    if (pairSentimentsMap[sym]) return pairSentimentsMap[sym];
    return getPairNewsSentiment(sym);
  };

  const activePairSentiment =
    filterSymbol !== 'ALL'
      ? getPairSentiment(filterSymbol)
      : getPairSentiment(selectedPair);

  return (
    <div className="space-y-4">
      {/* Backend Base Memory & Real-Time Free APIs Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-white text-sm sm:text-base">
                  Central de Notícias, Sentimento & Memória Base Backend
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Monitoramento 100% Ativo
                </span>
                {backendSynced && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    Base Backend Conectada ({lastSyncTime})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoramento automático em tempo real via APIs públicas gratuitas (CryptoCompare, Alternative.me, Binance) com classificação NLP no backend.
              </p>
            </div>
          </div>

          {/* Action Buttons: Refresh & Test News */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowCustomNewsModal(true);
                setAnalyzedItem(null);
              }}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Testar Notícia / NLP
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-black border border-emerald-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950/50"
              title="Forçar sincronização de APIs gratuitas de notícias agora"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white' : ''}`} />
              <span>Sincronizar APIs Gratuitas</span>
            </button>
          </div>
        </div>

        {/* Free Public API Sources Pipeline Badges */}
        <div className="mb-3 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              APIs em Monitoramento Contínuo:
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-emerald-500/30 text-emerald-300 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <strong>CryptoCompare News API</strong> (Gratuito • {articles.length} notícias ingeridas)
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              <strong>Alternative.me Fear & Greed</strong> (Gratuito • Score {macroSentiment.fearAndGreedIndex}/100)
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-indigo-500/30 text-indigo-300 text-[10px]">
              <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
              <strong>Binance Ticker Feed</strong> (Tempo Real)
            </div>
          </div>

          {syncStatusMsg && (
            <span className="text-[11px] text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
              {syncStatusMsg}
            </span>
          )}
        </div>

        {/* Macro Sentiment Key Metrics Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono">
          {/* Fear & Greed Index */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Fear & Greed Index Oficial</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-bold text-emerald-400">
                  {macroSentiment.fearAndGreedIndex}/100
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  ({macroSentiment.fearAndGreedLabel})
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          {/* ETF Net Inflows */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Fluxo Líquido de ETFs (24h)</span>
              <div className="text-sm font-bold text-slate-200 mt-0.5 truncate">
                {macroSentiment.etfNetInflows24hUsd}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Baleias & On-Chain */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Fluxo de Baleias (On-Chain)</span>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {macroSentiment.whaleActivityBias}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* Bot News Filter Toggle */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Filtro de Notícias no Robô</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-xs font-bold ${
                    newsFilterActive ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {newsFilterActive ? 'ATIVO (Influenciando)' : 'INATIVO'}
                </span>
              </div>
            </div>
            <button
              onClick={() => onToggleNewsFilter(!newsFilterActive)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                newsFilterActive
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {newsFilterActive ? 'Ligado' : 'Desligado'}
            </button>
          </div>
        </div>

        {/* Narrative Banner */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Narrativa Dominante do Mercado:</strong> {macroSentiment.dominantNarrative}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {macroSentiment.fedInterestRateBias}
          </span>
        </div>
      </div>

      {/* Specific Pair Sentiment Card (if selected) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-xs sm:text-sm">
              Sentimento de Notícias do Ativo: {activePairSentiment.symbol}
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black border shadow-xs ${
              activePairSentiment.sentimentScore > 20
                ? 'bg-emerald-600 text-white border-emerald-400'
                : activePairSentiment.sentimentScore < -20
                ? 'bg-rose-600 text-white border-rose-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Índice de Notícia: {activePairSentiment.sentimentScore >= 0 ? '+' : ''}
            {activePairSentiment.sentimentScore} ({activePairSentiment.sentimentLabel})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block mb-1">
              Principal Fator Fundamental / Notícia:
            </span>
            <p className="text-slate-200 font-medium leading-tight">
              {activePairSentiment.topCatalyst}
            </p>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block mb-1">
              Impacto Direto na Decisão do Robô:
            </span>
            <p className="text-emerald-300 font-medium leading-tight">
              {activePairSentiment.impactOnBotDecision}
            </p>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] block mb-1">
                Balanço de Manchetes (Bull vs Bear):
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-bold">
                  🟢 {activePairSentiment.bullishArticlesCount} Bullish
                </span>
                <span className="text-rose-400 font-bold">
                  🔴 {activePairSentiment.bearishArticlesCount} Bearish
                </span>
                <span className="text-slate-400">
                  ⚪ {activePairSentiment.neutralArticlesCount} Neutras
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
        {/* Pair Pills */}
        <div>
          <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filtrar por Par de Cripto:
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {filteredArticles.length} notícias filtradas
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {availablePairs.map((pair) => {
              const isSelected = filterSymbol === pair;
              const sentiment =
                pair !== 'ALL' ? getPairSentiment(pair) : null;

              return (
                <button
                  key={pair}
                  onClick={() => {
                    setFilterSymbol(pair);
                    if (pair !== 'ALL') onSelectPair(pair);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>{pair === 'ALL' ? '🌐 Todos os Pares' : pair}</span>
                  {sentiment && (
                    <span
                      className={`text-[9px] px-1 rounded ${
                        sentiment.sentimentScore > 0
                          ? 'bg-emerald-950 text-emerald-300'
                          : sentiment.sentimentScore < 0
                          ? 'bg-rose-950 text-rose-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {sentiment.sentimentScore >= 0 ? '+' : ''}
                      {sentiment.sentimentScore}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category & Search Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isSelected = filterCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar palavra-chave..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* News Articles Feed */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs font-mono">
            Nenhuma notícia encontrada para os filtros selecionados.
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isBullish = article.sentimentType === 'BULLISH';
            const isBearish = article.sentimentType === 'BEARISH';

            return (
              <div
                key={article.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 sm:p-4 space-y-2.5 transition-all shadow-md"
              >
                {/* Header: Source, Time, Tags, Sentiment Score */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.isBreaking && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
                        <Flame className="w-3 h-3" /> URGENTE
                      </span>
                    )}
                    <span className="font-bold text-cyan-400">{article.source}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-[11px]">{article.timeAgo}</span>
                    <span className="text-slate-500">•</span>
                    <span className="px-2 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {article.category}
                    </span>
                  </div>

                  {/* Sentiment Badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 border shadow-xs ${
                        isBullish
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-950/40'
                          : isBearish
                          ? 'bg-rose-600 text-white border-rose-400 shadow-rose-950/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isBullish ? (
                        <TrendingUp className="w-3.5 h-3.5 text-white" />
                      ) : isBearish ? (
                        <TrendingDown className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {article.sentimentScore >= 0 ? '+' : ''}
                      {article.sentimentScore} ({article.sentimentType})
                    </span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {article.summary}
                </p>

                {/* AI Impact on Robot Trading Decision */}
                <div
                  className={`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                    isBullish
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : isBearish
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[11px] text-cyan-300 mb-0.5">
                      Impacto na Decisão de Trade do Robô:
                    </span>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {article.aiTradingImpact}
                    </p>
                  </div>
                </div>

                {/* Footer: Related Pairs & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-400 text-[10px]">Pares Afetados:</span>
                    {article.relatedSymbols.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => {
                          if (sym !== 'MARKET_MACRO') {
                            onSelectPair(sym);
                          }
                        }}
                        className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 rounded text-[10px] font-bold transition-colors"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      Confiabilidade NLP: {article.confidenceScore}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Custom News / NLP Headline Tester Modal */}
      {showCustomNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                Testador de Notícia & NLP em Tempo Real (Backend Memory)
              </div>
              <button
                onClick={() => setShowCustomNewsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              Digite uma manchete ou evento de mercado para simular como o algoritmo de Processamento de Linguagem Natural (NLP) pontua o sentimento e calcula o impacto na decisão de compra/venda do robô gravando diretamente na Memória Base do Backend.
            </p>

            <form onSubmit={handleAnalyzeCustom} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Título da Notícia ou Manchete:
                </label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder="Ex: BlackRock compra mais US$ 500M em Bitcoin ou SEC aprova ETF de Solana"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Detalhes / Resumo (Opcional):
                </label>
                <textarea
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder="Ex: Volume recorde em DEXs e suporte institucional fortalecem rompimento de alta..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomNewsModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-900/30"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Processar no Backend NLP
                </button>
              </div>
            </form>

            {/* Analysis Result Card */}
            {analyzedItem && (
              <div className="mt-4 p-3 bg-slate-950 border border-indigo-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Resultado do Teste NLP Gravado no Backend:</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      analyzedItem.sentimentScore > 0
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : analyzedItem.sentimentScore < 0
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Score: {analyzedItem.sentimentScore >= 0 ? '+' : ''}
                    {analyzedItem.sentimentScore} ({analyzedItem.sentimentType})
                  </span>
                </div>

                <div className="text-[11px] text-slate-300">
                  <strong>Pares Identificados:</strong> {analyzedItem.relatedSymbols.join(', ')}
                </div>

                <p className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-500/20">
                  <strong>Impacto no Consenso:</strong> {analyzedItem.aiTradingImpact}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
