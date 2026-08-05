import React, { useState } from 'react';
import { BarChart3, Sliders, Play, Sparkles } from 'lucide-react';
import { BacktestStudio } from './BacktestStudio';
import { HyperOptViewer } from '../hyperopt/HyperOptViewer';
import { BacktestResults, HyperOptEpoch } from '../../types';

interface OptimizationHubProps {
  backtestResults: BacktestResults;
  onRunBacktest: (params: any) => void;
  isRunningBacktest: boolean;
  hyperoptEpochs: HyperOptEpoch[];
  onApplyHyperoptParams: (params: HyperOptEpoch['params']) => void;
  onRunHyperopt: (lossFunction: string, totalEpochs: number) => void;
  isRunningHyperopt: boolean;
}

export const OptimizationHub: React.FC<OptimizationHubProps> = ({
  backtestResults,
  onRunBacktest,
  isRunningBacktest,
  hyperoptEpochs,
  onApplyHyperoptParams,
  onRunHyperopt,
  isRunningHyperopt,
}) => {
  const [subTab, setSubTab] = useState<'backtest' | 'hyperopt'>('backtest');

  return (
    <div className="space-y-4">
      {/* Sub-navigation Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            id="opt-tab-backtest"
            onClick={() => setSubTab('backtest')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'backtest'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Simulador de Backtesting</span>
          </button>

          <button
            id="opt-tab-hyperopt"
            onClick={() => setSubTab('hyperopt')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'hyperopt'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>HyperOpt (Otimizador de Parâmetros)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono pr-2">
          <span>Validação Histórica & Otimização Bayesiana</span>
        </div>
      </div>

      {/* Render selected view */}
      {subTab === 'backtest' ? (
        <BacktestStudio
          backtestResults={backtestResults}
          onRunBacktest={onRunBacktest}
          isRunning={isRunningBacktest}
        />
      ) : (
        <HyperOptViewer
          epochs={hyperoptEpochs}
          onApplyParams={onApplyHyperoptParams}
          onRunHyperopt={onRunHyperopt}
          isRunningHyperopt={isRunningHyperopt}
        />
      )}
    </div>
  );
};
