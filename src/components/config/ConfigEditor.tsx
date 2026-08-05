import React, { useState } from 'react';
import {
  Settings,
  FileCode,
  Copy,
  Check,
  CheckCircle2,
  Download,
  Layers,
  Container,
  Cpu,
  BookOpen,
  Sparkles,
  Save,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { FreqtradeConfig } from '../../types';

interface ConfigEditorProps {
  config: FreqtradeConfig;
  onSaveConfig: (newConfig: FreqtradeConfig) => void;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ config, onSaveConfig }) => {
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'docker' | 'comparison'>('config');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [configJson, setConfigJson] = useState(JSON.stringify(config, null, 2));

  const dockerComposeYaml = `version: '3'
services:
  freqtrade:
    image: freqtradeorg/freqtrade:stable_freqai
    restart: unless-stopped
    container_name: freqtrade_bot
    volumes:
      - "./user_data:/freqtrade/user_data"
    ports:
      - "8080:8080"
    command: >
      trade
      --logfile /freqtrade/user_data/logs/freqtrade.log
      --db-url sqlite:////freqtrade/user_data/tradesv3.sqlite
      --config /freqtrade/user_data/config.json
      --strategy NostalgiaForInfinityX_FreqAI
`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(configJson);
      setJsonError(null);
      onSaveConfig(parsed);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setJsonError(`Erro de sintaxe JSON: ${err.message}`);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(configJson);
      setConfigJson(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(`Não é possível formatar JSON inválido: ${err.message}`);
    }
  };

  const handleReset = () => {
    setConfigJson(JSON.stringify(config, null, 2));
    setJsonError(null);
  };

  return (
    <div className="space-y-4">
      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Freqtrade Configuration & Deployment</h2>
            <p className="text-xs text-slate-400">Manage user_data/config.json, Docker containers, and framework architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('config')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'config'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            config.json Editor
          </button>
          <button
            onClick={() => setActiveSubTab('docker')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'docker'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Docker Compose
          </button>
          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'comparison'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Freqtrade vs Nautilus
          </button>
        </div>
      </div>

      {/* Config.json Tab */}
      {activeSubTab === 'config' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <h3 className="font-bold text-white text-sm">user_data/config.json (Production Parameters)</h3>
              <p className="text-[11px] text-slate-400">Primary configuration loaded by Freqtrade bot daemon at startup</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleFormat}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors"
                title="Formatar JSON"
              >
                Formatar
              </button>
              <button
                onClick={handleReset}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors"
                title="Restaurar padrão"
              >
                <RotateCcw className="w-3 h-3" /> Restaurar
              </button>
              <button
                onClick={() => handleCopy(configJson)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar JSON'}
              </button>
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-colors"
              >
                {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {savedSuccess ? 'Config Salva!' : 'Salvar Alterações'}
              </button>
            </div>
          </div>

          {jsonError && (
            <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{jsonError}</span>
            </div>
          )}

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <textarea
              value={configJson}
              onChange={(e) => {
                setConfigJson(e.target.value);
                if (jsonError) setJsonError(null);
              }}
              spellCheck={false}
              className="w-full h-96 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed custom-scrollbar"
            />
          </div>
        </div>
      )}

      {/* Docker Compose Tab */}
      {activeSubTab === 'docker' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Container className="w-4 h-4 text-blue-400" /> Production Docker Compose Deployment
              </h3>
              <p className="text-[11px] text-slate-400">Pre-built container with PyTorch, LightGBM, TA-Lib, and FreqUI</p>
            </div>
            <button
              onClick={() => handleCopy(dockerComposeYaml)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied YAML' : 'Copy YAML'}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto">
            <pre>{dockerComposeYaml}</pre>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
            <div className="font-bold text-slate-200">How to run on a VPS (Ubuntu / Debian):</div>
            <code className="text-emerald-400 block bg-slate-900 p-2 rounded mt-1">
              docker compose up -d
            </code>
            <p className="text-[11px] text-slate-400 pt-1">
              Freqtrade Web UI will be instantly accessible at <span className="text-white font-mono">http://your-server-ip:8080</span> with Telegram notifications enabled.
            </p>
          </div>
        </div>
      )}

      {/* Comparison Guide Tab (Freqtrade vs NautilusTrader) */}
      {activeSubTab === 'comparison' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm">Framework Architecture Comparison</h3>
            <p className="text-[11px] text-slate-400">Understanding when to choose Freqtrade vs NautilusTrader</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="pb-2 w-1/4">Feature / Dimension</th>
                  <th className="pb-2 w-3/8 text-emerald-400 font-bold">Freqtrade (This App)</th>
                  <th className="pb-2 w-3/8 text-slate-300">NautilusTrader</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">GitHub Stars & Community</td>
                  <td className="py-2.5 text-emerald-300 font-bold">~39,000 ⭐ (Huge community, plugins, strategies)</td>
                  <td className="py-2.5 text-slate-400">~6,000 ⭐</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">Target Ecosystem</td>
                  <td className="py-2.5 text-emerald-300 font-bold">Crypto Spot & Futures (30+ Exchanges via CCXT)</td>
                  <td className="py-2.5 text-slate-400">Crypto, Forex, Equities, Multi-Asset</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">Machine Learning</td>
                  <td className="py-2.5 text-emerald-300 font-bold">FreqAI Built-in (Continuous online retraining, Dissimilarity Index)</td>
                  <td className="py-2.5 text-slate-400">Manual integration via custom Rust/Python modules</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">UI & Remote Control</td>
                  <td className="py-2.5 text-emerald-300 font-bold">Official WebUI (FreqUI) + Complete Telegram Remote Bot</td>
                  <td className="py-2.5 text-slate-400">CLI / Jupyter Notebook / Terminal only</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">Strategy Development Speed</td>
                  <td className="py-2.5 text-emerald-300 font-bold">Extremely Fast (Pandas / TA-Lib vectorization, 1 file)</td>
                  <td className="py-2.5 text-slate-400">Event-driven Cython/Rust architecture (Higher learning curve)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">Hyperparameter Tuning</td>
                  <td className="py-2.5 text-emerald-300 font-bold">Integrated HyperOpt (Bayesian Optimization via scikit-optimize)</td>
                  <td className="py-2.5 text-slate-400">External optimization workflows</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">Best Suited For</td>
                  <td className="py-2.5 text-emerald-300 font-bold">Algorithmic crypto traders, ML strategy builders, 24/7 VPS bots</td>
                  <td className="py-2.5 text-slate-400">Institutional HFT, sub-millisecond execution, multi-venue arbitrage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
