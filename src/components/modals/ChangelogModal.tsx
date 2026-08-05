import React from 'react';
import {
  X,
  Sparkles,
  GitCommit,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Cpu,
  Calendar,
  Layers,
  Activity,
  Radio,
  Flame,
} from 'lucide-react';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangelogRelease {
  version: string;
  tag: string;
  date: string;
  isLatest: boolean;
  summary: string;
  sections: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: string[];
    accentColor: string;
  }[];
}

const releases: ChangelogRelease[] = [
  {
    version: 'v1.0.0',
    tag: 'Release Oficial / Estável',
    date: 'Agosto 2026',
    isLatest: true,
    summary:
      'Lançamento da versão 1.0.0 com arquitetura unificada de negociação algorítmica, motor de tape reading & orderflow de 8 métricas institucionais, consenso multi-estratégia, NLP em tempo real e painel analítico avançado.',
    sections: [
      {
        title: 'Módulo de Tape Reading & Order Flow (8 Métricas Institucionais)',
        icon: Flame,
        accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        items: [
          'Integração com o orderflow nativo do Freqtrade (branch develop, public trades, stacked imbalances).',
          '8 Métricas de Tape Reading: Volume Delta (CVD), Bid/Ask Imbalance, Absorção de Smart Money, VWAP Deviation, MFI, OFI, Volume Profile e VWRSI.',
          'Estratégia completa TapeReadingStrategy.py pronta para download e execução com 5 condições de entrada e 4 de saída.',
          'Checklist dinâmico de sinais "Perto do Perfeito" com confluência mínima de 5/8 métricas para mitigar falsos rompimentos.',
          'Simulador de Footprint e CVD em tempo real com identificação de nós POC (Point of Control), VAH e VAL.',
        ],
      },
      {
        title: 'Central de Notícias, Sentimento & Memória Base Backend',
        icon: Radio,
        accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        items: [
          'Integração contínua com APIs públicas gratuitas (CryptoCompare News e Alternative.me Fear & Greed Index).',
          'Pipeline de Processamento de Linguagem Natural (NLP) com classificação de sentimento e cálculo de impacto na decisão de trading.',
          'Persistência na memória base do servidor Express com sincronização automática a cada 20 segundos.',
          'Modal interativo para testar e simular manchetes customizadas com processamento NLP instantâneo.',
        ],
      },
      {
        title: 'Motor de Consenso e Auditoria de Estratégias (360° MTF)',
        icon: Zap,
        accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        items: [
          'Scanner de Consenso 360° cruzando múltiplos tempos gráficos (1m, 5m, 15m, 1h, 4h).',
          'Confluência de estratégias clássicas: EMACross, SMA200, RSI Oscillator, Bollinger Bands e Volume Breakout.',
          'Modal de Auditoria de Sinais de Consenso com breakdown detalhado de indicadores técnicos e pesos ponderados.',
        ],
      },
      {
        title: 'FreqAI Machine Learning & Predições',
        icon: Cpu,
        accentColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        items: [
          'Modelos de regressão adaptativa calculando retorno esperado (% Gain Target).',
          'Índice de Dissimilaridade (DI) para detectar anomalias e condições de mercado desconhecidas.',
          'Pontuação de confiança do modelo acoplada ao consenso geral.',
        ],
      },
      {
        title: 'Validação de Risco & Execução de Ordens',
        icon: ShieldCheck,
        accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        items: [
          'Regras de Risco com 3 Pilares de Sinal Sólido para validação pré-trade.',
          'Gerenciador de Stop Loss Dinâmico e Trailing Stop configurável por par.',
          'Modal para forçar ordens manuais a mercado e ordens limite integradas ao simulador de carteira.',
        ],
      },
      {
        title: 'Interface, Gráficos & Telemetria',
        icon: Layers,
        accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        items: [
          'Gráfico de velas em tempo real com alternância de tempos gráficos (1m, 5m, 15m, 1h, 4h, 1d).',
          'Feed de logs em tempo real, painel de backtesting histórico e simulador Hyperopt.',
          'Layout de alta performance com modo escuro nativo e design responsivo.',
        ],
      },
    ],
  },
  {
    version: 'v0.9.0',
    tag: 'Beta Fechado',
    date: 'Julho 2026',
    isLatest: false,
    summary:
      'Versão beta inicial contendo a fundação do simulador de negociações, integração com feeds públicos Binance e estrutura de configuração de pares whitelist.',
    sections: [
      {
        title: 'Fundação do Sistema',
        icon: Activity,
        accentColor: 'text-slate-400 bg-slate-800/40 border-slate-700',
        items: [
          'Suporte inicial aos principais pares spot (BTC, ETH, SOL, BNB, XRP, ADA, DOGE).',
          'Simulação de posições abertas com cálculo de PnL em tempo real.',
          'Módulos de configuração de estratégia e editor de parâmetros JSON.',
        ],
      },
    ],
  },
];

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="changelog-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="changelog-modal-content"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base">Notas de Atualização</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Changelog
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Histórico de versões e melhorias do Freqtrade Trading Studio
              </p>
            </div>
          </div>
          <button
            id="changelog-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {releases.map((rel) => (
            <div
              key={rel.version}
              className={`rounded-xl border p-4 sm:p-5 space-y-4 ${
                rel.isLatest
                  ? 'bg-slate-950/80 border-slate-800 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-85'
              }`}
            >
              {/* Release Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{rel.version}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      rel.isLatest
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {rel.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{rel.date}</span>
                </div>
              </div>

              {/* Release Summary */}
              <p className="text-slate-300 text-xs leading-relaxed">{rel.summary}</p>

              {/* Categorized Sections */}
              <div className="space-y-3.5 pt-1">
                {rel.sections.map((sec, idx) => {
                  const SectionIcon = sec.icon;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                        <div className={`p-1 rounded border ${sec.accentColor}`}>
                          <SectionIcon className="w-3.5 h-3.5" />
                        </div>
                        <span>{sec.title}</span>
                      </div>
                      <ul className="space-y-1.5 pl-6 list-none">
                        {sec.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="text-slate-400 text-[11px] leading-relaxed flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-slate-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Versão atual: <strong>v1.0.0</strong></span>
          </div>
          <button
            id="changelog-understood-btn"
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
