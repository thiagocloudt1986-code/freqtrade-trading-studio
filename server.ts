import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { BackendBaseMemory } from './server/backendMemory';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Backend Base Memory
const baseMemory = BackendBaseMemory.getInstance();

// Lazy initialization of Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check & Bot Operational Status
app.get('/api/health', (req, res) => {
  const state = baseMemory.getState();
  res.json({
    status: 'ok',
    bot: 'Freqtrade',
    version: '2025.2-freqai',
    exchange_mode: 'dry-run',
    active_strategy: 'NostalgiaForInfinityX_FreqAI',
    base_memory: {
      active: true,
      open_trades: state.openTrades.length,
      closed_trades: state.closedTrades.length,
      total_news_ingested: state.totalNewsIngested,
      api_sources: state.apiSources,
    },
  });
});

// Full Backend Base Memory State
app.get('/api/memory/base', (req, res) => {
  res.json({
    success: true,
    data: baseMemory.getState(),
  });
});

// Real-time Live News & Market Sentiment API (Auto-polled from Free APIs)
app.get('/api/news/live', (req, res) => {
  const state = baseMemory.getState();
  res.json({
    success: true,
    lastUpdated: state.lastUpdated,
    autoPolling: state.autoPollingActive,
    apiSources: state.apiSources,
    macroSentiment: state.macroSentiment,
    pairSentiments: state.pairSentiments,
    news: state.news,
  });
});

// Force Immediate Sync from Free APIs (CryptoCompare, Alternative.me, Binance)
app.post('/api/news/sync', async (req, res) => {
  try {
    const result = await baseMemory.syncFreeNewsAPIs();
    res.json({
      success: true,
      result,
      state: baseMemory.getState(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Falha ao sincronizar APIs gratuitas de notícias.',
    });
  }
});

// Analyze custom or incoming news headline with NLP / AI
app.post('/api/news/analyze', (req, res) => {
  try {
    const { title, body, source } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Título da notícia é obrigatório' });
    }
    const item = baseMemory.analyzeHeadlineNLP(title, body || '', source || 'Custom Input');
    const state = baseMemory.getState();
    state.news.unshift(item);
    baseMemory.recalculateAllPairSentiments();
    baseMemory.logExecution('NEWS_INGEST', `Notícia customizada analisada: "${title.substring(0, 40)}..." (Score: ${item.sentimentScore})`, 'INFO');

    res.json({
      success: true,
      analyzedItem: item,
      updatedPairSentiments: state.pairSentiments,
      macroSentiment: state.macroSentiment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao processar NLP da notícia.' });
  }
});

// Save / Record 360° Pair Audit in Base Memory
app.post('/api/memory/audit', (req, res) => {
  try {
    const { pair, consensusScore, verdict, solidSignal, recommendation, newsSentimentScore } = req.body;
    if (!pair) {
      return res.status(400).json({ error: 'Par é obrigatório para registrar auditoria' });
    }
    const record = baseMemory.recordPairAudit({
      pair,
      consensusScore: consensusScore || 0,
      verdict: verdict || 'Auditado',
      solidSignal: !!solidSignal,
      recommendation: recommendation || 'Acompanhar confluência',
      newsSentimentScore: newsSentimentScore || 0,
    });
    res.json({ success: true, record });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao gravar auditoria na base memory.' });
  }
});

// Execute / Open Trade in Base Memory
app.post('/api/memory/trades/execute', (req, res) => {
  try {
    const { pair, direction, stakeAmount, stopLossPct, roiTargetPct, strategy } = req.body;
    if (!pair || !direction || !stakeAmount) {
      return res.status(400).json({ error: 'Par, direção e stakeAmount são obrigatórios' });
    }
    const newTrade = baseMemory.executeTrade({
      pair,
      direction,
      stakeAmount: parseFloat(stakeAmount),
      stopLossPct: stopLossPct ? parseFloat(stopLossPct) : undefined,
      roiTargetPct: roiTargetPct ? parseFloat(roiTargetPct) : undefined,
      strategy,
    });
    res.json({ success: true, trade: newTrade, wallet: baseMemory.getState().wallet });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao executar trade na base memory.' });
  }
});

// Close Trade in Base Memory
app.post('/api/memory/trades/close', (req, res) => {
  try {
    const { tradeId, exitReason } = req.body;
    if (!tradeId) {
      return res.status(400).json({ error: 'tradeId é obrigatório' });
    }
    const closed = baseMemory.closeTrade(parseInt(tradeId, 10), exitReason || 'roi');
    if (!closed) {
      return res.status(404).json({ error: 'Trade não encontrado em aberto' });
    }
    res.json({ success: true, closedTrade: closed, wallet: baseMemory.getState().wallet });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao encerrar trade.' });
  }
});

// Real/simulated market data proxy (synchronized with Base Memory)
app.get('/api/market/tickers', async (req, res) => {
  const state = baseMemory.getState();
  res.json({ success: true, source: 'backend_base_memory', tickers: state.tickers });
});

// Live 24/7 Binance Tickers Proxy Endpoint
app.get('/api/market/binance-tickers', async (req, res) => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    if (!response.ok) {
      throw new Error(`Binance HTTP error: ${response.status}`);
    }
    const data = await response.json();
    res.json({ success: true, raw: data });
  } catch (error: any) {
    const state = baseMemory.getState();
    res.json({ success: false, fallback: true, tickers: state.tickers, error: error.message });
  }
});

