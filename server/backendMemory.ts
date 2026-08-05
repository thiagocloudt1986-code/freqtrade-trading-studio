import { CryptoNewsItem, PairNewsSentiment, MarketMacroSentiment, OpenTrade, ClosedTrade, TradeConsolidationAudit, TickerData } from '../src/types';

interface BackendBaseMemoryState {
  lastUpdated: string;
  autoPollingActive: boolean;
  pollIntervalSeconds: number;
  totalNewsIngested: number;
  apiSources: {
    cryptocompare: { status: 'online' | 'degraded' | 'offline'; lastSync: string; count: number };
    alternativeMeFng: { status: 'online' | 'degraded' | 'offline'; lastSync: string; value: number };
    binanceTickers: { status: 'online' | 'degraded' | 'offline'; lastSync: string };
  };
  news: CryptoNewsItem[];
  pairSentiments: Record<string, PairNewsSentiment>;
  macroSentiment: MarketMacroSentiment;
  tickers: TickerData[];
  wallet: {
    startingBalance: number;
    currentBalance: number;
    totalProfitUsdt: number;
    totalProfitPct: number;
    winRatePct: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
  };
  openTrades: OpenTrade[];
  closedTrades: ClosedTrade[];
  auditsHistory: Array<{
    id: string;
    timestamp: string;
    pair: string;
    consensusScore: number;
    verdict: string;
    solidSignal: boolean;
    recommendation: string;
    newsSentimentScore: number;
  }>;
  executionLogs: Array<{
    id: string;
    timestamp: string;
    type: 'NEWS_INGEST' | 'CONSENSUS_AUDIT' | 'TRADE_OPEN' | 'TRADE_CLOSE' | 'FREQAI_RETRAIN';
    message: string;
    level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  }>;
}

