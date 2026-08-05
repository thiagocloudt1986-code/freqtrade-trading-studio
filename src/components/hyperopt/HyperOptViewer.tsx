import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Trophy,
  TrendingUp,
  Percent,
  Play,
  Copy,
  Check,
  CheckCircle2,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { HyperOptEpoch } from '../../types';

interface HyperOptViewerProps {
  epochs: HyperOptEpoch[];
  onApplyParams: (params: HyperOptEpoch['params']) => void;
  onRunHyperopt: (lossFunction: string, totalEpochs: number) => void;
  isRunningHyperopt: boolean;
}

export const HyperOptViewer: React.FC<HyperOptViewerProps> = ({
  epochs,
  onApplyParams,
  onRunHyperopt,
  isRunningHyperopt,
}) => {
  const [lossFunction, setLossFunction] = useState('SharpeHyperOptLoss');
  const [targetEpochs, setTargetEpochs] = useState(100);
  const [copied, setCopied] = useState(false);
  const [selectedEpoch, setSelectedEpoch] = useState<HyperOptEpoch>(
    epochs.find((e) => e.isBest) || epochs[0]
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedEpoch.params, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & HyperOpt Config */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Freqtrade HyperOpt (Hyperparameter Optimization)
              </h2>
              <p className="text-xs text-slate-400">
                Explore parameter space using Bayesian search algorithms (<code className="text-amber-300 font-mono">scikit-optimize</code>)
              </p>
            </div>
          </div>

          <button
            onClick={() => onRunHyperopt(lossFunction, targetEpochs)}
            disabled={isRunningHyperopt}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            {isRunningHyperopt ? 'Optimizing Parameters...' : 'Launch HyperOpt Run'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Hyperopt Loss Function</label>
            <select
              value={lossFunction}
              onChange={(e) => setLossFunction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-amber-500 outline-none"
            >
              <option value="SharpeHyperOptLoss">SharpeHyperOptLoss (Risk-Adjusted Return)</option>
              <option value="SortinoHyperOptLoss">SortinoHyperOptLoss (Downside Deviation)</option>
              <option value="ProfitDrawDownHyperOptLoss">ProfitDrawDownHyperOptLoss (Profit / Max Drawdown)</option>
              <option value="CalmarHyperOptLoss">CalmarHyperOptLoss (CAGR / Max Drawdown)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Total Epochs (Iterations)</label>
            <select
              value={targetEpochs}
              onChange={(e) => setTargetEpochs(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-amber-500 outline-none"
            >
              <option value={50}>50 Epochs (Quick Scan)</option>
              <option value={100}>100 Epochs (Standard)</option>
              <option value={500}>500 Epochs (Thorough Deep Search)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Optimization Spaces</label>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-xs flex items-center justify-between">
              <span>ROI • Stoploss • Trailing • Indicators</span>
              <span className="text-amber-400 text-[10px]">ALL SPACES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Epoch Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/40 rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best Epoch #{selectedEpoch.epoch}
              </span>
              <span className="text-xs font-mono text-slate-400">Loss Score: {selectedEpoch.loss.toFixed(3)}</span>
            </div>
            <div className="text-sm font-bold text-white">
              Total Return: <span className="text-emerald-400">+{selectedEpoch.totalProfitPct}%</span> (${selectedEpoch.totalProfitUsdt}) • Win Rate: <span className="text-blue-400">{selectedEpoch.winRatePct}%</span> • Drawdown: <span className="text-rose-400">-{selectedEpoch.drawdownPct}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON!' : 'Copy Hyperopt JSON'}
            </button>

            <button
              onClick={() => onApplyParams(selectedEpoch.params)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> Apply to Strategy Code
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Scatter Plot of Epochs & Parameter Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Scatter Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">HyperOpt Epochs Convergence (Profit vs Drawdown)</h3>
              <p className="text-[11px] text-slate-400">Click any dot to inspect parameter weights</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis type="number" dataKey="drawdownPct" name="Drawdown" unit="%" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Drawdown % (Lower is better)', position: 'bottom', fill: '#64748b', fontSize: 10 }} />
                <YAxis type="number" dataKey="totalProfitPct" name="Total Profit" unit="%" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Profit %', angle: -90, position: 'left', fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data: HyperOptEpoch = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs font-mono shadow-xl">
                          <div className="font-bold text-amber-400">Epoch #{data.epoch} {data.isBest ? '🏆 (BEST)' : ''}</div>
                          <div className="text-emerald-400">Profit: +{data.totalProfitPct}% (${data.totalProfitUsdt})</div>
                          <div className="text-blue-400">Win Rate: {data.winRatePct}%</div>
                          <div className="text-rose-400">Drawdown: -{data.drawdownPct}%</div>
                          <div className="text-slate-400 text-[10px] mt-1">Loss: {data.loss}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter
                  data={epochs}
                  fill="#f59e0b"
                  onClick={(node: any) => setSelectedEpoch(node)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Epoch Parameter Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="font-bold text-white text-sm">Parameters for Epoch #{selectedEpoch.epoch}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedEpoch.isBest ? 'BEST CONFIGURATION' : 'TRIAL CONFIG'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Minimal ROI Table</div>
                <div className="grid grid-cols-3 gap-2 text-slate-200">
                  <div>0m: <span className="text-emerald-400 font-bold">{(selectedEpoch.params.roi_0 * 100).toFixed(1)}%</span></div>
                  <div>20m: <span className="text-emerald-400 font-bold">{(selectedEpoch.params.roi_20 * 100).toFixed(1)}%</span></div>
                  <div>60m: <span className="text-emerald-400 font-bold">{(selectedEpoch.params.roi_60 * 100).toFixed(1)}%</span></div>
                </div>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Stoploss & Trailing</div>
                <div className="grid grid-cols-2 gap-2 text-slate-200">
                  <div>Stoploss: <span className="text-rose-400 font-bold">{(selectedEpoch.params.stoploss * 100).toFixed(1)}%</span></div>
                  <div>Trailing Pos: <span className="text-blue-400 font-bold">{(selectedEpoch.params.trailing_stop_positive * 100).toFixed(1)}%</span></div>
                  <div className="col-span-2">Trailing Offset: <span className="text-blue-400 font-bold">{(selectedEpoch.params.trailing_stop_positive_offset * 100).toFixed(1)}%</span></div>
                </div>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Indicator Thresholds</div>
                <div className="grid grid-cols-2 gap-2 text-slate-200">
                  <div>RSI Buy: <span className="text-amber-400 font-bold">&lt; {selectedEpoch.params.rsi_buy_threshold}</span></div>
                  <div>RSI Sell: <span className="text-amber-400 font-bold">&gt; {selectedEpoch.params.rsi_sell_threshold}</span></div>
                  <div>EMA Fast: <span className="text-cyan-400 font-bold">{selectedEpoch.params.ema_fast}</span></div>
                  <div>EMA Slow: <span className="text-cyan-400 font-bold">{selectedEpoch.params.ema_slow}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-3">
            <button
              onClick={() => onApplyParams(selectedEpoch.params)}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Apply Parameters to Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
