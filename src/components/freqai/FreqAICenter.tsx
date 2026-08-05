import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  RefreshCw,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  BarChart4,
  Zap,
  CheckCircle2,
  HelpCircle,
  Play,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { FreqAIState } from '../../types';

interface FreqAICenterProps {
  freqaiState: FreqAIState;
  onRetrainModel: (algorithm: string, windowDays: number, diThreshold: number) => void;
  isRetraining: boolean;
}

export const FreqAICenter: React.FC<FreqAICenterProps> = ({
  freqaiState,
  onRetrainModel,
  isRetraining,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState(freqaiState.algorithm);
  const [trainDays, setTrainDays] = useState(freqaiState.trainWindowDays);
  const [diThreshold, setDiThreshold] = useState(freqaiState.dissimilarityThreshold);

  return (
    <div className="space-y-4">
      {/* FreqAI Top Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-400" /> FreqAI Adaptive Machine Learning Engine
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 Model Active & Scoring
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Adaptive ML Regressors & Real-Time Anomaly Filtration
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              FreqAI trains Machine Learning models on historical market features and retrains continuously in the background during live trading. Features include Dissimilarity Index (DI) to prevent trading unseen market regimes, and Outlier Cutoffs.
            </p>
          </div>

          {/* Quick Retrain Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRetrainModel(selectedAlgo, trainDays, diThreshold)}
              disabled={isRetraining}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
              {isRetraining ? 'Retraining Model...' : 'Trigger Adaptive Retrain'}
            </button>
          </div>
        </div>
      </div>

      {/* Model Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between mb-1">
            <span>Algorithm</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">{freqaiState.algorithm}</div>
          <div className="text-[10px] text-slate-400 font-mono">Gradient Boosted Trees</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between mb-1">
            <span>Candles Trained</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-base font-bold font-mono text-blue-400">
            {freqaiState.candlesTrained.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">{freqaiState.trainWindowDays} Days Window (5m)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between mb-1">
            <span>DI Threshold</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">
            {freqaiState.dissimilarityThreshold.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Current DI: {freqaiState.currentDI.toFixed(2)} (Safe)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between mb-1">
            <span>Model R² Score</span>
            <BarChart4 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-bold font-mono text-amber-400">
            {freqaiState.modelMetrics.r2Score.toFixed(3)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">MSE: {freqaiState.modelMetrics.mse}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between mb-1">
            <span>ML Win Rate</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">
            {freqaiState.modelMetrics.accuracyWinRate}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Precision on Longs</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between mb-1">
            <span>Last Retrained</span>
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base font-bold font-mono text-indigo-300">
            {freqaiState.lastTrainedTime}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Every {freqaiState.retrainIntervalHours}h Auto-Loop</div>
        </div>
      </div>

      {/* Main Grid: Feature Importance Chart & Real-Time Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Feature Importance Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <h3 className="font-bold text-white text-sm">Feature Importance Ranking (Gini Gain)</h3>
                <p className="text-[11px] text-slate-400">Relative impact of technical & orderbook features on price prediction</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Top 8 Features
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={freqaiState.featureImportance}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 70, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
                  <XAxis type="number" domain={[0, 0.22]} stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <YAxis type="category" dataKey="feature" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#cbd5e1' }} width={90} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-2 rounded-lg text-xs font-mono shadow-xl">
                            <div className="font-bold text-indigo-300">{item.feature}</div>
                            <div className="text-slate-300">Importance: {(item.importance * 100).toFixed(2)}%</div>
                            <div className="text-slate-400 text-[10px] mt-1">{item.description}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="importance" fill="#6366f1" radius={[0, 4, 4, 0]}>
                    {freqaiState.featureImportance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : index < 3 ? '#6366f1' : '#4f46e5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Features automatically extracted via <code className="text-indigo-300 font-mono">feature_engineering_expand_all()</code></span>
            <span className="text-[11px] font-mono text-emerald-400">Auto Normalization: Z-Score</span>
          </div>
        </div>

        {/* Retraining Configuration & Dissimilarity Explanation (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-400" /> FreqAI Hyperparameters & Pipeline
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {/* Algorithm select */}
              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">Model Architecture</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['LightGBM', 'XGBoost', 'CatBoost'] as const).map((algo) => (
                    <button
                      key={algo}
                      onClick={() => setSelectedAlgo(algo)}
                      className={`py-1.5 px-2 rounded-lg font-mono font-semibold text-xs border transition-all ${
                        selectedAlgo === algo
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Window Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Training Rolling Window</span>
                  <span className="font-mono text-indigo-300 font-bold">{trainDays} Days ({trainDays * 288} candles)</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="90"
                  value={trainDays}
                  onChange={(e) => setTrainDays(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg"
                />
              </div>

              {/* DI Threshold */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Dissimilarity Index (DI) Threshold</span>
                  <span className="font-mono text-emerald-400 font-bold">{diThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.05"
                  value={diThreshold}
                  onChange={(e) => setDiThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg"
                />
              </div>

              {/* DI Explanation card */}
              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-slate-300 leading-relaxed">
                <div className="font-bold text-indigo-300 flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Dissimilarity Protection (DI)
                </div>
                If current market conditions deviate significantly from the training distribution (DI &gt; {diThreshold}), FreqAI automatically disables entries (<code className="text-amber-300">do_predict=0</code>) to protect capital during black swans.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => onRetrainModel(selectedAlgo, trainDays, diThreshold)}
              disabled={isRetraining}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Save & Trigger Retrain
            </button>
          </div>
        </div>
      </div>

      {/* Live FreqAI Prediction Scanner Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Real-Time FreqAI Multi-Pair Prediction Matrix
            </h3>
            <p className="text-[11px] text-slate-400">Live inference for all pairs in whitelist using active model weights</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Target Horizon: +12 Candles (1 hour)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                <th className="pb-2">Pair</th>
                <th className="pb-2">Predicted Target (&-s_close_target)</th>
                <th className="pb-2">Dissimilarity Score (DI)</th>
                <th className="pb-2">DI Safety Status</th>
                <th className="pb-2">Signal Recommendation</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {freqaiState.liveSignals.map((sig) => (
                <tr key={sig.pair} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 font-bold text-white">{sig.pair}</td>
                  <td className="py-2.5">
                    <span className={`font-bold ${sig.targetGainPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {sig.targetGainPct >= 0 ? '+' : ''}{sig.targetGainPct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="font-semibold text-slate-300">{sig.diScore.toFixed(2)}</span>
                  </td>
                  <td className="py-2.5">
                    {sig.diScore <= freqaiState.dissimilarityThreshold ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SAFE (DI &lt; {freqaiState.dissimilarityThreshold})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        ANOMALY (DI &gt; {freqaiState.dissimilarityThreshold})
                      </span>
                    )}
                  </td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sig.recommendation.includes('STRONG BUY')
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                        : sig.recommendation.includes('BUY')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : sig.recommendation.includes('STANDBY')
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sig.recommendation}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="text-[11px] text-slate-400">
                      {sig.validSignal ? '🟢 Auto-Entry Ready' : '⏸️ Standby'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