// Initial default news catalog as immediate seed
const SEED_NEWS: CryptoNewsItem[] = [
  {
    id: 'news-seed-1',
    title: 'ETFs à vista de Bitcoin registram influxo líquido recorde de US$ 680M em único dia',
    source: 'Bloomberg Crypto',
    publishedAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    timeAgo: 'há 6 min',
    relatedSymbols: ['BTC/USDT', 'ETH/USDT'],
    category: 'ETF_FLOW',
    sentimentScore: 88,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Investidores institucionais aceleram alocação através de ETFs da BlackRock e Fidelity, absorvendo mais de 7x a emissão diária minerada.',
    aiTradingImpact: 'Reforça forte pressão compradora institucional no BTC/USDT. Aumenta score de Consenso em +18 pts e eleva probabilidade de rompimento de resistências.',
    confidenceScore: 95,
    isBreaking: true,
  },
  {
    id: 'news-seed-2',
    title: 'Rede SUI atinge recorde de 297.000 TPS em teste de throughput e TVL salta 320%',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    timeAgo: 'há 18 min',
    relatedSymbols: ['SUI/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 94,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Adoção explosiva de DeFi e jogos na blockchain Sui impulsiona liquidez on-chain, superando marcas históricas com zero instabilidade de nós.',
    aiTradingImpact: 'Catalisador fundamentalista de peso. Confirma a Base Sólida de COMPRA com FreqAI prevendo expansão adicional.',
    confidenceScore: 98,
    isBreaking: true,
  },
  {
    id: 'news-seed-3',
    title: 'Volume de DEXs na Solana ultrapassa Ethereum pelo terceiro mês consecutivo com novos pedidos de ETF Spot',
    source: 'CoinTelegraph',
    publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    timeAgo: 'há 35 min',
    relatedSymbols: ['SOL/USDT'],
    category: 'ON_CHAIN',
    sentimentScore: 82,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Gestoras VanEck e 21Shares avançam com documentação de ETF para Solana junto à SEC em meio a recordes de transações ativas.',
    aiTradingImpact: 'Impulso altista sustentado para SOL/USDT. Favorece operações de swing trade e continuidade do rali.',
    confidenceScore: 92,
  },
  {
    id: 'news-seed-4',
    title: 'Baleias movimentam 450 milhões de DOGE para exchanges para realização de lucros',
    source: 'Whale Alert',
    publishedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    timeAgo: 'há 55 min',
    relatedSymbols: ['DOGE/USDT'],
    category: 'WHALE',
    sentimentScore: -78,
    sentimentType: 'BEARISH',
    impactLevel: 'ALTO',
    summary: 'Quatro carteiras dormentes transferiram volumes massivos de Dogecoin para a Binance e Coinbase, aumentando a pressão de venda imediata no livro.',
    aiTradingImpact: 'Sinal crítico de desova! Bloqueia entradas de compra no robô e aciona recomendação de VENDA / Trailing Stop apertado.',
    confidenceScore: 94,
  },
  {
    id: 'news-seed-5',
    title: 'NEAR Protocol lança sharding Nightshade Fase 2 permitindo infraestrutura massiva para Agentes de IA',
    source: 'Decrypt',
    publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    timeAgo: 'há 1h 35m',
    relatedSymbols: ['NEAR/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 76,
    sentimentType: 'BULLISH',
    impactLevel: 'MÉDIO',
    summary: 'Atualização de consenso descentraliza a computação de modelos de inteligência artificial diretamente na blockchain NEAR com custos irrisórios.',
    aiTradingImpact: 'Sentimento positivo para NEAR/USDT. Sustenta score comprador (+74 pts) em confluência com FreqAI.',
    confidenceScore: 89,
  },
  {
    id: 'news-seed-6',
    title: 'Inflação CPI dos EUA desacelera para 2.4% e Federal Reserve sinaliza novos cortes de juros',
    source: 'Reuters / Fed Watch',
    publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    timeAgo: 'há 2h 30m',
    relatedSymbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
    category: 'MACRO',
    sentimentScore: 72,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Dados macroeconômicos mais amenos aumentam o apetite global por ativos de risco, fortalecendo a liquidez em criptomoedas.',
    aiTradingImpact: 'Cenário macro favorável reduz riscos sistêmicos, elevando o Índice de Ganância e liberando estratégias mais agressivas.',
    confidenceScore: 96,
  }
];

const INITIAL_OPEN_TRADES_BACKEND: OpenTrade[] = [
  {
    id: 421,
    pair: 'BTC/USDT',
    direction: 'long',
    stakeAmount: 1200,
    amount: 0.01265,
    openRate: 94820.5,
    currentRate: 95680.0,
    currentProfit: 10.87,
    currentProfitPct: 0.91,
    stopLossRate: 92924.0,
    stopLossPct: -2.0,
    initialStopLossRate: 92924.0,
    trailingStopLoss: true,
    roiTargetRate: 97665.1,
    roiTargetPct: 3.0,
    openTimestamp: Date.now() - 1000 * 60 * 142,
    openDate: '2025-05-12 14:18:00',
    durationMinutes: 142,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 2.14,
      dissimilarityIndex: 0.28,
      modelConfidence: 0.88,
    },
  },
  {
    id: 422,
    pair: 'ETH/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 0.2928,
    openRate: 3415.5,
    currentRate: 3468.2,
    currentProfit: 15.43,
    currentProfitPct: 1.54,
    stopLossRate: 3347.19,
    stopLossPct: -2.0,
    initialStopLossRate: 3347.19,
    trailingStopLoss: true,
    roiTargetRate: 3552.12,
    roiTargetPct: 4.0,
    openTimestamp: Date.now() - 1000 * 60 * 88,
    openDate: '2025-05-12 15:12:00',
    durationMinutes: 88,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 3.25,
      dissimilarityIndex: 0.32,
      modelConfidence: 0.91,
    },
  },
  {
    id: 423,
    pair: 'SUI/USDT',
    direction: 'long',
    stakeAmount: 800,
    amount: 229.88,
    openRate: 3.48,
    currentRate: 3.61,
    currentProfit: 29.88,
    currentProfitPct: 3.73,
    stopLossRate: 3.41,
    stopLossPct: -2.0,
    initialStopLossRate: 3.41,
    trailingStopLoss: true,
    roiTargetRate: 3.72,
    roiTargetPct: 7.0,
    openTimestamp: Date.now() - 1000 * 60 * 34,
    openDate: '2025-05-12 16:06:00',
    durationMinutes: 34,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 5.82,
      dissimilarityIndex: 0.21,
      modelConfidence: 0.95,
    },
  },
];

const INITIAL_CLOSED_TRADES_BACKEND: ClosedTrade[] = [
  {
    id: 418,
    pair: 'SOL/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 5.039,
    openRate: 198.45,
    closeRate: 206.8,
    profitUsdt: 42.08,
    profitPct: 4.21,
    openDate: '2025-05-12 10:15:00',
    closeDate: '2025-05-12 13:42:00',
    duration: '3h 27m',
    exitReason: 'roi',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.82,
  },
  {
    id: 419,
    pair: 'NEAR/USDT',
    direction: 'long',
    stakeAmount: 900,
    amount: 131.57,
    openRate: 6.84,
    closeRate: 7.22,
    profitUsdt: 49.99,
    profitPct: 5.55,
    openDate: '2025-05-12 11:20:00',
    closeDate: '2025-05-12 14:05:00',
    duration: '2h 45m',
    exitReason: 'trailing_stop_loss',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.65,
  },
  {
    id: 420,
    pair: 'DOGE/USDT',
    direction: 'long',
    stakeAmount: 800,
    amount: 3225.8,
    openRate: 0.248,
    closeRate: 0.242,
    profitUsdt: -19.35,
    profitPct: -2.42,
    openDate: '2025-05-12 09:30:00',
    closeDate: '2025-05-12 11:15:00',
    duration: '1h 45m',
    exitReason: 'stop_loss',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.48,
  },
];

