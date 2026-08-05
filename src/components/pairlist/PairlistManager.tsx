import React, { useState } from 'react';
import {
  ListFilter,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Globe,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Zap,
} from 'lucide-react';
import { TickerData } from '../../types';

interface PairlistManagerProps {
  whitelist: string[];
  setWhitelist: (pairs: string[]) => void;
  blacklist: string[];
  setBlacklist: (pairs: string[]) => void;
  tickers: TickerData[];
  selectedExchange: string;
  setSelectedExchange: (ex: string) => void;
}

export const PairlistManager: React.FC<PairlistManagerProps> = ({
  whitelist,
  setWhitelist,
  blacklist,
  setBlacklist,
  tickers,
  selectedExchange,
  setSelectedExchange,
}) => {
  const [newPair, setNewPair] = useState('');
  const [newBlacklistPattern, setNewBlacklistPattern] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const exchanges = [
    { id: 'binance', name: 'Binance', type: 'Spot & Futures', fee: '0.075%', pairsCount: 380, latency: '18ms' },
    { id: 'bybit', name: 'Bybit', type: 'USDT Perpetual', fee: '0.060%', pairsCount: 310, latency: '24ms' },
    { id: 'okx', name: 'OKX', type: 'Unified Margin', fee: '0.080%', pairsCount: 290, latency: '28ms' },
    { id: 'kraken', name: 'Kraken', type: 'Spot & Margin', fee: '0.160%', pairsCount: 210, latency: '42ms' },
    { id: 'kucoin', name: 'KuCoin', type: 'Spot', fee: '0.100%', pairsCount: 340, latency: '35ms' },
    { id: 'bitget', name: 'Bitget', type: 'Futures & Copy', fee: '0.060%', pairsCount: 260, latency: '29ms' },
  ];

  const handleAddPair = () => {
    if (!newPair.trim()) return;
    const formatted = newPair.toUpperCase().includes('/') ? newPair.toUpperCase() : `${newPair.toUpperCase()}/USDT`;
    if (!whitelist.includes(formatted)) {
      setWhitelist([...whitelist, formatted]);
    }
    setNewPair('');
  };

  const handleRemovePair = (pair: string) => {
    setWhitelist(whitelist.filter((p) => p !== pair));
  };

  const handleAddBlacklist = () => {
    if (!newBlacklistPattern.trim()) return;
    if (!blacklist.includes(newBlacklistPattern)) {
      setBlacklist([...blacklist, newBlacklistPattern]);
    }
    setNewBlacklistPattern('');
  };

  const handleRemoveBlacklist = (item: string) => {
    setBlacklist(blacklist.filter((b) => b !== item));
  };

  const filteredTickers = tickers.filter((t) =>
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner & Exchange Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                CCXT Multi-Exchange & Dynamic Pairlist Manager
              </h2>
              <p className="text-xs text-slate-400">
                Freqtrade supports 30+ crypto exchanges via CCXT with real-time order routing & volumetric filtering
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            🟢 CCXT Connected
          </span>
        </div>

        {/* Exchange Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {exchanges.map((ex) => {
            const isSelected = selectedExchange === ex.id;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExchange(ex.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">{ex.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <div className="text-[10px] text-slate-400">{ex.type}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-2 flex justify-between">
                  <span>Fee: {ex.fee}</span>
                  <span className="text-emerald-400 font-bold">{ex.latency}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Pairlist Filter Pipeline Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Active Dynamic Pairlist Filter Pipeline
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Executed every candle tick</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-emerald-400 font-bold text-[11px] mb-1">1. VolumePairList</div>
            <div className="text-slate-300">Top 20 pairs sorted by 24h quote volume in USDT.</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-blue-400 font-bold text-[11px] mb-1">2. PriceFilter</div>
            <div className="text-slate-300">Min: $0.005 | Max: $150,000 (discards illiquid dust).</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-amber-400 font-bold text-[11px] mb-1">3. SpreadFilter</div>
            <div className="text-slate-300">Max allowable bid/ask spread: 0.5% (slippage guard).</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-indigo-400 font-bold text-[11px] mb-1">4. RangeStabilityFilter</div>
            <div className="text-slate-300">Checks 24h volatility boundary to prevent dead coins.</div>
          </div>
        </div>
      </div>

      {/* Whitelist & Blacklist Dual Column Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Whitelist Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="font-bold text-white text-sm">Whitelist Pairs ({whitelist.length})</h3>
              <p className="text-[11px] text-slate-400">Assets actively monitored for strategy buy signals</p>
            </div>
          </div>

          {/* Add pair input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newPair}
              onChange={(e) => setNewPair(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPair()}
              placeholder="e.g. ADA/USDT, SUI/USDT"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddPair}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* Whitelist Tags */}
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800/80 custom-scrollbar">
            {whitelist.map((pair) => (
              <span
                key={pair}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-2 group hover:border-emerald-500/50 transition-colors"
              >
                <span>{pair}</span>
                <button
                  onClick={() => handleRemovePair(pair)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Blacklist Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Blacklist Regex Patterns ({blacklist.length})
              </h3>
              <p className="text-[11px] text-slate-400">Excluded tokens, leveraged ETF tokens, stable pairs</p>
            </div>
          </div>

          {/* Add blacklist input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newBlacklistPattern}
              onChange={(e) => setNewBlacklistPattern(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBlacklist()}
              placeholder="e.g. .*UP/.*, TUSD/USDT"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-rose-500"
            />
            <button
              onClick={handleAddBlacklist}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Exclude
            </button>
          </div>

          {/* Blacklist Tags */}
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800/80 custom-scrollbar">
            {blacklist.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-rose-950/20 border border-rose-500/30 text-rose-300 flex items-center gap-2 group hover:border-rose-500 transition-colors"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveBlacklist(item)}
                  className="text-rose-400 hover:text-rose-200 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
