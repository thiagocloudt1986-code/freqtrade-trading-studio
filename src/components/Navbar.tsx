import React, { useState, useEffect } from 'react';
import {
  Activity,
  Bot,
  Brain,
  BarChart3,
  Sliders,
  Code2,
  ListFilter,
  Send,
  Terminal,
  Settings,
  ShieldAlert,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  Wallet,
  Github,
  Zap,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Radio,
  Newspaper,
  Music,
  Headphones,
  ExternalLink,
  Flame,
  Clock,
  Calendar,
  Globe,
} from 'lucide-react';
import { BotStatus, TradingMode } from '../types';
import { MarketStreamStats } from '../services/marketDataService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  botStatus: BotStatus;
  setBotStatus: (status: BotStatus) => void;
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  totalBalance: number;
  totalProfit: number;
  totalProfitPct: number;
  openTradesCount: number;
  activeStrategy: string;
  onReloadConfig: () => void;
  streamStats?: MarketStreamStats;
  onReconnectStream?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  botStatus,
  setBotStatus,
  tradingMode,
  setTradingMode,
  totalBalance,
  totalProfit,
  totalProfitPct,
  openTradesCount,
  activeStrategy,
  onReloadConfig,
  streamStats,
  onReconnectStream,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [useUtcTime, setUseUtcTime] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const localDateFormatted = currentDateTime.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const localTimeFormatted = currentDateTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const utcDateFormatted = currentDateTime.toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const utcTimeFormatted = currentDateTime.toLocaleTimeString('pt-BR', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const displayDate = useUtcTime ? utcDateFormatted : localDateFormatted;
  const displayTime = useUtcTime ? utcTimeFormatted : localTimeFormatted;

  const navItems = [
    { id: 'dashboard', label: 'Monitor & MTF', shortLabel: 'Monitor', icon: Activity, badge: openTradesCount > 0 ? `${openTradesCount}` : undefined },
    { id: 'tapereading', label: 'Tape Reading & Order Flow', shortLabel: 'Tape Reading', icon: Flame, badge: '8 Métricas' },
    { id: 'validation', label: 'Validação de Trades', shortLabel: 'Validação', icon: ShieldCheck, badge: 'MAE/MFE' },
    { id: 'news', label: 'Sentimento & Macro', shortLabel: 'Sentimento', icon: Newspaper, badge: 'NLP' },
    { id: 'freqai', label: 'FreqAI (ML)', shortLabel: 'FreqAI', icon: Brain, badge: 'AI' },
    { id: 'optimization', label: 'Backtest & Otimização', shortLabel: 'Backtest', icon: BarChart3 },
    { id: 'strategy', label: 'Estratégias (IDE)', shortLabel: 'Estratégia', icon: Code2 },
    { id: 'tools', label: 'Ferramentas & Config', shortLabel: 'Ferramentas', icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        {/* Top Bar with Stats & Controls */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-950/70 text-xs">
          {/* Logo & Info */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-sm tracking-tight truncate">
                <span>FREQTRADE <span className="hidden sm:inline">STUDIO</span></span>
                <span className="hidden md:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  v2025.2
                </span>
              </div>
            </div>

            {/* Active Strategy Badge (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 ml-1">
              <span className="text-slate-400 text-xs">Estratégia:</span>
              <span className="font-mono font-semibold text-amber-400 text-xs truncate max-w-[170px]">{activeStrategy}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono font-medium text-xs">5m</span>
            </div>

            {/* Creator / Music Credits Badge */}
            <a
              id="navbar-author-spotify-badge"
              href="https://open.spotify.com/intl-pt/artist/16h8q9iOGYIibP6pJWQHg3?si=xXYumP-lRXmc5ici028fsA"
              target="_blank"
              rel="noreferrer"
              title="Thiago Reed - Músico no Spotify"
              className="hidden 2xl:flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-md transition-all text-[11px] font-medium group ml-1"
            >
              <Music className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Thiago Reed</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-semibold border border-emerald-500/30">Músico</span>
              <ExternalLink className="w-2.5 h-2.5 text-emerald-400/70" />
            </a>
          </div>

          {/* Bot Controls & Live Stats */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Real-Time Live Clock & Date (Tablet & Desktop) */}
            <button
              id="navbar-live-clock-btn"
              onClick={() => setUseUtcTime(!useUtcTime)}
              title="Clique para alternar entre Horário Local e Horário UTC (Referência para velas de Trading da Binance)"
              className="hidden md:flex items-center gap-1.5 bg-slate-950/90 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer shadow-sm group active:scale-95 shrink-0"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="text-slate-400 font-medium hidden lg:inline capitalize">{displayDate}</span>
              <span className="text-slate-600 hidden lg:inline">•</span>
              <span className="font-bold text-white tracking-wider flex items-center gap-1">
                <span>{displayTime}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-75 inline-block" />
              </span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-extrabold uppercase border ${
                  useUtcTime
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {useUtcTime ? 'UTC' : 'LOCAL'}
              </span>
            </button>

            {/* 24/7 Real-Time Live Feed Badge */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-[11px]">
              <div className="relative flex items-center justify-center">
                <span className={`w-2 h-2 rounded-full ${streamStats?.status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {streamStats?.status === 'connected' && (
                  <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                )}
              </div>
              <span className={`font-semibold ${streamStats?.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {streamStats?.status === 'connected' ? 'LIVE 24/7' : 'AUTO-SYNC'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Binance WS</span>
              <span className="text-slate-600">({streamStats?.latencyMs || 12}ms)</span>
              {onReconnectStream && (
                <button
                  id="reconnect-stream-btn"
                  onClick={onReconnectStream}
                  title="Reconectar stream em tempo real"
                  className="ml-1 text-slate-500 hover:text-cyan-400 transition-colors p-0.5"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Financial Summary (Visible on sm+ in top bar) */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2.5 bg-slate-900/90 px-2 sm:px-3 py-1 rounded-lg border border-slate-800 font-mono text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 text-slate-300">
                <Wallet className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="hidden md:inline">Balance:</span>
                <span className="font-semibold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="w-px h-3 bg-slate-800" />
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="hidden md:inline">Profit:</span>
                <span className={`font-semibold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalProfit >= 0
                    ? `+$${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `-$${Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  <span className="hidden lg:inline"> ({totalProfitPct >= 0 ? '+' : ''}{totalProfitPct.toFixed(1)}%)</span>
                </span>
              </div>
            </div>

            {/* Mode Switcher: Dry-Run vs Live (Desktop/Tablet) */}
            <div className="hidden sm:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                id="dry-run-btn"
                onClick={() => setTradingMode('dry-run')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  tradingMode === 'dry-run'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dry-Run
              </button>
              <button
                id="live-mode-btn"
                onClick={() => {
                  if (window.confirm('⚠️ Enable LIVE REAL MONEY TRADING? Make sure API keys have trade permissions and risk limits.')) {
                    setTradingMode('live');
                  }
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  tradingMode === 'live'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <ShieldAlert className="w-3 h-3" /> Live
              </button>
            </div>

            {/* Bot State Controls (Pause / Resume) */}
            <div className="flex items-center gap-1 shrink-0">
              {botStatus === 'running' ? (
                <button
                  id="pause-bot-btn"
                  onClick={() => setBotStatus('paused')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-medium transition-colors text-[11px] sm:text-xs"
                  title="Pause trade entries"
                >
                  <Pause className="w-3 h-3" />
                  <span className="hidden xs:inline">Pause</span>
                </button>
              ) : (
                <button
                  id="start-bot-btn"
                  onClick={() => setBotStatus('running')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-medium transition-colors text-[11px] sm:text-xs"
                  title="Start Bot"
                >
                  <Play className="w-3 h-3" />
                  <span className="hidden xs:inline">Resume</span>
                </button>
              )}

              <button
                id="reload-config-btn"
                onClick={onReloadConfig}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Reload config & strategy"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Drawer Trigger Button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                aria-label="Abrir Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Status Sub-Bar: Live Clock & Financial Glance (Mobile & Small Tablets) */}
        <div className="md:hidden px-3 py-1.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-2 text-[11px] font-mono">
          {/* Mobile Live Clock Button */}
          <button
            id="navbar-mobile-live-clock-btn"
            onClick={() => setUseUtcTime(!useUtcTime)}
            title="Clique para alternar entre Horário Local e Horário UTC"
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 px-2 py-0.5 rounded-md cursor-pointer active:scale-95 transition-all shrink-0"
          >
            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="font-bold text-white tracking-wider">{displayTime}</span>
            <span
              className={`text-[8.5px] px-1 py-0.2 rounded font-extrabold uppercase border ${
                useUtcTime
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {useUtcTime ? 'UTC' : 'LOCAL'}
            </span>
          </button>

          {/* Mobile Balance & Profit Glance */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1 text-slate-300 shrink-0">
              <Wallet className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div className="w-px h-2.5 bg-slate-800" />
            <div className="flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className={`font-semibold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalProfit >= 0 ? `+$${totalProfit.toFixed(0)}` : `-$${Math.abs(totalProfit).toFixed(0)}`}
                <span className="text-[9.5px] ml-0.5">({totalProfitPct >= 0 ? '+' : ''}{totalProfitPct.toFixed(1)}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Tab Navigation Bar (Scrollable on tablet/desktop) */}
        <nav className="hidden lg:flex px-4 items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.id === 'freqai'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Horizontal Quick-Tab Ribbon */}
        <nav className="lg:hidden px-2 flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 border-t border-slate-800/40 bg-slate-950/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-chip-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.shortLabel}</span>
                {item.badge && (
                  <span className="px-1 py-0.1 rounded text-[9px] font-bold bg-emerald-500/30 text-emerald-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Mobile Drawer / Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-slate-950 border-l border-slate-800 h-full p-4 flex flex-col shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Navegação Freqtrade</h3>
                  <p className="text-[10px] font-mono text-emerald-400">Daemon Ativo • v2025.2</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Mode & Bot Status Switcher */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Modo de Operação:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tradingMode === 'live' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                  {tradingMode.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setTradingMode('dry-run')}
                  className={`py-1.5 rounded text-[11px] font-bold border transition-colors ${
                    tradingMode === 'dry-run'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Dry-Run (Paper)
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('⚠️ Ativar MODO REAL LIVE com ordens reais na exchange?')) {
                      setTradingMode('live');
                    }
                  }}
                  className={`py-1.5 rounded text-[11px] font-bold border transition-colors flex items-center justify-center gap-1 ${
                    tradingMode === 'live'
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" /> Live Real
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Estratégia Ativa:</span>
                <span className="text-amber-400 font-bold">{activeStrategy.split('_')[0]}</span>
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-1 flex-1">
              <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Módulos do Sistema
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick footer action in drawer */}
            <div className="pt-3 border-t border-slate-800 space-y-2 mt-auto">
              {/* Live Date & Time System Card */}
              <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/80 pb-1.5">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Clock className="w-4 h-4" /> Data & Hora do Sistema
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Ao Vivo
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Horário Local:</div>
                    <div className="font-bold text-white text-xs mt-0.5">{localTimeFormatted}</div>
                    <div className="text-slate-400 text-[9px] mt-0.5 capitalize">{localDateFormatted}</div>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-400 text-[10px]">Horário UTC (Velas):</div>
                    <div className="font-bold text-cyan-300 text-xs mt-0.5">{utcTimeFormatted}</div>
                    <div className="text-cyan-400/80 text-[9px] mt-0.5 capitalize">{utcDateFormatted}</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  * Velas diárias (1d) da Binance fecham às 00:00 UTC (21:00 BRT).
                </div>
              </div>

              <a
                id="drawer-spotify-link"
                href="https://open.spotify.com/intl-pt/artist/16h8q9iOGYIibP6pJWQHg3?si=xXYumP-lRXmc5ici028fsA"
                target="_blank"
                rel="noreferrer"
                className="w-full p-2.5 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span>Thiago Reed</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-semibold border border-emerald-500/30">Músico</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">Ouvir no Spotify</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button
                onClick={() => {
                  onReloadConfig();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Recarregar Config / Estratégia
              </button>
              <div className="text-center text-[10px] text-slate-500 font-mono">
                Freqtrade Web + FreqAI ML Hub
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Navigation Bar (Easy one-thumb navigation) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around text-xs shadow-2xl safe-area-bottom">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px]">Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab('freqai')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'freqai' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span className="text-[10px]">FreqAI</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'news' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span className="text-[10px]">Sentimento</span>
        </button>

        <button
          onClick={() => setActiveTab('optimization')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'optimization' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Backtest</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            mobileMenuOpen ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>
    </>
  );
};

