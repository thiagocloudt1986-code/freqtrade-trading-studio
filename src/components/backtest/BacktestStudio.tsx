import React, { useState } from 'react';
import {
  Play,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ShieldAlert,
  Percent,
  Flame,
  Award,
  Clock,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BacktestResults, BacktestParams } from '../../types';

interface BacktestStudioProps {
  backtestResults: BacktestResults;
  onRunBacktest: (params: BacktestParams) => void;
  isRunning: boolean;
}

export const BacktestStudio: React.FC<BacktestStudioProps> = ({
  backtestResults,
  onRunBacktest,
  isRunning,
}) => {
  const [strategy, setStrategy] = useState('NostalgiaForInfinityX_FreqAI');
  const [timeframe, setTimeframe] = useState('5m');
  const [timerangeDays, setTimerangeDays] = useState(60);
  const [startingCapital, setStartingCapital] = useState(10000);
  const [maxOpenTrades, setMaxOpenTrades] = useState(5);
  const [enableFreqAI, setEnableFreqAI] = useState(true);
  const [stoploss, setStoploss] = useState(-0.065);
  const [trailingStop, setTrailingStop] = useState(true);

  const { summary, equityCurve, monthlyReturns, exitReasons, pairPerformance } = backtestResults;

  const handleStart = () => {
    onRunBacktest({
      strategyName: strategy,
      timeframe,
      timerangeDays,
      startingCapital,
      maxOpenTrades,
      stakeAmount: startingCapital / maxOpenTrades,
      enableFreqAI,
      stoploss,
      trailingStop,
      selectedPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'NEAR/USDT', 'SUI/USDT', 'AVAX/USDT', 'LINK/USDT', 'DOGE/USDT'],
    });
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-4">
      {/* Parameter Configuration & Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Freqtrade Backtesting Engine</h2>
              <p className="text-xs text-slate-400">Auditoria estatística quantitativa contra dados reais de velas OHLCV de exchanges CCXT</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isRunning}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Executando Backtest...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Executar Backtest (freqtrade backtesting)
              </>
            )}
          </button>
        </div>

        {/* Inputs Form */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Strategy</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
            >
              <option value="NostalgiaForInfinityX_FreqAI">NostalgiaForInfinityX (FreqAI)</option>
              <option value="FreqAI_AdaptiveLightGBM">FreqAI_AdaptiveLightGBM</option>
              <option value="BbandRsi_Scalper">BbandRsi_Scalper</option>
              <option value="SMAOffsetProtectOptV1">SMAOffsetProtectOptV1</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
            >
              <option value="1m">1m</option>
              <option value="5m">5m (Recommended)</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Timerange</label>
            <select
              value={timerangeDays}
              onChange={(e) => setTimerangeDays(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={60}>Last 60 Days (2 Months)</option>
              <option value={90}>Last 90 Days</option>
              <option value={180}>Last 180 Days (6 Months)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Starting Capital (USDT)</label>
            <input
              type="number"
              value={startingCapital}
              onChange={(e) => setStartingCapital(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
            >
            </input>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Max Open Trades</label>
            <select
              value={maxOpenTrades}
              onChange={(e) => setMaxOpenTrades(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
            >
              <option value={3}>3 concurrent trades</option>
              <option value={5}>5 concurrent trades</option>
              <option value={8}>8 concurrent trades</option>
              <option value={10}>10 concurrent trades</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">FreqAI ML Integration</label>
            <button
              onClick={() => setEnableFreqAI(!enableFreqAI)}
              className={`w-full p-2 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors ${
                enableFreqAI
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {enableFreqAI ? 'FreqAI ON' : 'Pure TA (OFF)'}
            </button>
          </div>
        </div>
      </div>

      {/* Backtest KPI Performance Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">Total Return</div>
          <div className="text-base font-bold font-mono text-emerald-400">+{summary.totalProfitPct.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-400 font-mono">+${summary.totalProfitUsdt.toFixed(2)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">Total Trades</div>
          <div className="text-base font-bold font-mono text-white">{summary.totalTrades}</div>
          <div className="text-[10px] text-slate-400 font-mono">{summary.wins}W / {summary.losses}L</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">Win Rate</div>
          <div className="text-base font-bold font-mono text-blue-400">{summary.winRatePct.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-400 font-mono">Profit Factor: {summary.profitFactor.toFixed(2)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">Sharpe Ratio</div>
          <div className="text-base font-bold font-mono text-amber-400">{summary.sharpeRatio.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 font-mono">Sortino: {summary.sortinoRatio.toFixed(2)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">Max Drawdown</div>
          <div className="text-base font-bold font-mono text-rose-400">-{summary.maxDrawdownPct.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-400 font-mono">-${summary.maxDrawdownUsdt.toFixed(0)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">CAGR (Annual)</div>
          <div className="text-base font-bold font-mono text-emerald-400">+{summary.cagrPct.toFixed(0)}%</div>
          <div className="text-[10px] text-slate-400 font-mono">Calmar: {summary.calmarRatio.toFixed(2)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">Avg Duration</div>
          <div className="text-base font-bold font-mono text-indigo-300">{summary.avgTradeDuration}</div>
          <div className="text-[10px] text-slate-400 font-mono">Per Trade</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-[11px] mb-0.5">Avg Trade PnL</div>
          <div className="text-base font-bold font-mono text-emerald-400">+{summary.avgProfitPerTradePct.toFixed(2)}%</div>
          <div className="text-[10px] text-slate-400 font-mono">Expectancy: +1.28%</div>
        </div>
      </div>

      {/* Cumulative Equity Curve & Drawdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Equity Curve (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Cumulative Portfolio Growth vs Buy & Hold BTC</h3>
              <p className="text-[11px] text-slate-400">Strategy balance progression across backtest timeframe</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Freqtrade Strategy
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> BTC Benchmark
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs font-mono shadow-xl">
                          <div className="text-slate-400 font-bold mb-1">{label}</div>
                          <div className="text-emerald-400 font-bold">Strategy: ${data.balance.toLocaleString()} (+${data.profitUsdt})</div>
                          <div className="text-slate-400">BTC Benchmark: ${data.benchmarkBtcBalance.toLocaleString()}</div>
                          <div className="text-rose-400 text-[10px] mt-0.5">Drawdown: {data.drawdownPct}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2.5} fill="url(#colorBal)" />
                <Line type="monotone" dataKey="benchmarkBtcBalance" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exit Reasons Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-2 mb-3">
              <h3 className="font-bold text-white text-sm">Exit Reasons Distribution</h3>
              <p className="text-[11px] text-slate-400">How trades were closed by Freqtrade core</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exitReasons}
                    dataKey="count"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {exitReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-2 rounded text-xs font-mono">
                            <div className="font-bold text-white">{d.reason.replace(/_/g, ' ').toUpperCase()}</div>
                            <div className="text-slate-300">{d.count} trades ({d.pct}%)</div>
                            <div className={d.profitUsdt >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              Net: ${d.profitUsdt.toFixed(2)}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono">
            {exitReasons.map((r, i) => (
              <div key={r.reason} className="flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span>{r.reason.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <span className="font-bold text-white">{r.count} ({r.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Pair Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div>
            <h3 className="font-bold text-white text-sm">Pair Performance Breakdown (Whitelist Stats)</h3>
            <p className="text-[11px] text-slate-400">Detailed metrics per traded asset</p>
          </div>
          <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors">
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                <th className="pb-2">Pair</th>
                <th className="pb-2">Total Trades</th>
                <th className="pb-2">Wins / Losses</th>
                <th className="pb-2">Win Rate</th>
                <th className="pb-2">Total Profit ($)</th>
                <th className="pb-2">Total Return (%)</th>
                <th className="pb-2">Avg Profit / Trade</th>
                <th className="pb-2 text-right">Avg Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pairPerformance.map((p) => (
                <tr key={p.pair} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 font-bold text-white">{p.pair}</td>
                  <td className="py-2.5 text-slate-300">{p.trades}</td>
                  <td className="py-2.5 text-slate-300">
                    <span className="text-emerald-400">{p.wins}W</span> / <span className="text-rose-400">{p.trades - p.wins}L</span>
                  </td>
                  <td className="py-2.5 font-bold text-blue-400">{p.winRate.toFixed(1)}%</td>
                  <td className="py-2.5 font-bold text-emerald-400">+${p.totalProfitUsdt.toFixed(2)}</td>
                  <td className="py-2.5 font-bold text-emerald-400">+{p.totalProfitPct.toFixed(2)}%</td>
                  <td className="py-2.5 text-emerald-300">+{p.avgProfitPct.toFixed(2)}%</td>
                  <td className="py-2.5 text-slate-400 text-right">{p.avgDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
