import React, { useState } from 'react';
import { ListFilter, Send, Terminal, Settings } from 'lucide-react';
import { PairlistManager } from '../pairlist/PairlistManager';
import { TelegramSimulator } from '../telegram/TelegramSimulator';
import { LogsTerminal } from '../logs/LogsTerminal';
import { ConfigEditor } from '../config/ConfigEditor';
import {
  OpenTrade,
  ClosedTrade,
  BotStatus,
  TickerData,
  LogEntry,
  FreqtradeConfig,
} from '../../types';

interface ToolsHubProps {
  // Pairlist
  whitelist: string[];
  setWhitelist: React.Dispatch<React.SetStateAction<string[]>>;
  blacklist: string[];
  setBlacklist: React.Dispatch<React.SetStateAction<string[]>>;
  tickers: TickerData[];
  selectedExchange: string;
  setSelectedExchange: (exchange: string) => void;

  // Telegram
  openTrades: OpenTrade[];
  closedTrades: ClosedTrade[];
  totalBalance: number;
  botStatus: BotStatus;
  onForceExitTrade: (id: number) => void;
  onSetBotStatus: (status: BotStatus) => void;

  // Logs
  logs: LogEntry[];
  onClearLogs: () => void;
  onRunCliCommand: (cmd: string) => void;

  // Config
  config: FreqtradeConfig;
  onSaveConfig: (newConfig: FreqtradeConfig) => void;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({
  whitelist,
  setWhitelist,
  blacklist,
  setBlacklist,
  tickers,
  selectedExchange,
  setSelectedExchange,
  openTrades,
  closedTrades,
  totalBalance,
  botStatus,
  onForceExitTrade,
  onSetBotStatus,
  logs,
  onClearLogs,
  onRunCliCommand,
  config,
  onSaveConfig,
}) => {
  const [activeTool, setActiveTool] = useState<'pairlist' | 'telegram' | 'logs' | 'config'>('pairlist');

  const tools = [
    { id: 'pairlist', label: 'Pairlists & CCXT', icon: ListFilter, desc: 'Filtros de pares e exchanges' },
    { id: 'telegram', label: 'Telegram Webhooks', icon: Send, desc: 'Alertas e comandos remotos' },
    { id: 'logs', label: 'Logs & Terminal CLI', icon: Terminal, desc: 'Console de execução em tempo real' },
    { id: 'config', label: 'Config.json & Docker', icon: Settings, desc: 'Parâmetros de produção do bot' },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Sub-navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                id={`tool-tab-${t.id}`}
                onClick={() => setActiveTool(t.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render active tool */}
      {activeTool === 'pairlist' && (
        <PairlistManager
          whitelist={whitelist}
          setWhitelist={setWhitelist}
          blacklist={blacklist}
          setBlacklist={setBlacklist}
          tickers={tickers}
          selectedExchange={selectedExchange}
          setSelectedExchange={setSelectedExchange}
        />
      )}

      {activeTool === 'telegram' && (
        <TelegramSimulator
          openTrades={openTrades}
          closedTrades={closedTrades}
          totalBalance={totalBalance}
          botStatus={botStatus}
          onForceExitTrade={onForceExitTrade}
          onSetBotStatus={onSetBotStatus}
        />
      )}

      {activeTool === 'logs' && (
        <LogsTerminal
          logs={logs}
          onClearLogs={onClearLogs}
          onRunCliCommand={onRunCliCommand}
        />
      )}

      {activeTool === 'config' && (
        <ConfigEditor
          config={config}
          onSaveConfig={onSaveConfig}
        />
      )}
    </div>
  );
};
