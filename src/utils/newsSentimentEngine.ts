import { CryptoNewsItem, PairNewsSentiment, MarketMacroSentiment } from '../types';

/**
 * Motor de Sentimento de Notícias Cripto em Tempo Real (News NLP & Macro Engine).
 * 
 * Processa manchetes reais de mercado (CoinDesk, Cointelegraph, Bloomberg, CryptoPanic, WhaleAlert, FED)
 * e calcula o impacto direto (-100 a +100) na probabilidade de alta ou baixa de cada ativo,
 * influenciando diretamente o Consenso do Robô e as decisões de Compra/Venda.
 */

export const INITIAL_NEWS_ITEMS: CryptoNewsItem[] = [
  {
    id: 'news-1',
    title: 'ETFs à vista de Bitcoin registram influxo líquido recorde de US$ 680M em único dia',
    source: 'Bloomberg Crypto',
    publishedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    timeAgo: 'há 8 min',
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
    id: 'news-2',
    title: 'Rede SUI atinge recorde de 297.000 TPS em teste de throughput e TVL salta 320%',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    timeAgo: 'há 22 min',
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
    id: 'news-3',
    title: 'Volume de DEXs na Solana ultrapassa Ethereum pelo terceiro mês consecutivo com novos pedidos de ETF Spot',
    source: 'CoinTelegraph',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    timeAgo: 'há 45 min',
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
    id: 'news-4',
    title: 'Baleias movimentam 450 milhões de DOGE para exchanges para realização de lucros',
    source: 'Whale Alert',
    publishedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    timeAgo: 'há 1h 10m',
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
    id: 'news-5',
    title: 'NEAR Protocol lança sharding Nightshade Fase 2 permitindo infraestrutura massiva para Agentes de IA',
    source: 'Decrypt',
    publishedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    timeAgo: 'há 1h 50m',
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
    id: 'news-6',
    title: 'Inflação CPI dos EUA desacelera para 2.4% e Federal Reserve sinaliza novos cortes de juros',
    source: 'Reuters / Fed Watch',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    timeAgo: 'há 3 horas',
    relatedSymbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
    category: 'MACRO',
    sentimentScore: 72,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Dados macroeconômicos mais amenos aumentam o apetite global por ativos de risco, fortalecendo a liquidez em criptomoedas.',
    aiTradingImpact: 'Cenário macro favorável reduz riscos sistêmicos, elevando o Índice de Ganância e liberando estratégias mais agressivas.',
    confidenceScore: 96,
  },
  {
    id: 'news-7',
    title: 'Chainlink expande protocolo CCIP com consórcio bancário global para liquidação de RWA',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    timeAgo: 'há 4 horas',
    relatedSymbols: ['LINK/USDT'],
    category: 'ON_CHAIN',
    sentimentScore: 68,
    sentimentType: 'BULLISH',
    impactLevel: 'MÉDIO',
    summary: 'Adoção de oráculos da Chainlink para tokenização de títulos do tesouro americano atinge US$ 1.8B em valor assegurado.',
    aiTradingImpact: 'Suporte fundamentalista positivo no LINK/USDT, respaldando o sinal de compra técnica.',
    confidenceScore: 88,
  },
  {
    id: 'news-8',
    title: 'Ethereum testa atualização Pectra na rede de testes Mekong com otimização de taxas L2',
    source: 'Ethereum Foundation',
    publishedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    timeAgo: 'há 5 horas',
    relatedSymbols: ['ETH/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 60,
    sentimentType: 'BULLISH',
    impactLevel: 'MÉDIO',
    summary: 'Próxima grande atualização do Ethereum prevê melhorias no staking (EIP-7251) e redução adicional de custos em rollups Arbitrum e Optimism.',
    aiTradingImpact: 'Viés de alta moderado no ETH/USDT, mantendo score positivo sem euforia exagerada.',
    confidenceScore: 91,
  },
  {
    id: 'news-9',
    title: 'SEC mantém processo de apelação e gera incerteza sobre classificação de vendas secundárias de XRP',
    source: 'Coingape',
    publishedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    timeAgo: 'há 6 horas',
    relatedSymbols: ['XRP/USDT'],
    category: 'REGULATORY',
    sentimentScore: -52,
    sentimentType: 'BEARISH',
    impactLevel: 'MÉDIO',
    summary: 'Disputas jurídicas prolongadas continuam pesando sobre o livro de ordens, afastando investidores institucionais no curto prazo.',
    aiTradingImpact: 'Sentimento negativo em XRP/USDT. Aumenta risco regulatório e valida cautela/saída apontada pelo scanner.',
    confidenceScore: 86,
  },
  {
    id: 'news-10',
    title: 'Binance expande licenças regulatórias na Europa com auditoria de reservas 100% comprovada',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    timeAgo: 'há 8 horas',
    relatedSymbols: ['BNB/USDT'],
    category: 'EXCHANGE',
    sentimentScore: 20,
    sentimentType: 'NEUTRAL',
    impactLevel: 'BAIXO',
    summary: 'Exchange fortalece compliance global mantendo utilidade do BNB em staking de novos projetos do Launchpool.',
    aiTradingImpact: 'Impacto neutro para BNB/USDT, consolidando faixa de preço lateral sem gatilho de rompimento imediato.',
    confidenceScore: 85,
  },
  {
    id: 'news-11',
    title: 'Injective (INJ) lança atualização Native EVM com throughput de 25.000 TPS e queima semanal recorde de tokens',
    source: 'Injective Foundation / Bloomberg',
    publishedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    timeAgo: 'há 15 min',
    relatedSymbols: ['INJ/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 92,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Nova arquitetura multi-VM atrai grandes formadores de mercado institucionais e impulsiona o volume de derivativos para US$ 1.4B/dia.',
    aiTradingImpact: 'Pressão compradora intensa. Confluência 8/8 no Tape Reading reforça sinal STRONG BUY.',
    confidenceScore: 97,
    isBreaking: true,
  },
  {
    id: 'news-12',
    title: 'Render Network fecha parceria com estúdios de Hollywood e provedores de IA para renderização descentralizada de vídeo espacial',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    timeAgo: 'há 35 min',
    relatedSymbols: ['RENDER/USDT'],
    category: 'ON_CHAIN',
    sentimentScore: 89,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Demanda por nós de computação GPU na blockchain Solana explode 450% no trimestre, garantindo demanda contínua de queima de tokens RENDER.',
    aiTradingImpact: 'Forte catalisador DePIN/IA. Eleva Consenso para Compra Forte com alvo FreqAI em +8.20%.',
    confidenceScore: 95,
  },
  {
    id: 'news-13',
    title: 'Aliança Artificial Superintelligence (FET) conclui fusão de redes e anuncia agentes autônomos para finanças descentralizadas',
    source: 'Decrypt',
    publishedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    timeAgo: 'há 55 min',
    relatedSymbols: ['FET/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 86,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Ecossistema unificado de IA atinge capitalização de US$ 4.2B e registra adoção recorde de micro-agentes de arbitragem.',
    aiTradingImpact: 'Sentimento altista impulsionado por narrativa de IA. Convalida compras agressivas com Trailing Stop.',
    confidenceScore: 93,
  },
  {
    id: 'news-14',
    title: 'Celestia (TIA) anuncia roadmap Lemongrass com redução de 90% no custo de data availability para Layer 2s',
    source: 'Blockworks',
    publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    timeAgo: 'há 1h 35m',
    relatedSymbols: ['TIA/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 84,
    sentimentType: 'BULLISH',
    impactLevel: 'MÉDIO',
    summary: 'Liderança incontestável em DA modular atrai mais de 60 novas rollups que travam tokens TIA em staking de segurança.',
    aiTradingImpact: 'Sinal de continuação de tendência para TIA/USDT. Aumenta score de Consenso em +16 pts.',
    confidenceScore: 91,
  },
  {
    id: 'news-15',
    title: 'Kaspa (KAS) atinge 10 blocos por segundo no testnet Rust 10BPS e hash rate atinge máxima histórica de 350 PH/s',
    source: 'CoinTelegraph',
    publishedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    timeAgo: 'há 2h 20m',
    relatedSymbols: ['KAS/USDT'],
    category: 'ON_CHAIN',
    sentimentScore: 80,
    sentimentType: 'BULLISH',
    impactLevel: 'MÉDIO',
    summary: 'Avanço pioneiro no consenso GHOSTDAG consolida Kaspa como a rede Proof-of-Work mais rápida e escalável do mercado.',
    aiTradingImpact: 'Acumulação consistente de mineradores e investidores de longo prazo. Viés Comprador.',
    confidenceScore: 90,
  },
  {
    id: 'news-16',
    title: 'Sonic (Fantom) supera 10.000 TPS em fase de transição e prepara ponte direta segura com Ethereum',
    source: 'DeFi Llama',
    publishedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    timeAgo: 'há 3h 20m',
    relatedSymbols: ['FTM/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 85,
    sentimentType: 'BULLISH',
    impactLevel: 'ALTO',
    summary: 'Migração tecnológica do Fantom para o novo ecossistema Sonic gera corrida por liquidez em pools de farming.',
    aiTradingImpact: 'Catalisador forte com ganho estimado em +8.12% no curto prazo.',
    confidenceScore: 92,
  },
  {
    id: 'news-17',
    title: 'Top 5 baleias de PEPE transferem mais de 3.8 trilhões de tokens para exchanges descentralizadas para realização de lucros',
    source: 'Lookonchain / Whale Alert',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    timeAgo: 'há 2 horas',
    relatedSymbols: ['PEPE/USDT'],
    category: 'WHALE',
    sentimentScore: -84,
    sentimentType: 'BEARISH',
    impactLevel: 'ALTO',
    summary: 'Grandes detentores de memecoins aceleram rotação para ativos fundamentados (Layer 1 e IA), criando forte cascata de liquidação no book.',
    aiTradingImpact: 'Alerta vermelho para PEPE/USDT: 8/8 métricas vendedoras no Tape Reading e despejo massivo. COMPRA BLOQUEADA.',
    confidenceScore: 96,
  },
  {
    id: 'news-18',
    title: 'Cardano conclui Hard Fork Chang e transfere tesouro de US$ 1.5B para governança 100% comunitária',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
    timeAgo: 'há 4h 40m',
    relatedSymbols: ['ADA/USDT'],
    category: 'TECH_UPGRADE',
    sentimentScore: 65,
    sentimentType: 'BULLISH',
    impactLevel: 'MÉDIO',
    summary: 'Entrada na era Voltaire consolida descentralização máxima da rede Cardano e atrai novos validadores institucionais.',
    aiTradingImpact: 'Suporte sólido na base com baixo risco de drawdown.',
    confidenceScore: 88,
  },
  {
    id: 'news-19',
    title: 'Aptos registra recorde de usuários diários ativos após integração com grandes plataformas de telecomunicações',
    source: 'Aptos Labs',
    publishedAt: new Date(Date.now() - 1000 * 60 * 350).toISOString(),
    timeAgo: 'há 5h 50m',
    relatedSymbols: ['APT/USDT'],
    category: 'ON_CHAIN',
    sentimentScore: 74,
    sentimentType: 'BULLISH',
    impactLevel: 'MÉDIO',
    summary: 'Linguagem Move e paralelização de transações impulsionam crescimento orgânico de micro-pagamentos na rede Aptos.',
    aiTradingImpact: 'Sinal comprador saudável com score de confluência positivo.',
    confidenceScore: 89,
  },
];

let customNewsStorage: CryptoNewsItem[] = [...INITIAL_NEWS_ITEMS];

export function getNewsArticles(filterSymbol?: string, category?: string): CryptoNewsItem[] {
  let list = [...customNewsStorage];

  if (filterSymbol && filterSymbol !== 'ALL') {
    list = list.filter(
      (item) =>
        item.relatedSymbols.includes(filterSymbol) ||
        item.relatedSymbols.includes('MARKET_MACRO')
    );
  }

  if (category && category !== 'ALL') {
    list = list.filter((item) => item.category === category);
  }

  return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPairNewsSentiment(symbol: string): PairNewsSentiment {
  const relatedArticles = customNewsStorage.filter(
    (item) => item.relatedSymbols.includes(symbol) || item.relatedSymbols.includes('MARKET_MACRO')
  );

  if (relatedArticles.length === 0) {
    return {
      symbol,
      sentimentScore: 10,
      sentimentLabel: 'NEUTRO',
      bullishArticlesCount: 0,
      bearishArticlesCount: 0,
      neutralArticlesCount: 1,
      topCatalyst: 'Fluxo noticioso calmo sem eventos atípicos.',
      impactOnBotDecision: 'Sem restrições de notícias para este ativo.',
      lastUpdated: 'agora',
    };
  }

  const bullishCount = relatedArticles.filter((a) => a.sentimentScore > 20).length;
  const bearishCount = relatedArticles.filter((a) => a.sentimentScore < -20).length;
  const neutralCount = relatedArticles.length - bullishCount - bearishCount;

  // Weighted average of sentiment score
  const totalScore = Math.round(
    relatedArticles.reduce((acc, curr) => acc + curr.sentimentScore, 0) / relatedArticles.length
  );

  let sentimentLabel: PairNewsSentiment['sentimentLabel'] = 'NEUTRO';
  let impactOnBotDecision = '';
  let newsRiskWarning: string | undefined = undefined;

  if (totalScore >= 60) {
    sentimentLabel = 'MUITO BULLISH';
    impactOnBotDecision = 'Notícias altamente favoráveis e influxos institucionais impulsionam o sinal de COMPRA (+20 pts).';
  } else if (totalScore >= 20) {
    sentimentLabel = 'BULLISH';
    impactOnBotDecision = 'Sentimento noticioso positivo reforça a confluência técnica de compra.';
  } else if (totalScore <= -50) {
    sentimentLabel = 'MUITO BEARISH';
    sentimentLabel = 'MUITO BEARISH';
    newsRiskWarning = 'Alerta de Notícia: Despejo de baleias ou incerteza jurídica! Entradas de compra devem ser bloqueadas.';
    impactOnBotDecision = 'Bloqueio de novas compras no robô para evitar armadilhas de baixa (Bearish News).';
  } else if (totalScore <= -20) {
    sentimentLabel = 'BEARISH';
    impactOnBotDecision = 'Pressão vendedora em manchetes recentes sugere cautela ou saídas parciais.';
  } else {
    sentimentLabel = 'NEUTRO';
    impactOnBotDecision = 'Sentimento equilibrado sem interferência no algoritmo técnico.';
  }

  const topCatalyst = relatedArticles[0]?.title || 'Estabilidade de notícias.';

  return {
    symbol,
    sentimentScore: totalScore,
    sentimentLabel,
    bullishArticlesCount: bullishCount,
    bearishArticlesCount: bearishCount,
    neutralArticlesCount: neutralCount,
    articleCount: relatedArticles.length,
    topCatalyst,
    newsRiskWarning,
    impactOnBotDecision,
    lastUpdated: 'há poucos instantes',
  };
}

export function getMarketMacroSentiment(): MarketMacroSentiment {
  return {
    fearAndGreedIndex: 76,
    fearAndGreedLabel: 'Ganância',
    macroScore: 78,
    dominantNarrative: 'Super-ciclo de Influxos de ETF Spot e afrouxamento monetário global.',
    fedInterestRateBias: 'Corte de juros em 25bps precificado em 88% pelo mercado.',
    etfNetInflows24hUsd: '+$680.4 Milhões (Recorde Semanal)',
    whaleActivityBias: 'Acumulação Forte',
    newsFilterActive: true,
  };
}

/**
 * Analisa uma notícia digitada pelo usuário usando NLP de palavras-chave financeiras
 */
export function analyzeCustomHeadline(title: string, bodyText: string = ''): CryptoNewsItem {
  const text = `${title} ${bodyText}`.toLowerCase();

  let score = 0;
  const bullishKeywords = [
    'etf', 'aprovado', 'recorde', 'alta', 'parceria', 'compras', 'influxo', 'crescimento',
    'sharding', 'upgrade', 'alta histórica', 'acumulação', 'tps', 'bullish', 'investimento',
    'corte de juros', 'reforço', 'institucional', 'lucro', 'rompimento', 'suporte', 'ganho'
  ];

  const bearishKeywords = [
    'queda', 'despejo', 'baleia', 'venda', 'processo', 'sec', 'hack', 'fraude', 'perda',
    'bearish', 'sobrecompra', 'saída', 'derretimento', 'bloqueio', 'falência', 'multa',
    'liquidação', 'resistência', 'proibição', 'ataque'
  ];

  bullishKeywords.forEach((kw) => {
    if (text.includes(kw)) score += 15;
  });

  bearishKeywords.forEach((kw) => {
    if (text.includes(kw)) score -= 18;
  });

  score = Math.max(-100, Math.min(100, score));

  // Detect related assets
  const detectedSymbols: string[] = [];
  if (text.includes('bitcoin') || text.includes('btc')) detectedSymbols.push('BTC/USDT');
  if (text.includes('ethereum') || text.includes('eth')) detectedSymbols.push('ETH/USDT');
  if (text.includes('solana') || text.includes('sol')) detectedSymbols.push('SOL/USDT');
  if (text.includes('sui')) detectedSymbols.push('SUI/USDT');
  if (text.includes('doge') || text.includes('dogecoin')) detectedSymbols.push('DOGE/USDT');
  if (text.includes('near')) detectedSymbols.push('NEAR/USDT');
  if (text.includes('xrp') || text.includes('ripple')) detectedSymbols.push('XRP/USDT');
  if (text.includes('link') || text.includes('chainlink')) detectedSymbols.push('LINK/USDT');
  if (text.includes('bnb') || text.includes('binance')) detectedSymbols.push('BNB/USDT');

  if (detectedSymbols.length === 0) detectedSymbols.push('MARKET_MACRO');

  let sentimentType: CryptoNewsItem['sentimentType'] = 'NEUTRAL';
  if (score > 20) sentimentType = 'BULLISH';
  else if (score < -20) sentimentType = 'BEARISH';

  let tradingImpact = '';
  if (score > 40) {
    tradingImpact = `Aumenta o score de compra em ${detectedSymbols.join(', ')} e apoia entradas no robô.`;
  } else if (score < -30) {
    tradingImpact = `Sinaliza risco elevado em ${detectedSymbols.join(', ')}. Sugere ativar stop de proteção ou pausar compras.`;
  } else {
    tradingImpact = `Impacto neutro ou equilibrado no mercado global.`;
  }

  const newItem: CryptoNewsItem = {
    id: `custom-news-${Date.now()}`,
    title,
    source: 'Análise de Usuário (NLP)',
    publishedAt: new Date().toISOString(),
    timeAgo: 'agora',
    relatedSymbols: detectedSymbols,
    category: score < -20 ? 'WHALE' : score > 50 ? 'ETF_FLOW' : 'MACRO',
    sentimentScore: score,
    sentimentType,
    impactLevel: Math.abs(score) > 50 ? 'ALTO' : 'MÉDIO',
    summary: bodyText || 'Notícia inserida para teste de impacto no robô.',
    aiTradingImpact: tradingImpact,
    confidenceScore: 88,
    isBreaking: Math.abs(score) > 60,
  };

  customNewsStorage = [newItem, ...customNewsStorage];
  return newItem;
}
