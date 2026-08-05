import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Play,
  Save,
  Copy,
  Check,
  BookOpen,
  FileCode,
  Brain,
  Wand2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { StrategyCatalogItem } from '../../types';

interface StrategyIDEProps {
  currentCode: string;
  setCurrentCode: (code: string) => void;
  strategies: StrategyCatalogItem[];
  onSelectStrategy: (strat: StrategyCatalogItem) => void;
  onSaveStrategy: () => void;
}

export const StrategyIDE: React.FC<StrategyIDEProps> = ({
  currentCode,
  setCurrentCode,
  strategies,
  onSelectStrategy,
  onSaveStrategy,
}) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState(strategies[0]?.id || 'nfi_freqai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // New Strategy Generator state
  const [showGenerator, setShowGenerator] = useState(false);
  const [genName, setGenName] = useState('MyCustomAlpha');
  const [genTimeframe, setGenTimeframe] = useState('5m');
  const [genIndicators, setGenIndicators] = useState('RSI 14, EMA 20/50, Bollinger Bands, ATR');
  const [genStyle, setGenStyle] = useState('Mean Reversion + Trend Momentum Breakout');
  const [genFreqAI, setGenFreqAI] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveStrategy();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleSelectCatalog = (stratId: string) => {
    setSelectedStrategyId(stratId);
    const found = strategies.find((s) => s.id === stratId);
    if (found) {
      onSelectStrategy(found);
    }
  };

  // Call server-side Gemini API for strategy analysis
  const handleAiAction = async (actionPrompt: string) => {
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/ai/analyze-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyCode: currentCode,
          userPrompt: actionPrompt,
          context: {
            interface_version: 3,
            timeframe: '5m',
            uses_freqai: currentCode.includes('freqai'),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResponse(data.analysis);
      } else {
        setAiResponse(`⚠️ Error: ${data.error || 'Failed to analyze strategy'}`);
      }
    } catch (err: any) {
      setAiResponse(`⚠️ Connection error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Generate new strategy with Gemini
  const handleGenerateStrategy = async () => {
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/ai/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyName: genName,
          timeframe: genTimeframe,
          indicators: genIndicators,
          tradingStyle: genStyle,
          useFreqAI: genFreqAI,
        }),
      });

      const data = await res.json();
      if (data.success && data.strategyCode) {
        // Strip markdown code block markers if present
        let cleaned = data.strategyCode;
        if (cleaned.startsWith('```python')) {
          cleaned = cleaned.replace(/^```python\n/, '').replace(/\n```$/, '');
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        setCurrentCode(cleaned);
        setShowGenerator(false);
        setAiResponse('✅ New Python strategy successfully generated and loaded into the IDE!');
      } else {
        setAiResponse(`⚠️ Generation error: ${data.error}`);
      }
    } catch (err: any) {
      setAiResponse(`⚠️ Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Catalog selector and AI Copilot trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Freqtrade Strategy IDE (Python)</h2>
            <p className="text-xs text-slate-400">Edit, inspect, and AI-optimize IStrategy classes</p>
          </div>
        </div>

        {/* Strategy Catalog Dropdown & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedStrategyId}
            onChange={(e) => handleSelectCatalog(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
          >
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.timeframe}) {s.usesFreqAI ? '🧠 FreqAI' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" /> AI Strategy Generator
          </button>

          <button
            onClick={handleCopy}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors"
            title="Copy Strategy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {saveToast ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saveToast ? 'Saved!' : 'Save Strategy'}
          </button>
        </div>
      </div>

      {/* AI Strategy Generator Modal / Drawer */}
      {showGenerator && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Generate Custom Freqtrade Strategy with Gemini AI</h3>
            </div>
            <button
              onClick={() => setShowGenerator(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Strategy Name</label>
              <input
                type="text"
                value={genName}
                onChange={(e) => setGenName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Timeframe</label>
              <select
                value={genTimeframe}
                onChange={(e) => setGenTimeframe(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-indigo-500 outline-none"
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1h">1h</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Trading Style</label>
              <input
                type="text"
                value={genStyle}
                onChange={(e) => setGenStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">FreqAI ML Module</label>
              <button
                type="button"
                onClick={() => setGenFreqAI(!genFreqAI)}
                className={`w-full p-2 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  genFreqAI
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                {genFreqAI ? 'Include FreqAI Targets' : 'Standard TA Only'}
              </button>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-slate-400 text-[11px] mb-1">Indicators & Rules Description</label>
              <input
                type="text"
                value={genIndicators}
                onChange={(e) => setGenIndicators(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-indigo-500 outline-none"
                placeholder="e.g. RSI 14 oversold < 30, EMA 20 cross above EMA 50, Bollinger band breakout"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateStrategy}
              disabled={isAiLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isAiLoading ? 'Gemini Generating Python Strategy...' : 'Generate Freqtrade Strategy'}
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Code Editor + AI Copilot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Code Editor Column (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300 ml-2 font-bold">user_data/strategies/{selectedStrategyId}.py</span>
            </div>
            <span className="text-slate-500">Python 3.11 • Freqtrade v2025</span>
          </div>

          <textarea
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            spellCheck={false}
            className="w-full h-[520px] bg-slate-950 text-emerald-300/90 font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed border-none custom-scrollbar selection:bg-emerald-900 selection:text-white"
          />
        </div>

        {/* AI Copilot & Quick Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-3 flex flex-col">
          {/* Quick AI Action Buttons */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">AI Strategy Copilot</h3>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => handleAiAction('Analyze this Freqtrade strategy for potential lookahead bias, repainting indicators, and order execution risks.')}
                disabled={isAiLoading}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Check Lookahead & Repainting
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Run</span>
              </button>

              <button
                onClick={() => handleAiAction('Suggest optimal Minimal ROI table values and Stoploss levels based on market volatility for this timeframe.')}
                disabled={isAiLoading}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-400" /> Optimize ROI & Stoploss
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Run</span>
              </button>

              <button
                onClick={() => handleAiAction('How can I add FreqAI adaptive machine learning features (feature_engineering_expand_all and targets) to this strategy? Provide code.')}
                disabled={isAiLoading}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" /> Inject FreqAI ML Features
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Run</span>
              </button>
            </div>

            {/* Custom AI Chat Input */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && aiPrompt.trim()) {
                      handleAiAction(aiPrompt);
                      setAiPrompt('');
                    }
                  }}
                  placeholder="Ask Gemini about this strategy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  onClick={() => {
                    if (aiPrompt.trim()) {
                      handleAiAction(aiPrompt);
                      setAiPrompt('');
                    }
                  }}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Ask
                </button>
              </div>
            </div>
          </div>

          {/* AI Response Output Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>Copilot Output</span>
              {isAiLoading && <span className="text-[10px] text-indigo-400 animate-pulse">Thinking with Gemini...</span>}
            </div>

            {aiResponse ? (
              <div className="text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                {aiResponse}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Select an AI diagnostic action or ask a custom strategy question above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