// Live 24/7 Binance Candlesticks (Klines) Proxy Endpoint
app.get('/api/market/binance-klines', async (req, res) => {
  try {
    const symbol = (req.query.symbol as string || 'BTCUSDT').toUpperCase();
    const interval = (req.query.interval as string || '5m');
    const limit = (req.query.limit as string || '60');

    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Binance Klines HTTP error: ${response.status}`);
    }
    const klines = await response.json();
    res.json({ success: true, symbol, interval, klines });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Gemini AI Freqtrade Strategy & Trade Copilot
app.post('/api/ai/analyze-strategy', async (req, res) => {
  try {
    const { strategyCode, userPrompt, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in server environment. Please configure it in AI Studio settings.',
      });
    }

    const systemPrompt = `You are the ultimate Freqtrade & FreqAI Quantitative Trading Specialist and Python developer.
Freqtrade is an open-source cryptocurrency algorithmic trading bot (Python, CCXT, pandas-ta, technical, LightGBM/CatBoost/XGBoost for FreqAI).
Your job is to provide expert analysis, code suggestions, risk optimization, indicator selection, Hyperopt parameter definitions, and FreqAI feature engineering advice.
Always be accurate with Freqtrade methods like:
- populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame
- populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame
- populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame
- custom_stoploss(self, pair: str, trade: 'Trade', current_time: datetime, current_rate: float, current_profit: float, **kwargs) -> float
- FreqAI model training, feature generation, Dissimilarity Index (DI), &-target columns.

Format your responses with clean Markdown, clear sections, bullet points, and high-quality Python code snippets where needed.`;

    const contents = `User Request: ${userPrompt || 'Analyze and optimize this Freqtrade strategy'}

Context: ${JSON.stringify(context || {})}

Strategy / Configuration Code:
\`\`\`python
${strategyCode || '# No code provided'}
\`\`\``;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      success: true,
      analysis: response.text,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process AI analysis request.',
    });
  }
});

// Generate new Freqtrade Python Strategy with AI
app.post('/api/ai/generate-strategy', async (req, res) => {
  try {
    const { strategyName, timeframe, indicators, tradingStyle, useFreqAI } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in server environment.',
      });
    }

    const systemPrompt = `You are a quantitative trading developer specializing in Freqtrade Python strategies.
Generate a complete, fully functional, syntax-valid Freqtrade strategy file adhering to Freqtrade 2025 standard IStrategy class structure.
Return ONLY valid Python code or wrap it in a clean markdown code block.`;

    const prompt = `Generate a production-ready Freqtrade Strategy named "${strategyName || 'FreqAlphaV1'}".
Timeframe: ${timeframe || '5m'}
Trading style: ${tradingStyle || 'Trend Following + Mean Reversion breakout'}
Requested Indicators / Rules: ${indicators || 'RSI 14, EMA 20/50/200, Bollinger Bands, ATR Trailing Stop'}
Use FreqAI module: ${useFreqAI ? 'YES (include feature_engineering_expand_all and FreqAI targets)' : 'NO (pure TA indicators)'}

Ensure the code includes:
- standard imports (talib or pandas_ta, qtpylib, IStrategy, CategoricalParameter, DecimalParameter, IntParameter for Hyperopt)
- minimal_roi table
- stoploss
- trailing_stop settings
- populate_indicators()
- populate_entry_trend()
- populate_exit_trend()
- custom_stoploss() if applicable.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      success: true,
      strategyCode: response.text,
    });
  } catch (error: any) {
    console.error('Gemini Generate Strategy Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate strategy.',
    });
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Freqtrade Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
