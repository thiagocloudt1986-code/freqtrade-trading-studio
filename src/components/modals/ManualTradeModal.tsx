import React, { useState } from 'react';
import { X, PlusCircle, DollarSign, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { OpenTrade } from '../../types';

interface ManualTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterTrade: (trade: OpenTrade) => void;
  selectedPair: string;
  whitelist: string[];
  currentPrice: number;
}

export const ManualTradeModal: React.FC<ManualTradeModalProps> = ({
  isOpen,
  onClose,
  onEnterTrade,
  selectedPair,
  whitelist,
  currentPrice,
}) => {
  if (!isOpen) return null;

  const [pair, setPair] = useState(selectedPair);
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [stakeAmount, setStakeAmount] = useState(200);
  const [limitPrice, setLimitPrice] = useState(currentPrice);
  const [stoplossPct, setStoplossPct] = useState(5.0);
  const [roiTargetPct, setRoiTargetPct] = useState(3.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = orderType === 'market' ? currentPrice : limitPrice;
    const amount = +(stakeAmount / rate).toFixed(5);
    const stopLossRate = +(
      direction === 'long'
        ? rate * (1 - stoplossPct / 100)
        : rate * (1 + stoplossPct / 100)
    ).toFixed(2);
    const roiTargetRate = +(
      direction === 'long'
        ? rate * (1 + roiTargetPct / 100)
        : rate * (1 - roiTargetPct / 100)
    ).toFixed(2);

    const newTrade: OpenTrade = {
      id: Math.floor(Math.random() * 900) + 100,
      pair,
      direction,
      stakeAmount,
      amount,
      openRate: rate,
      currentRate: rate,
      currentProfit: 0,
      currentProfitPct: 0,
      roiTargetPct,
      roiTargetRate,
      stopLossPct: -stoplossPct,
      stopLossRate,
      initialStopLossRate: stopLossRate,
      trailingStopLoss: true,
      openTimestamp: Date.now(),
      openDate: 'Just now',
      durationMinutes: 1,
      leverage: 1,
      strategy: 'Manual_ForceEntry',
      timeframe: '5m',
      freqaiPrediction: {
        predictedGainPct: 3.2,
        dissimilarityIndex: 0.28,
        modelConfidence: 0.84,
      },
    };

    onEnterTrade(newTrade);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Forçar Entrada de Trade (Ordem Manual)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
          {/* Pair Selector */}
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Par / Ativo Whitelist</label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
            >
              {whitelist.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Direction toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDirection('long')}
              className={`py-2.5 rounded-xl font-black border-2 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                direction === 'long'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-950/60'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" /> LONG (Compra)
            </button>
            <button
              type="button"
              onClick={() => setDirection('short')}
              className={`py-2.5 rounded-xl font-black border-2 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                direction === 'short'
                  ? 'bg-rose-600 border-rose-400 text-white shadow-rose-950/60'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-300 hover:border-rose-500/40'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" /> SHORT (Venda)
            </button>
          </div>

          {/* Stake Amount */}
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Valor do Stake (USDT)</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              min="10"
              max="5000"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* Stoploss & ROI Targets */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Stop Loss (% Queda)</label>
              <input
                type="number"
                step="0.5"
                value={stoplossPct}
                onChange={(e) => setStoplossPct(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-rose-400 outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Alvo ROI Mínimo (%)</label>
              <input
                type="number"
                step="0.5"
                value={roiTargetPct}
                onChange={(e) => setRoiTargetPct(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-950"
            >
              Enviar Ordem para Exchange
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
