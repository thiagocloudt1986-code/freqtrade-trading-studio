import { CryptoNewsItem, PairNewsSentiment, MarketMacroSentiment, OpenTrade, ClosedTrade, TickerData } from '../types';

export interface BaseMemoryResponse {
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
    type: string;
    message: string;
    level: string;
  }>;
}

export interface LiveNewsApiResponse {
  success: boolean;
  lastUpdated: string;
  autoPolling: boolean;
  apiSources: BaseMemoryResponse['apiSources'];
  macroSentiment: MarketMacroSentiment;
  pairSentiments: Record<string, PairNewsSentiment>;
  news: CryptoNewsItem[];
}

export const backendApi = {
  /**
   * Fetch entire backend base memory snapshot
   */
  async getBaseMemory(): Promise<BaseMemoryResponse | null> {
    try {
      const res = await fetch('/api/memory/base');
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Fetch live automatically monitored news and sentiment
   */
  async getLiveNews(): Promise<LiveNewsApiResponse | null> {
    try {
      const res = await fetch('/api/news/live');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Force on-demand sync from free public news APIs
   */
  async syncFreeNews(): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      const res = await fetch('/api/news/sync', { method: 'POST' });
      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}` };
      }
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Analyze custom headline with real-time NLP
   */
  async analyzeNews(title: string, body: string = '', source: string = 'Entrada Manual') {
    try {
      const res = await fetch('/api/news/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, source }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Record 360° pair consensus audit in backend base memory
   */
  async recordPairAudit(params: {
    pair: string;
    consensusScore: number;
    verdict: string;
    solidSignal: boolean;
    recommendation: string;
    newsSentimentScore: number;
  }) {
    try {
      const res = await fetch('/api/memory/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  /**
   * Open trade in backend base memory
   */
  async executeTrade(params: {
    pair: string;
    direction: 'long' | 'short';
    stakeAmount: number;
    stopLossPct?: number;
    roiTargetPct?: number;
    strategy?: string;
  }) {
    try {
      const res = await fetch('/api/memory/trades/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Close trade in backend base memory
   */
  async closeTrade(tradeId: number, exitReason: string = 'roi') {
    try {
      const res = await fetch('/api/memory/trades/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId, exitReason }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
};
