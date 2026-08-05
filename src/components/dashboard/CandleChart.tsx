import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
} from 'recharts';
import {
  Brain,
  Eye,
  EyeOff,
  Pin,
  MessageSquare,
  Sparkles,
  Layers,
  Crosshair,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Zap,
  Clock,
} from 'lucide-react';
import { CandleData, TimeframeKey } from '../../types';
import { calculateMultiTimeframeConfluence } from '../../utils/consensusEngine';

interface CandleChartProps {
  pair: string;
  candles: CandleData[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  currentPrice: number;
}

export const CandleChart: React.FC<CandleChartProps> = ({
  pair,
  candles,
  timeframe,
  onTimeframeChange,
  currentPrice,
}) => {
  const [showEMA, setShowEMA] = useState(true);
  const [showBB, setShowBB] = useState(true);
  const [showFreqAI, setShowFreqAI] = useState(true);
  const [subChart, setSubChart] = useState<'rsi' | 'macd' | 'freqai_di'>('rsi');
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [tooltipMode, setTooltipMode] = useState<'fixed' | 'floating' | 'none'>('fixed');

  const minPrice = Math.min(...candles.map((c) => c.low)) * 0.995;
  const maxPrice = Math.max(...candles.map((c) => c.high)) * 1.005;

  const timeframes: TimeframeKey[] = ['1m', '5m', '15m', '1h', '4h', '1d'];
  const latestCandle = candles[candles.length - 1] || null;
  const displayCandle = hoveredCandle || latestCandle;

  // Multi-Timeframe Confluence calculation for the current pair
  const mtfConfluence = calculateMultiTimeframeConfluence(pair, currentPrice, 3.5);

  // Candle price variation
  const candleChangePct = displayCandle
    ? +(((displayCandle.close - displayCandle.open) / displayCandle.open) * 100).toFixed(2)
    : 0;
  const isBullish = candleChangePct >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
      {/* Chart Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-wide">{pair}</span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-black bg-emerald-600 text-white border border-emerald-400 shadow-xs">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Feed Spot CCXT • Estratégia: NostalgiaForInfinityX</p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-0.5 rounded text-xs font-mono transition-colors ${
                  timeframe === tf
                    ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Indicator & Display Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tooltip / Info Position Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTooltipMode('fixed')}
              title="Fixar informações no topo (sem cobrir o gráfico)"
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono transition-colors ${
                tooltipMode === 'fixed'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Pin className="w-3 h-3" />
              Barra Fixa
            </button>
            <button
              onClick={() => setTooltipMode('floating')}
              title="Card flutuante seguindo o cursor"
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono transition-colors ${
                tooltipMode === 'floating'
                  ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              Flutuante
            </button>
          </div>

          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border font-mono transition-colors ${
              showEMA
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {showEMA ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            EMA (20/50/200)
          </button>

          <button
            onClick={() => setShowBB(!showBB)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border font-mono transition-colors ${
              showBB
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {showBB ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Bollinger Bands
          </button>

          <button
            onClick={() => setShowFreqAI(!showFreqAI)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border font-mono transition-colors ${
              showFreqAI
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Brain className="w-3 h-3 text-indigo-400" />
            Alvo Previsto FreqAI
          </button>

          {/* Sub-chart toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSubChart('rsi')}
              className={`px-2 py-0.5 rounded font-mono ${
                subChart === 'rsi' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setSubChart('macd')}
              className={`px-2 py-0.5 rounded font-mono ${
                subChart === 'macd' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              MACD
            </button>
            <button
              onClick={() => setSubChart('freqai_di')}
              className={`px-2 py-0.5 rounded font-mono flex items-center gap-1 ${
                subChart === 'freqai_di' ? 'bg-indigo-900/60 text-indigo-200 font-bold' : 'text-slate-400'
              }`}
            >
              <Brain className="w-2.5 h-2.5" /> DI (Regime)
            </button>
          </div>
        </div>
      </div>

      {/* MULTI-TIMEFRAME SOLID BASE RIBBON */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-slate-300 font-bold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Confluência MTF ({pair}):</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {timeframes.map((tf) => {
              const tfData = mtfConfluence.timeframes[tf];
              const isSelectedTf = timeframe === tf;
              const isBuy = tfData.bias === 'COMPRA';
              const isSell = tfData.bias === 'VENDA';

              return (
                <button
                  key={tf}
                  onClick={() => onTimeframeChange(tf)}
                  title={`${tf.toUpperCase()}: ${tfData.bias} (${tfData.score >= 0 ? '+' : ''}${tfData.score} pts) • ${tfData.summary}`}
                  className={`px-2 py-0.5 rounded text-[10px] font-black border transition-all flex items-center gap-1 cursor-pointer ${
                    isSelectedTf ? 'ring-2 ring-white scale-105' : ''
                  } ${
                    isBuy
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs hover:bg-emerald-500'
                      : isSell
                      ? 'bg-rose-600 text-white border-rose-400 shadow-xs hover:bg-rose-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span className="uppercase font-bold">{tf}:</span>
                  <span>
                    {tfData.bias}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Solid Base Badge */}
        <div className="flex items-center gap-2">
          {mtfConfluence.isSolidConfluence ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white border border-emerald-400 font-black text-[11px] shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Base Sólida Confirmada ({mtfConfluence.alignedCount}/6 Tempos)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 text-white border border-amber-400 font-black text-[11px] shadow-sm" title={mtfConfluence.contradictionReason || 'Sinais divergentes'}>
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Sinal Bloqueado: Divergência entre Tempos</span>
            </div>
          )}
        </div>
      </div>

      {/* FIXED OHLC & INDICATOR STATUS BAR (Nunca tampa as velas do gráfico) */}
      {displayCandle && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs font-mono">
          {/* Header left: Pair, Time & Live Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <span className={`w-2 h-2 rounded-full ${hoveredCandle ? 'bg-amber-400 ring-2 ring-amber-400/20' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{pair}</span>
              <span className="text-slate-400 font-normal">({timeframe})</span>
              <span className="text-slate-400 font-normal">• {displayCandle.time}</span>
            </span>
            {hoveredCandle ? (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                Ponto Inspecionado
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                Ao Vivo
              </span>
            )}
          </div>

          {/* OHLC Values */}
          <div className="flex items-center gap-3 flex-wrap text-slate-300">
            <span>
              Abertura: <strong className="text-white">${displayCandle.open}</strong>
            </span>
            <span>
              Máxima: <strong className="text-emerald-400">${displayCandle.high}</strong>
            </span>
            <span>
              Mínima: <strong className="text-rose-400">${displayCandle.low}</strong>
            </span>
            <span>
              Fechamento: <strong className="text-white">${displayCandle.close}</strong>
            </span>
            <span className={`font-bold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isBullish ? '+' : ''}{candleChangePct}%
            </span>
          </div>

          {/* Technical Indicators in the Fixed Bar */}
          <div className="flex items-center gap-3 flex-wrap text-slate-400 text-[11px] border-t sm:border-t-0 border-slate-800 pt-1 sm:pt-0 w-full sm:w-auto">
            {showEMA && (
              <div className="flex items-center gap-2">
                <span className="text-amber-400">EMA20: ${displayCandle.ema20}</span>
                <span className="text-orange-400">EMA50: ${displayCandle.ema50}</span>
              </div>
            )}
            {showBB && (
              <span className="text-cyan-300">
                BB: [${displayCandle.bbLower} - ${displayCandle.bbUpper}]
              </span>
            )}
            {showFreqAI && displayCandle.freqaiPredictedClose && (
              <span className="text-indigo-300 font-bold bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1">
                <Brain className="w-3 h-3 text-indigo-400" />
                Alvo FreqAI: ${displayCandle.freqaiPredictedClose}
              </span>
            )}
            {displayCandle.tradeMarker && (
              <span className="text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                🎯 {displayCandle.tradeMarker.text}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Price & Indicators Chart */}
      <div className="h-72 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={candles}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                setHoveredCandle(state.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredCandle(null)}
          >
            <defs>
              <linearGradient id="bbArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis
              domain={[minPrice, maxPrice]}
              orientation="right"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              tickFormatter={(val) => `$${val.toLocaleString()}`}
            />

            {/* If user explicitly selects floating tooltip mode, render compact tooltip */}
            {tooltipMode === 'floating' ? (
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data: CandleData = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono pointer-events-none">
                        <div className="text-slate-400 border-b border-slate-800 pb-1 mb-1 font-bold flex justify-between gap-4">
                          <span>{pair} ({timeframe})</span>
                          <span>{label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-200">
                          <span>Abertura: <span className="text-white">${data.open}</span></span>
                          <span>Máxima: <span className="text-emerald-400">${data.high}</span></span>
                          <span>Mínima: <span className="text-rose-400">${data.low}</span></span>
                          <span>Fechamento: <span className="text-white font-bold">${data.close}</span></span>
                          {showEMA && (
                            <>
                              <span className="text-amber-300">EMA 20: ${data.ema20}</span>
                              <span className="text-amber-400">EMA 50: ${data.ema50}</span>
                            </>
                          )}
                          {showBB && (
                            <>
                              <span className="text-cyan-300">BB Sup: ${data.bbUpper}</span>
                              <span className="text-cyan-300">BB Inf: ${data.bbLower}</span>
                            </>
                          )}
                          {showFreqAI && (
                            <div className="col-span-2 text-indigo-300 mt-1 pt-1 border-t border-slate-800 flex justify-between">
                              <span>🤖 Alvo FreqAI:</span>
                              <span className="font-bold">${data.freqaiPredictedClose}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            ) : tooltipMode === 'fixed' ? (
              /* In fixed mode, only render crosshair cursor line without any box obstructing the candles */
              <Tooltip
                cursor={{ stroke: '#64748b', strokeDasharray: '3 3', strokeWidth: 1 }}
                content={() => null}
              />
            ) : null}

            {/* Current Price Line */}
            <ReferenceLine
              y={currentPrice}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: `AO VIVO $${currentPrice}`, fill: '#10b981', fontSize: 10, position: 'right' }}
            />

            {/* Bollinger Bands */}
            {showBB && (
              <>
                <Area type="monotone" dataKey="bbUpper" stroke="transparent" fill="url(#bbArea)" />
                <Line type="monotone" dataKey="bbUpper" stroke="#06b6d4" strokeWidth={1} strokeDasharray="2 2" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="bbLower" stroke="#06b6d4" strokeWidth={1} strokeDasharray="2 2" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="bbMiddle" stroke="#0284c7" strokeWidth={1} dot={false} isAnimationActive={false} />
              </>
            )}

            {/* EMAs */}
            {showEMA && (
              <>
                <Line type="monotone" dataKey="ema20" stroke="#f59e0b" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="ema50" stroke="#f97316" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="ema200" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              </>
            )}

            {/* FreqAI Predicted Close Target */}
            {showFreqAI && (
              <Line
                type="monotone"
                dataKey="freqaiPredictedClose"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 2, fill: '#818cf8' }}
                isAnimationActive={false}
              />
            )}

            {/* Price Candlestick Close Line */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="#e2e8f0"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.tradeMarker?.type === 'entry') {
                  return (
                    <g key={`marker-${payload.time}`}>
                      <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                      <text x={cx} y={cy - 10} textAnchor="middle" fill="#10b981" fontSize={9} fontWeight="bold">COMPRA</text>
                    </g>
                  );
                }
                if (payload.tradeMarker?.type === 'exit') {
                  return (
                    <g key={`marker-exit-${payload.time}`}>
                      <circle cx={cx} cy={cy} r={6} fill="#38bdf8" stroke="#ffffff" strokeWidth={2} />
                      <text x={cx} y={cy - 10} textAnchor="middle" fill="#38bdf8" fontSize={9} fontWeight="bold">SAÍDA ROI</text>
                    </g>
                  );
                }
                return <circle key={`dot-${payload.time}`} cx={cx} cy={cy} r={1.5} fill="#94a3b8" />;
              }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sub Indicator Chart (RSI / MACD / FreqAI DI) */}
      <div className="h-28 w-full border-t border-slate-800/80 pt-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 mb-1">
          <span className="font-bold text-slate-300">
            {subChart === 'rsi' && 'RSI (14) Momentum • Sobrevenda: <30 | Sobrecompra: >70'}
            {subChart === 'macd' && 'MACD (12, 26, 9) Oscilador'}
            {subChart === 'freqai_di' && 'Índice de Dissimilaridade FreqAI (DI) • Limite de Anomalia: 0.45'}
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          {subChart === 'rsi' ? (
            <ComposedChart data={candles} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9 }} />
              <YAxis domain={[0, 100]} orientation="right" stroke="#64748b" tick={{ fontSize: 9 }} ticks={[30, 50, 70]} />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
              <ReferenceLine y={50} stroke="#475569" strokeDasharray="2 2" />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="rsi" stroke="#a855f7" strokeWidth={1.8} dot={false} />
            </ComposedChart>
          ) : subChart === 'macd' ? (
            <ComposedChart data={candles} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9 }} />
              <YAxis orientation="right" stroke="#64748b" tick={{ fontSize: 9 }} />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="macdHist" fill="#3b82f6" opacity={0.8} />
              <Line type="monotone" dataKey="macd" stroke="#10b981" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="macdSignal" stroke="#f43f5e" strokeWidth={1.5} dot={false} />
            </ComposedChart>
          ) : (
            <ComposedChart data={candles} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9 }} />
              <YAxis domain={[0, 0.8]} orientation="right" stroke="#64748b" tick={{ fontSize: 9 }} />
              <ReferenceLine y={0.45} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'CORTE DI (0.45)', fill: '#ef4444', fontSize: 9 }} />
              <Line type="monotone" dataKey="freqaiDI" stroke="#818cf8" strokeWidth={2} dot={false} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

