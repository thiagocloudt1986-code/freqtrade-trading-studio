import React, { useState } from 'react';
import {
  Terminal,
  Trash2,
  Pause,
  Play,
  Filter,
  Download,
  Copy,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';
import { LogEntry } from '../../types';

interface LogsTerminalProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onRunCliCommand: (cmd: string) => void;
}

export const LogsTerminal: React.FC<LogsTerminalProps> = ({
  logs,
  onClearLogs,
  onRunCliCommand,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [cliInput, setCliInput] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = filterLevel === 'ALL' || l.level === filterLevel;
    const matchesSearch =
      l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level}] ${l.module}: ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    onRunCliCommand(cliInput.trim());
    setCliInput('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Freqtrade Process Logs & CLI Console</h2>
            <p className="text-xs text-slate-400">Live stdout/stderr stream from Freqtrade bot daemon</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono w-40"
            />
          </div>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
          >
            <option value="ALL">ALL LEVELS</option>
            <option value="INFO">INFO</option>
            <option value="FREQAI">FREQAI</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Copy Logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal View Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
        {/* Terminal Header */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 ml-2 font-bold">freqtrade trade --config config.json --strategy NostalgiaForInfinityX_FreqAI</span>
          </div>
          <span className="text-emerald-400 font-semibold">PID: 4892 (Active)</span>
        </div>

        {/* Log Entries View */}
        <div className="p-4 h-[440px] overflow-y-auto space-y-1.5 custom-scrollbar text-[11px]">
          {filteredLogs.map((log) => {
            const levelColor =
              log.level === 'FREQAI'
                ? 'text-indigo-400 font-bold'
                : log.level === 'INFO'
                ? 'text-emerald-400'
                : log.level === 'WARNING'
                ? 'text-amber-400 font-bold'
                : log.level === 'ERROR'
                ? 'text-rose-400 font-bold'
                : 'text-slate-500';

            return (
              <div key={log.id} className="leading-relaxed hover:bg-slate-900/50 px-1 py-0.5 rounded transition-colors flex gap-2">
                <span className="text-slate-500 select-none">[{log.timestamp}]</span>
                <span className={`w-16 ${levelColor} select-none`}>[{log.level}]</span>
                <span className="text-slate-400 select-none">{log.module}:</span>
                <span className="text-slate-200 flex-1">{log.message}</span>
              </div>
            );
          })}
        </div>

        {/* Interactive CLI Input Line */}
        <form onSubmit={handleCliSubmit} className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold pl-2">freqtrade&gt;</span>
          <input
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder="Try: download-data --pairs SOL/USDT --days 30 or hyperopt --epochs 50"
            className="flex-1 bg-transparent text-emerald-300 text-xs outline-none font-mono placeholder-slate-600"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors"
          >
            Execute
          </button>
        </form>
      </div>

      {/* Suggested Quick CLI Commands */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="text-slate-400 py-1">Quick Commands:</span>
        <button
          onClick={() => onRunCliCommand('freqtrade download-data --pairs BTC/USDT ETH/USDT SOL/USDT --timeframes 5m 1h --days 90')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
        >
          download-data
        </button>
        <button
          onClick={() => onRunCliCommand('freqtrade backtesting --strategy NostalgiaForInfinityX_FreqAI --timerange 20250101-')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
        >
          backtesting
        </button>
        <button
          onClick={() => onRunCliCommand('freqtrade hyperopt --hyperopt-loss SharpeHyperOptLoss --epochs 100')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
        >
          hyperopt
        </button>
        <button
          onClick={() => onRunCliCommand('freqtrade list-strategies')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
        >
          list-strategies
        </button>
      </div>
    </div>
  );
};