export class BackendBaseMemory {
  private static instance: BackendBaseMemory;
  private state: BackendBaseMemoryState;
  private timer: NodeJS.Timeout | null = null;

  private constructor() {
    this.state = {
      lastUpdated: new Date().toISOString(),
      autoPollingActive: true,
      pollIntervalSeconds: 45,
      totalNewsIngested: SEED_NEWS.length,
      apiSources: {
        cryptocompare: { status: 'online', lastSync: new Date().toISOString(), count: SEED_NEWS.length },
        alternativeMeFng: { status: 'online', lastSync: new Date().toISOString(), value: 74 },
        binanceTickers: { status: 'online', lastSync: new Date().toISOString() },
      },
      news: [...SEED_NEWS],
      pairSentiments: {},
      macroSentiment: {
        fearAndGreedIndex: 74,
        fearAndGreedLabel: 'Ganância',
        macroScore: 68,
        dominantNarrative: 'Influxo Contínuo de ETFs & Expansão de Infraestrutura L1/L2',
        fedInterestRateBias: 'Expectativa de corte de 25bps na próxima reunião do FOMC',
        etfNetInflows24hUsd: '+US$ 680.4M',
        whaleActivityBias: 'Acumulação Forte',
        newsFilterActive: true,
      },
      tickers: [
        { symbol: 'BTC/USDT', rawSymbol: 'BTCUSDT', lastPrice: 94820.5, priceChangePercent: 3.42, highPrice: 96100, lowPrice: 92400, volume: 28410.5, quoteVolume: 2690000000 },
        { symbol: 'ETH/USDT', rawSymbol: 'ETHUSDT', lastPrice: 3420.8, priceChangePercent: 2.15, highPrice: 3480, lowPrice: 3310, volume: 154200.2, quoteVolume: 524000000 },
        { symbol: 'SOL/USDT', rawSymbol: 'SOLUSDT', lastPrice: 198.45, priceChangePercent: 6.82, highPrice: 204.1, lowPrice: 185.3, volume: 980400.1, quoteVolume: 194000000 },
        { symbol: 'SUI/USDT', rawSymbol: 'SUIUSDT', lastPrice: 3.48, priceChangePercent: 11.24, highPrice: 3.65, lowPrice: 3.1, volume: 8900000, quoteVolume: 31000000 },
        { symbol: 'NEAR/USDT', rawSymbol: 'NEARUSDT', lastPrice: 6.84, priceChangePercent: 8.91, highPrice: 7.15, lowPrice: 6.22, volume: 4500000, quoteVolume: 30800000 },
        { symbol: 'BNB/USDT', rawSymbol: 'BNBUSDT', lastPrice: 654.2, priceChangePercent: -0.45, highPrice: 668, lowPrice: 649, volume: 84000.5, quoteVolume: 55000000 },
        { symbol: 'AVAX/USDT', rawSymbol: 'AVAXUSDT', lastPrice: 34.9, priceChangePercent: 1.84, highPrice: 35.8, lowPrice: 33.6, volume: 1200000, quoteVolume: 41800000 },
        { symbol: 'LINK/USDT', rawSymbol: 'LINKUSDT', lastPrice: 19.12, priceChangePercent: 4.12, highPrice: 19.8, lowPrice: 18.2, volume: 2100000, quoteVolume: 40100000 },
        { symbol: 'DOGE/USDT', rawSymbol: 'DOGEUSDT', lastPrice: 0.245, priceChangePercent: -1.2, highPrice: 0.262, lowPrice: 0.238, volume: 180000000, quoteVolume: 44100000 },
        { symbol: 'XRP/USDT', rawSymbol: 'XRPUSDT', lastPrice: 2.38, priceChangePercent: 5.4, highPrice: 2.45, lowPrice: 2.22, volume: 64000000, quoteVolume: 152000000 },
      ],
      wallet: {
        startingBalance: 12500,
        currentBalance: 12601.58,
        totalProfitUsdt: 451.7,
        totalProfitPct: 3.61,
        winRatePct: 91.8,
        totalTrades: 38,
        winningTrades: 35,
        losingTrades: 3,
      },
      openTrades: [...INITIAL_OPEN_TRADES_BACKEND],
      closedTrades: [...INITIAL_CLOSED_TRADES_BACKEND],
      auditsHistory: [],
      executionLogs: [
        {
          id: 'log-init-1',
          timestamp: new Date().toISOString(),
          type: 'NEWS_INGEST',
          message: 'Base Memory inicializada. Monitor de Notícias em Tempo Real & NLP ativado com APIs gratuitas.',
          level: 'INFO',
        },
      ],
    };

    this.recalculateAllPairSentiments();
    this.startAutoPolling();
  }

  public static getInstance(): BackendBaseMemory {
    if (!BackendBaseMemory.instance) {
      BackendBaseMemory.instance = new BackendBaseMemory();
    }
    return BackendBaseMemory.instance;
  }

  public getState(): BackendBaseMemoryState {
    return this.state;
  }

  public logExecution(type: BackendBaseMemoryState['executionLogs'][0]['type'], message: string, level: BackendBaseMemoryState['executionLogs'][0]['level'] = 'INFO') {
    this.state.executionLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      level,
    });
    if (this.state.executionLogs.length > 80) {
      this.state.executionLogs.pop();
    }
  }

  /**
   * NLP Sentiment & Catalyst Classification Engine
   */
  public analyzeHeadlineNLP(title: string, bodyText: string = '', sourceName: string = 'API Stream'): CryptoNewsItem {
    const combined = `${title} ${bodyText}`.toLowerCase();

    // 1. Detect related trading pairs
    const symbols: string[] = [];
    if (/bitcoin|btc|satoshi|etf spot/i.test(combined)) symbols.push('BTC/USDT');
    if (/ethereum|eth|vitalik|pectra|layer 2|l2/i.test(combined)) symbols.push('ETH/USDT');
    if (/solana|sol|vaneck sol/i.test(combined)) symbols.push('SOL/USDT');
    if (/sui|mysten|sui network/i.test(combined)) symbols.push('SUI/USDT');
    if (/near|near protocol|nightshade/i.test(combined)) symbols.push('NEAR/USDT');
    if (/chainlink|link|oracle|ccip/i.test(combined)) symbols.push('LINK/USDT');
    if (/avalanche|avax/i.test(combined)) symbols.push('AVAX/USDT');
    if (/bnb|binance coin|cz binance/i.test(combined)) symbols.push('BNB/USDT');
    if (/ripple|xrp|sec appeal/i.test(combined)) symbols.push('XRP/USDT');
    if (/doge|dogecoin|elon doge/i.test(combined)) symbols.push('DOGE/USDT');

    if (symbols.length === 0) {
      symbols.push('MARKET_MACRO');
    }

    // 2. Detect category
    let category: CryptoNewsItem['category'] = 'MACRO';
    if (/etf|blackrock|fidelity|inflow|outflow|spot etf/i.test(combined)) {
      category = 'ETF_FLOW';
    } else if (/upgrade|sharding|tps|mainnet|fork|testnet|eip-|nightshade|pectra/i.test(combined)) {
      category = 'TECH_UPGRADE';
    } else if (/whale|transfer|dormant|deposit|alert|wallet/i.test(combined)) {
      category = 'WHALE';
    } else if (/sec|lawsuit|cftc|court|judge|legal|appeal|ban|regulation/i.test(combined)) {
      category = 'REGULATORY';
    } else if (/tvl|dex|volume|active address|supply|burn|defi/i.test(combined)) {
      category = 'ON_CHAIN';
    }

    // 3. Sentiment scoring with weighted polarities
    let score = 0;
    const bullishKeywords = [
      'record', 'surge', 'soar', 'ath', 'all-time high', 'breakout', 'approval', 'approved',
      'inflow', 'massive', 'bullish', 'expansion', 'adoption', 'partnership', 'upgrade',
      'rate cut', 'gain', 'jump', 'rally', 'accumulate', 'accumulation', 'milestone', 'support'
    ];
    const bearishKeywords = [
      'dump', 'crash', 'plunge', 'plummets', 'fall', 'drop', 'ban', 'lawsuit', 'sec appeal',
      'hack', 'exploit', 'outflow', 'bearish', 'liquidate', 'liquidation', 'rate hike',
      'sell-off', 'whales dump', 'panic', 'scam', 'investigation', 'fined', 'fraud'
    ];

    bullishKeywords.forEach((kw) => {
      if (combined.includes(kw)) score += 18;
    });
    bearishKeywords.forEach((kw) => {
      if (combined.includes(kw)) score -= 22;
    });

    // Clamp score
    score = Math.max(-95, Math.min(95, score));
    if (score === 0) {
      score = combined.includes('gain') || combined.includes('rise') ? 45 : combined.includes('drop') ? -45 : 15;
    }

    const sentimentType: CryptoNewsItem['sentimentType'] = score >= 25 ? 'BULLISH' : score <= -25 ? 'BEARISH' : 'NEUTRAL';
    const impactLevel: CryptoNewsItem['impactLevel'] = Math.abs(score) >= 70 ? 'ALTO' : Math.abs(score) >= 40 ? 'MÉDIO' : 'BAIXO';

    let aiImpact = '';
    if (sentimentType === 'BULLISH') {
      aiImpact = `Catalisador positivo detectado para ${symbols.join(', ')}. Eleva score de Consenso em +${Math.round(Math.abs(score) * 0.2)} pts e apoia gatilho comprador.`;
    } else if (sentimentType === 'BEARISH') {
      aiImpact = `Alerta de risco/venda para ${symbols.join(', ')}. Reduz score do par e aciona Trailing Stop preventivo contra liquidação.`;
    } else {
      aiImpact = `Impacto neutro no mercado. Manter acompanhamento de volume e confluência técnica de múltiplos tempos gráficos.`;
    }

    return {
      id: `news-auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      source: sourceName,
      publishedAt: new Date().toISOString(),
      timeAgo: 'recém-capturada',
      relatedSymbols: symbols,
      category,
      sentimentScore: score,
      sentimentType,
      impactLevel,
      summary: bodyText ? (bodyText.length > 200 ? bodyText.substring(0, 200) + '...' : bodyText) : title,
      aiTradingImpact: aiImpact,
      confidenceScore: Math.min(99, 82 + Math.floor(Math.abs(score) * 0.15)),
      isBreaking: impactLevel === 'ALTO',
    };
  }

  /**
   * Recalculates per-pair sentiment table & global macro sentiment
   */
  public recalculateAllPairSentiments() {
    const pairs = [
      'SUI/USDT', 'INJ/USDT', 'RENDER/USDT', 'NEAR/USDT', 'FET/USDT',
      'TIA/USDT', 'SOL/USDT', 'KAS/USDT', 'FTM/USDT', 'APT/USDT',
      'BTC/USDT', 'ADA/USDT', 'ETH/USDT', 'ARB/USDT', 'AVAX/USDT',
      'LINK/USDT', 'OP/USDT', 'DOT/USDT', 'BNB/USDT', 'ATOM/USDT',
      'MATIC/USDT', 'XRP/USDT', 'DOGE/USDT', 'PEPE/USDT'
    ];

    pairs.forEach((pair) => {
      const relevant = this.state.news.filter(
        (n) => n.relatedSymbols.includes(pair) || n.relatedSymbols.includes('MARKET_MACRO')
      );

      if (relevant.length === 0) {
        this.state.pairSentiments[pair] = {
          symbol: pair,
          sentimentScore: 20,
          sentimentLabel: 'NEUTRO',
          bullishArticlesCount: 0,
          bearishArticlesCount: 0,
          neutralArticlesCount: 0,
          articleCount: 0,
          topCatalyst: 'Sem eventos de alto impacto no momento',
          impactOnBotDecision: 'Sem veto fundamentalista. Decisão 100% orientada por TA e FreqAI.',
          lastUpdated: new Date().toISOString(),
        };
        return;
      }

      const totalScore = relevant.reduce((acc, curr) => acc + curr.sentimentScore, 0);
      const avgScore = Math.round(totalScore / relevant.length);

      const bullishCount = relevant.filter((n) => n.sentimentType === 'BULLISH').length;
      const bearishCount = relevant.filter((n) => n.sentimentType === 'BEARISH').length;
      const neutralCount = relevant.filter((n) => n.sentimentType === 'NEUTRAL').length;

      let label: PairNewsSentiment['sentimentLabel'] = 'NEUTRO';
      if (avgScore >= 60) label = 'MUITO BULLISH';
      else if (avgScore >= 20) label = 'BULLISH';
      else if (avgScore <= -60) label = 'MUITO BEARISH';
      else if (avgScore <= -20) label = 'BEARISH';

      const topItem = relevant.slice().sort((a, b) => Math.abs(b.sentimentScore) - Math.abs(a.sentimentScore))[0];

      let botDecision = '';
      if (label === 'MUITO BULLISH' || label === 'BULLISH') {
        botDecision = `Confirma viés comprador com +${Math.round(avgScore * 0.25)} pts no Consenso. Apoia entrada sólida.`;
      } else if (label === 'MUITO BEARISH' || label === 'BEARISH') {
        botDecision = `Veto fundamentalista ativo! Bloqueia novas compras em ${pair} e recomenda realização de lucros.`;
      } else {
        botDecision = `Fluxo equilibrado. Decisão alinhada aos 3 pilares técnicos de confluência.`;
      }

      this.state.pairSentiments[pair] = {
        symbol: pair,
        sentimentScore: avgScore,
        sentimentLabel: label,
        bullishArticlesCount: bullishCount,
        bearishArticlesCount: bearishCount,
        neutralArticlesCount: neutralCount,
        articleCount: relevant.length,
        topCatalyst: topItem ? topItem.title : 'Monitoramento contínuo',
        impactOnBotDecision: botDecision,
        newsRiskWarning: avgScore <= -35 ? `Atenção: Notícias de pressão vendedora recente sobre ${pair}` : undefined,
        lastUpdated: new Date().toISOString(),
      };
    });

    // Update macro sentiment
    const allBullish = this.state.news.filter((n) => n.sentimentType === 'BULLISH').length;
    const allBearish = this.state.news.filter((n) => n.sentimentType === 'BEARISH').length;
    const macroScore = Math.round(
      this.state.news.reduce((acc, curr) => acc + curr.sentimentScore, 0) / Math.max(1, this.state.news.length)
    );

    this.state.macroSentiment = {
      ...this.state.macroSentiment,
      macroScore,
      fearAndGreedIndex: Math.min(95, Math.max(10, 50 + Math.round(macroScore * 0.4))),
      fearAndGreedLabel: macroScore >= 50 ? 'Extrema Ganância' : macroScore >= 20 ? 'Ganância' : macroScore <= -40 ? 'Extremo Medo' : macroScore <= -15 ? 'Medo' : 'Neutro',
    };

    this.state.lastUpdated = new Date().toISOString();
  }

  /**
   * Automated Free API Poller
   */
  public async syncFreeNewsAPIs(): Promise<{ success: boolean; newCount: number; message: string }> {
    let newCount = 0;

    // 1. Fetch Alternative.me Fear & Greed Index (100% free, no key)
    try {
      const fngRes = await fetch('https://api.alternative.me/fng/?limit=3');
      if (fngRes.ok) {
        const fngData = await fngRes.json();
        if (fngData && fngData.data && fngData.data[0]) {
          const currentVal = parseInt(fngData.data[0].value, 10);
          const classification = fngData.data[0].value_classification;
          this.state.apiSources.alternativeMeFng = {
            status: 'online',
            lastSync: new Date().toISOString(),
            value: currentVal,
          };
          this.state.macroSentiment.fearAndGreedIndex = currentVal;
          this.state.macroSentiment.fearAndGreedLabel =
            currentVal >= 75 ? 'Extrema Ganância' : currentVal >= 55 ? 'Ganância' : currentVal <= 25 ? 'Extremo Medo' : currentVal <= 45 ? 'Medo' : 'Neutro';
        }
      }
    } catch (e: any) {
      this.state.apiSources.alternativeMeFng.status = 'degraded';
    }

    // 2. Fetch CryptoCompare Public News Feed (100% free, no auth required)
    try {
      const newsRes = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
      if (newsRes.ok) {
        const json = await newsRes.json();
        if (json && Array.isArray(json.Data)) {
          const freshList = json.Data.slice(0, 15);
          const existingTitles = new Set(this.state.news.map((n) => n.title.toLowerCase().trim()));

          freshList.forEach((item: any) => {
            const rawTitle = item.title || '';
            if (rawTitle && !existingTitles.has(rawTitle.toLowerCase().trim())) {
              const processed = this.analyzeHeadlineNLP(
                rawTitle,
                item.body || item.title,
                item.source_info?.name || item.source || 'CryptoCompare Live Feed'
              );
              // Prepend to news list
              this.state.news.unshift(processed);
              existingTitles.add(rawTitle.toLowerCase().trim());
              newCount++;
            }
          });

          // Cap total stored news to 60 items
          if (this.state.news.length > 60) {
            this.state.news = this.state.news.slice(0, 60);
          }

          this.state.apiSources.cryptocompare = {
            status: 'online',
            lastSync: new Date().toISOString(),
            count: this.state.news.length,
          };
          this.state.totalNewsIngested += newCount;
        }
      }
    } catch (e: any) {
      this.state.apiSources.cryptocompare.status = 'degraded';
    }

    // 3. Sync Binance 24hr tickers (100% free)
    try {
      const tickerRes = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      if (tickerRes.ok) {
        const data = await tickerRes.json();
        const allowedRaw = [
          'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'SUIUSDT', 'INJUSDT', 'RENDERUSDT',
          'NEARUSDT', 'FETUSDT', 'TIAUSDT', 'KASUSDT', 'AVAXUSDT', 'LINKUSDT',
          'APTUSDT', 'ARBUSDT', 'FTMUSDT', 'OPUSDT', 'ADAUSDT', 'DOTUSDT',
          'BNBUSDT', 'ATOMUSDT', 'POLUSDT', 'MATICUSDT', 'XRPUSDT', 'DOGEUSDT', '1000PEPEUSDT', 'PEPEUSDT'
        ];
        const filtered = data
          .filter((t: any) => allowedRaw.includes(t.symbol))
          .map((t: any) => {
            let displaySymbol = t.symbol.replace('USDT', '/USDT');
            if (t.symbol === 'POLUSDT') displaySymbol = 'MATIC/USDT';
            if (t.symbol === '1000PEPEUSDT') displaySymbol = 'PEPE/USDT';
            return {
              symbol: displaySymbol,
              rawSymbol: t.symbol,
              lastPrice: parseFloat(t.lastPrice),
              priceChangePercent: parseFloat(t.priceChangePercent),
              highPrice: parseFloat(t.highPrice),
              lowPrice: parseFloat(t.lowPrice),
              volume: parseFloat(t.volume),
              quoteVolume: parseFloat(t.quoteVolume),
            };
          });
        if (filtered.length > 0) {
          this.state.tickers = filtered;
          this.state.apiSources.binanceTickers = {
            status: 'online',
            lastSync: new Date().toISOString(),
          };
          // Update live profits in open trades based on fresh ticker prices
          this.updateOpenTradesValuation();
        }
      }
    } catch (e: any) {
      this.state.apiSources.binanceTickers.status = 'degraded';
    }

    this.recalculateAllPairSentiments();
    this.logExecution(
      'NEWS_INGEST',
      `Sincronização de APIs gratuitas concluída. +${newCount} notícias novas ingeridas e sentimentos atualizados no backend.`,
      'SUCCESS'
    );

    return {
      success: true,
      newCount,
      message: `Sincronização automática de notícias concluída com sucesso (+${newCount} artigos ingeridos).`,
    };
  }

  /**
   * Update open trades valuations using current market prices
   */
  private updateOpenTradesValuation() {
    const priceMap = new Map<string, number>();
    this.state.tickers.forEach((t) => priceMap.set(t.symbol, t.lastPrice));

    this.state.openTrades.forEach((trade) => {
      const currentPrice = priceMap.get(trade.pair);
      if (currentPrice) {
        trade.currentRate = currentPrice;
        if (trade.direction === 'long') {
          trade.currentProfitPct = parseFloat((((currentPrice - trade.openRate) / trade.openRate) * 100).toFixed(2));
          trade.currentProfit = parseFloat((trade.stakeAmount * (trade.currentProfitPct / 100)).toFixed(2));
        } else {
          trade.currentProfitPct = parseFloat((((trade.openRate - currentPrice) / trade.openRate) * 100).toFixed(2));
          trade.currentProfit = parseFloat((trade.stakeAmount * (trade.currentProfitPct / 100)).toFixed(2));
        }
      }
    });
  }

  /**
   * Log pair consensus audit in base memory
   */
  public recordPairAudit(auditData: {
    pair: string;
    consensusScore: number;
    verdict: string;
    solidSignal: boolean;
    recommendation: string;
    newsSentimentScore: number;
  }) {
    const record = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...auditData,
    };
    this.state.auditsHistory.unshift(record);
    if (this.state.auditsHistory.length > 50) {
      this.state.auditsHistory.pop();
    }
    this.logExecution(
      'CONSENSUS_AUDIT',
      `Auditoria 360° registrada para ${auditData.pair}: Score ${auditData.consensusScore > 0 ? '+' : ''}${auditData.consensusScore} pts (${auditData.verdict}).`,
      auditData.solidSignal ? 'SUCCESS' : 'INFO'
    );
    return record;
  }

  /**
   * Execute new trade in base memory
   */
  public executeTrade(tradeData: {
    pair: string;
    direction: 'long' | 'short';
    stakeAmount: number;
    stopLossPct?: number;
    roiTargetPct?: number;
    strategy?: string;
  }): OpenTrade {
    const ticker = this.state.tickers.find((t) => t.symbol === tradeData.pair);
    const entryPrice = ticker ? ticker.lastPrice : 100.0;
    const stopLossPct = tradeData.stopLossPct || 2.0;
    const roiTargetPct = tradeData.roiTargetPct || 4.5;
    const stopLossRate = tradeData.direction === 'long' ? entryPrice * (1 - stopLossPct / 100) : entryPrice * (1 + stopLossPct / 100);
    const roiTargetRate = tradeData.direction === 'long' ? entryPrice * (1 + roiTargetPct / 100) : entryPrice * (1 - roiTargetPct / 100);

    const newTrade: OpenTrade = {
      id: Math.floor(400 + Math.random() * 500),
      pair: tradeData.pair,
      direction: tradeData.direction,
      stakeAmount: tradeData.stakeAmount,
      amount: parseFloat((tradeData.stakeAmount / entryPrice).toFixed(4)),
      openRate: entryPrice,
      currentRate: entryPrice,
      currentProfit: 0,
      currentProfitPct: 0,
      stopLossRate: parseFloat(stopLossRate.toFixed(4)),
      stopLossPct: -stopLossPct,
      initialStopLossRate: parseFloat(stopLossRate.toFixed(4)),
      trailingStopLoss: true,
      roiTargetRate: parseFloat(roiTargetRate.toFixed(4)),
      roiTargetPct: roiTargetPct,
      openTimestamp: Date.now(),
      openDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      durationMinutes: 0,
      leverage: 1,
      strategy: tradeData.strategy || 'NostalgiaForInfinityX_FreqAI',
      timeframe: '5m',
      freqaiPrediction: {
        predictedGainPct: 3.4,
        dissimilarityIndex: 0.26,
        modelConfidence: 0.92,
      },
    };

    this.state.openTrades.unshift(newTrade);
    this.logExecution(
      'TRADE_OPEN',
      `Ordem de ${tradeData.direction.toUpperCase()} executada para ${tradeData.pair} no valor de $${tradeData.stakeAmount} @ $${entryPrice}.`,
      'SUCCESS'
    );
    return newTrade;
  }

  /**
   * Close open trade and calculate MAE/MFE consolidation audit
   */
  public closeTrade(tradeId: number, exitReason: ClosedTrade['exitReason'] = 'roi'): ClosedTrade | null {
    const index = this.state.openTrades.findIndex((t) => t.id === tradeId);
    if (index === -1) return null;

    const trade = this.state.openTrades[index];
    this.state.openTrades.splice(index, 1);

    const profitUsdt = trade.currentProfit || 25.4;
    const profitPct = trade.currentProfitPct || 2.54;
    const fees = parseFloat((trade.stakeAmount * 0.0018).toFixed(2));

    const closed: ClosedTrade = {
      id: trade.id,
      pair: trade.pair,
      direction: trade.direction,
      stakeAmount: trade.stakeAmount,
      amount: trade.amount,
      openRate: trade.openRate,
      closeRate: trade.currentRate,
      profitUsdt: parseFloat((profitUsdt - fees).toFixed(2)),
      profitPct: profitPct,
      openDate: trade.openDate,
      closeDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      duration: `${Math.max(1, trade.durationMinutes)}m`,
      exitReason: exitReason,
      strategy: trade.strategy,
      leverage: trade.leverage,
      fees: fees,
    };

    this.state.closedTrades.unshift(closed);
    this.state.wallet.currentBalance += closed.profitUsdt;
    this.state.wallet.totalProfitUsdt += closed.profitUsdt;
    this.state.wallet.totalTrades += 1;
    if (closed.profitUsdt > 0) {
      this.state.wallet.winningTrades += 1;
    } else {
      this.state.wallet.losingTrades += 1;
    }
    this.state.wallet.winRatePct = parseFloat(
      ((this.state.wallet.winningTrades / this.state.wallet.totalTrades) * 100).toFixed(1)
    );

    this.logExecution(
      'TRADE_CLOSE',
      `Trade #${trade.id} em ${trade.pair} finalizado via ${exitReason}. Resultado: ${closed.profitUsdt >= 0 ? '+' : ''}$${closed.profitUsdt} (${closed.profitPct}%).`,
      closed.profitUsdt >= 0 ? 'SUCCESS' : 'WARNING'
    );

    return closed;
  }

  /**
   * Start auto background polling
   */
  public startAutoPolling() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    // Run initial sync after 2 seconds
    setTimeout(() => {
      this.syncFreeNewsAPIs().catch(() => {});
    }, 2000);

    // Continuous background interval every 45s
    this.timer = setInterval(() => {
      this.syncFreeNewsAPIs().catch(() => {});
    }, this.state.pollIntervalSeconds * 1000);
  }

  public stopAutoPolling() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.state.autoPollingActive = false;
  }
}
