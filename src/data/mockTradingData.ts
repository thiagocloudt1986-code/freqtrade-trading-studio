import { OpenTrade, ClosedTrade, CandleData, FreqAIState, BacktestResults, HyperOptEpoch, StrategyCatalogItem, LogEntry, FreqtradeConfig, TickerData } from '../types';

export const INITIAL_BOT_CONFIG: FreqtradeConfig = {
  max_open_trades: 5,
  stake_currency: 'USDT',
  stake_amount: 1000,
  tradable_balance_ratio: 0.99,
  dry_run: true,
  dry_run_wallet: 12500,
  cancel_open_orders_on_exit: false,
  timeframe: '5m',
  trailing_stop: true,
  trailing_stop_positive: 0.015,
  trailing_stop_positive_offset: 0.028,
  trailing_only_offset_is_reached: true,
  use_exit_signal: true,
  exit_profit_only: false,
  ignore_roi_if_entry_signal: false,
  exchange: {
    name: 'binance',
    key: '****************',
    secret: '****************',
    ccxt_config: {},
    ccxt_async_config: {},
    pair_whitelist: [
      'BTC/USDT',
      'ETH/USDT',
      'SOL/USDT',
      'SUI/USDT',
      'NEAR/USDT',
      'INJ/USDT',
      'RENDER/USDT',
      'FET/USDT',
      'TIA/USDT',
      'KAS/USDT',
      'AVAX/USDT',
      'LINK/USDT',
      'APT/USDT',
      'ARB/USDT',
      'OP/USDT',
      'ADA/USDT',
      'DOT/USDT',
      'FTM/USDT',
      'BNB/USDT',
      'ATOM/USDT',
      'MATIC/USDT',
      'XRP/USDT',
      'DOGE/USDT',
      'PEPE/USDT',
    ],
    pair_blacklist: [
      'TUSD/USDT',
      'USDC/USDT',
      'FDUSD/USDT',
      '.*BEAR/.*',
      '.*BULL/.*',
      '.*UP/.*',
      '.*DOWN/.*',
    ],
  },
  pair_whitelist: [
    'BTC/USDT',
    'ETH/USDT',
    'SOL/USDT',
    'SUI/USDT',
    'NEAR/USDT',
    'INJ/USDT',
    'RENDER/USDT',
    'FET/USDT',
    'TIA/USDT',
    'KAS/USDT',
    'AVAX/USDT',
    'LINK/USDT',
    'APT/USDT',
    'ARB/USDT',
    'OP/USDT',
    'ADA/USDT',
    'DOT/USDT',
    'FTM/USDT',
    'BNB/USDT',
    'ATOM/USDT',
    'MATIC/USDT',
    'XRP/USDT',
    'DOGE/USDT',
    'PEPE/USDT',
  ],
  pair_blacklist: [
    'TUSD/USDT',
    'USDC/USDT',
    'FDUSD/USDT',
    '.*BEAR/.*',
    '.*BULL/.*',
    '.*UP/.*',
    '.*DOWN/.*',
  ],
  strategy: 'NostalgiaForInfinityX_FreqAI',
  entry_pricing: {
    price_side: 'same',
    use_order_book: true,
    order_book_top: 1,
    price_last_balance: 0.0,
  },
  exit_pricing: {
    price_side: 'same',
    use_order_book: true,
    order_book_top: 1,
  },
  freqai: {
    enabled: true,
    purge_old_models: false,
    train_period_days: 30,
    backtest_period_days: 7,
    identifier: 'LightGBMRegressor_5m_v4',
    feature_parameters: {
      include_corr_pairlist: ['BTC/USDT', 'ETH/USDT'],
      include_timeframes: ['5m', '15m', '1h'],
      label_period_candles: 12,
      include_shifted_candles: 2,
      DI_threshold: 0.45,
      weight_factor: 0.9,
      principal_component_analysis: false,
      use_SVM_to_remove_outliers: true,
      plot_feature_importances: 8,
    },
    data_kitchen_thread_count: 4,
    model_training_parameters: {
      n_estimators: 1500,
      learning_rate: 0.03,
      num_leaves: 64,
      max_depth: 8,
    },
  },
  telegram: {
    enabled: true,
    token: '719283921:AAH8a9Kz8w7eY2...',
    chat_id: '982736410',
    notification_settings: {
      status: 'on',
      warning: 'on',
      startup: 'on',
      entry: 'on',
      exit: 'on',
      entry_cancel: 'on',
      exit_cancel: 'on',
    },
  },
  api_server: {
    enabled: true,
    listen_ip_address: '127.0.0.1',
    listen_port: 8080,
    verbosity: 'info',
    enable_openapi: true,
    jwt_secret_key: 'freqtrade_secret_jwt_key',
    CORS_origins: ['http://localhost:3000'],
  },
  bot_name: 'freqtrade_master_node',
  initial_state: 'running',
  force_entry_enable: true,
};

export const INITIAL_TICKERS: TickerData[] = [
  { symbol: 'BTC/USDT', rawSymbol: 'BTCUSDT', lastPrice: 94820.5, priceChangePercent: 3.42, highPrice: 96100.0, lowPrice: 92400.0, volume: 28410, quoteVolume: 2690000000 },
  { symbol: 'ETH/USDT', rawSymbol: 'ETHUSDT', lastPrice: 3415.5, priceChangePercent: 2.15, highPrice: 3490.0, lowPrice: 3310.0, volume: 184500, quoteVolume: 628000000 },
  { symbol: 'SOL/USDT', rawSymbol: 'SOLUSDT', lastPrice: 198.45, priceChangePercent: 6.84, highPrice: 204.0, lowPrice: 186.2, volume: 1420000, quoteVolume: 278000000 },
  { symbol: 'SUI/USDT', rawSymbol: 'SUIUSDT', lastPrice: 3.48, priceChangePercent: 11.24, highPrice: 3.65, lowPrice: 3.08, volume: 45200000, quoteVolume: 154000000 },
  { symbol: 'INJ/USDT', rawSymbol: 'INJUSDT', lastPrice: 28.65, priceChangePercent: 9.45, highPrice: 29.80, lowPrice: 25.90, volume: 4850000, quoteVolume: 138000000 },
  { symbol: 'RENDER/USDT', rawSymbol: 'RENDERUSDT', lastPrice: 8.92, priceChangePercent: 8.70, highPrice: 9.25, lowPrice: 8.10, volume: 14200000, quoteVolume: 124000000 },
  { symbol: 'NEAR/USDT', rawSymbol: 'NEARUSDT', lastPrice: 6.84, priceChangePercent: 7.92, highPrice: 7.15, lowPrice: 6.22, volume: 18200000, quoteVolume: 122000000 },
  { symbol: 'FET/USDT', rawSymbol: 'FETUSDT', lastPrice: 1.64, priceChangePercent: 7.85, highPrice: 1.72, lowPrice: 1.50, volume: 54000000, quoteVolume: 88500000 },
  { symbol: 'TIA/USDT', rawSymbol: 'TIAUSDT', lastPrice: 6.45, priceChangePercent: 6.30, highPrice: 6.78, lowPrice: 5.95, volume: 16800000, quoteVolume: 108000000 },
  { symbol: 'KAS/USDT', rawSymbol: 'KASUSDT', lastPrice: 0.168, priceChangePercent: 5.95, highPrice: 0.176, lowPrice: 0.156, volume: 380000000, quoteVolume: 63800000 },
  { symbol: 'LINK/USDT', rawSymbol: 'LINKUSDT', lastPrice: 19.11, priceChangePercent: 5.18, highPrice: 19.8, lowPrice: 17.9, volume: 6200000, quoteVolume: 116000000 },
  { symbol: 'APT/USDT', rawSymbol: 'APTUSDT', lastPrice: 11.25, priceChangePercent: 4.80, highPrice: 11.80, lowPrice: 10.60, volume: 8400000, quoteVolume: 94500000 },
  { symbol: 'AVAX/USDT', rawSymbol: 'AVAXUSDT', lastPrice: 34.84, priceChangePercent: 4.30, highPrice: 35.8, lowPrice: 32.9, volume: 3800000, quoteVolume: 131000000 },
  { symbol: 'ARB/USDT', rawSymbol: 'ARBUSDT', lastPrice: 0.825, priceChangePercent: 3.90, highPrice: 0.865, lowPrice: 0.785, volume: 112000000, quoteVolume: 92400000 },
  { symbol: 'FTM/USDT', rawSymbol: 'FTMUSDT', lastPrice: 0.885, priceChangePercent: 8.12, highPrice: 0.925, lowPrice: 0.805, volume: 98000000, quoteVolume: 86700000 },
  { symbol: 'OP/USDT', rawSymbol: 'OPUSDT', lastPrice: 1.92, priceChangePercent: 3.45, highPrice: 2.04, lowPrice: 1.82, volume: 36000000, quoteVolume: 69100000 },
  { symbol: 'ADA/USDT', rawSymbol: 'ADAUSDT', lastPrice: 0.784, priceChangePercent: 3.15, highPrice: 0.820, lowPrice: 0.750, volume: 145000000, quoteVolume: 113600000 },
  { symbol: 'DOT/USDT', rawSymbol: 'DOTUSDT', lastPrice: 7.85, priceChangePercent: 2.40, highPrice: 8.15, lowPrice: 7.55, volume: 12500000, quoteVolume: 98100000 },
  { symbol: 'BNB/USDT', rawSymbol: 'BNBUSDT', lastPrice: 658.2, priceChangePercent: 1.12, highPrice: 665.0, lowPrice: 642.0, volume: 98000, quoteVolume: 64200000 },
  { symbol: 'ATOM/USDT', rawSymbol: 'ATOMUSDT', lastPrice: 6.42, priceChangePercent: 0.85, highPrice: 6.70, lowPrice: 6.25, volume: 8200000, quoteVolume: 52600000 },
  { symbol: 'MATIC/USDT', rawSymbol: 'MATICUSDT', lastPrice: 0.485, priceChangePercent: 0.40, highPrice: 0.510, lowPrice: 0.472, volume: 85000000, quoteVolume: 41200000 },
  { symbol: 'XRP/USDT', rawSymbol: 'XRPUSDT', lastPrice: 2.18, priceChangePercent: -1.25, highPrice: 2.32, lowPrice: 2.12, volume: 89000000, quoteVolume: 195000000 },
  { symbol: 'DOGE/USDT', rawSymbol: 'DOGEUSDT', lastPrice: 0.248, priceChangePercent: -2.10, highPrice: 0.265, lowPrice: 0.241, volume: 320000000, quoteVolume: 79000000 },
  { symbol: 'PEPE/USDT', rawSymbol: 'PEPEUSDT', lastPrice: 0.0000185, priceChangePercent: -4.65, highPrice: 0.0000205, lowPrice: 0.0000178, volume: 9500000000000, quoteVolume: 175000000 },
];

export const INITIAL_OPEN_TRADES: OpenTrade[] = [
  {
    id: 421,
    pair: 'BTC/USDT',
    direction: 'long',
    stakeAmount: 1200,
    amount: 0.01282,
    openRate: 93600.0,
    currentRate: 94820.5,
    currentProfit: 15.65,
    currentProfitPct: 1.30,
    stopLossRate: 91728.0,
    stopLossPct: -2.0,
    initialStopLossRate: 90792.0,
    trailingStopLoss: true,
    roiTargetRate: 96408.0,
    roiTargetPct: 3.0,
    openTimestamp: Date.now() - 3600 * 1000 * 3.5,
    openDate: 'Today, 09:26:14',
    durationMinutes: 210,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 2.85,
      dissimilarityIndex: 0.28,
      modelConfidence: 0.89,
    },
  },
  {
    id: 422,
    pair: 'SOL/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 5.263,
    openRate: 190.0,
    currentRate: 198.45,
    currentProfit: 44.47,
    currentProfitPct: 4.45,
    stopLossRate: 194.20,
    stopLossPct: -2.14,
    initialStopLossRate: 184.30,
    trailingStopLoss: true,
    roiTargetRate: 201.40,
    roiTargetPct: 6.0,
    openTimestamp: Date.now() - 3600 * 1000 * 6.2,
    openDate: 'Today, 06:44:30',
    durationMinutes: 372,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 5.12,
      dissimilarityIndex: 0.22,
      modelConfidence: 0.94,
    },
  },
  {
    id: 423,
    pair: 'NEAR/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 153.84,
    openRate: 6.50,
    currentRate: 6.84,
    currentProfit: 52.31,
    currentProfitPct: 5.23,
    stopLossRate: 6.65,
    stopLossPct: -2.78,
    initialStopLossRate: 6.30,
    trailingStopLoss: true,
    roiTargetRate: 7.02,
    roiTargetPct: 8.0,
    openTimestamp: Date.now() - 3600 * 1000 * 1.8,
    openDate: 'Today, 11:08:45',
    durationMinutes: 108,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 7.40,
      dissimilarityIndex: 0.35,
      modelConfidence: 0.86,
    },
  },
  {
    id: 424,
    pair: 'SUI/USDT',
    direction: 'long',
    stakeAmount: 1050,
    amount: 328.12,
    openRate: 3.20,
    currentRate: 3.48,
    currentProfit: 91.87,
    currentProfitPct: 8.75,
    stopLossRate: 3.38,
    stopLossPct: -2.87,
    initialStopLossRate: 3.10,
    trailingStopLoss: true,
    roiTargetRate: 3.52,
    roiTargetPct: 10.0,
    openTimestamp: Date.now() - 3600 * 1000 * 8.4,
    openDate: 'Today, 04:32:00',
    durationMinutes: 504,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 9.80,
      dissimilarityIndex: 0.19,
      modelConfidence: 0.96,
    },
  },
  {
    id: 425,
    pair: 'INJ/USDT',
    direction: 'long',
    stakeAmount: 1100,
    amount: 40.74,
    openRate: 27.00,
    currentRate: 28.65,
    currentProfit: 67.22,
    currentProfitPct: 6.11,
    stopLossRate: 27.80,
    stopLossPct: -2.96,
    initialStopLossRate: 26.20,
    trailingStopLoss: true,
    roiTargetRate: 30.50,
    roiTargetPct: 12.96,
    openTimestamp: Date.now() - 3600 * 1000 * 4.2,
    openDate: 'Today, 08:45:10',
    durationMinutes: 252,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 8.90,
      dissimilarityIndex: 0.21,
      modelConfidence: 0.93,
    },
  },
  {
    id: 426,
    pair: 'RENDER/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 120.48,
    openRate: 8.30,
    currentRate: 8.92,
    currentProfit: 74.69,
    currentProfitPct: 7.47,
    stopLossRate: 8.65,
    stopLossPct: -3.02,
    initialStopLossRate: 8.05,
    trailingStopLoss: true,
    roiTargetRate: 9.35,
    roiTargetPct: 12.65,
    openTimestamp: Date.now() - 3600 * 1000 * 5.1,
    openDate: 'Today, 07:50:30',
    durationMinutes: 306,
    leverage: 1,
    strategy: 'NostalgiaForInfinityX_FreqAI',
    timeframe: '5m',
    freqaiPrediction: {
      predictedGainPct: 8.20,
      dissimilarityIndex: 0.23,
      modelConfidence: 0.91,
    },
  },
];

export const INITIAL_CLOSED_TRADES: ClosedTrade[] = [
  {
    id: 420,
    pair: 'ETH/USDT',
    direction: 'long',
    stakeAmount: 1200,
    amount: 0.3636,
    openRate: 3300.0,
    closeRate: 3415.5,
    profitUsdt: 42.0,
    profitPct: 3.50,
    openDate: 'Yesterday, 18:20:00',
    closeDate: 'Today, 03:15:20',
    duration: '8h 55m',
    exitReason: 'roi',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.21,
  },
  {
    id: 419,
    pair: 'AVAX/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 29.85,
    openRate: 33.5,
    closeRate: 34.84,
    profitUsdt: 40.0,
    profitPct: 4.0,
    openDate: 'Yesterday, 14:10:00',
    closeDate: 'Yesterday, 22:40:00',
    duration: '8h 30m',
    exitReason: 'trailing_stop_loss',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.02,
  },
  {
    id: 418,
    pair: 'LINK/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 54.94,
    openRate: 18.2,
    closeRate: 19.11,
    profitUsdt: 50.0,
    profitPct: 5.0,
    openDate: 'Yesterday, 08:30:00',
    closeDate: 'Yesterday, 16:20:00',
    duration: '7h 50m',
    exitReason: 'roi',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.05,
  },
  {
    id: 417,
    pair: 'DOGE/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 3968.25,
    openRate: 0.252,
    closeRate: 0.244,
    profitUsdt: -31.75,
    profitPct: -3.17,
    openDate: '2 days ago',
    closeDate: '2 days ago',
    duration: '3h 12m',
    exitReason: 'stop_loss',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 0.98,
  },
  {
    id: 416,
    pair: 'BNB/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 1.56,
    openRate: 640.0,
    closeRate: 658.0,
    profitUsdt: 28.12,
    profitPct: 2.81,
    openDate: '2 days ago',
    closeDate: '2 days ago',
    duration: '14h 22m',
    exitReason: 'exit_signal',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.03,
  },
  {
    id: 415,
    pair: 'BTC/USDT',
    direction: 'long',
    stakeAmount: 1500,
    amount: 0.0163,
    openRate: 92000.0,
    closeRate: 94100.0,
    profitUsdt: 34.24,
    profitPct: 2.28,
    openDate: '3 days ago',
    closeDate: '3 days ago',
    duration: '11h 05m',
    exitReason: 'roi',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.54,
  },
  {
    id: 414,
    pair: 'SOL/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 5.68,
    openRate: 176.0,
    closeRate: 187.2,
    profitUsdt: 63.63,
    profitPct: 6.36,
    openDate: '3 days ago',
    closeDate: '3 days ago',
    duration: '9h 40m',
    exitReason: 'trailing_stop_loss',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.08,
  },
  {
    id: 413,
    pair: 'XRP/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 454.54,
    openRate: 2.20,
    closeRate: 2.15,
    profitUsdt: -22.72,
    profitPct: -2.27,
    openDate: '4 days ago',
    closeDate: '4 days ago',
    duration: '4h 15m',
    exitReason: 'stop_loss',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 0.95,
  },
  {
    id: 412,
    pair: 'TIA/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 169.49,
    openRate: 5.90,
    closeRate: 6.35,
    profitUsdt: 76.27,
    profitPct: 7.63,
    openDate: '4 days ago',
    closeDate: '4 days ago',
    duration: '6h 40m',
    exitReason: 'roi',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.04,
  },
  {
    id: 411,
    pair: 'ADA/USDT',
    direction: 'long',
    stakeAmount: 1000,
    amount: 1333.33,
    openRate: 0.75,
    closeRate: 0.785,
    profitUsdt: 46.66,
    profitPct: 4.67,
    openDate: '5 days ago',
    closeDate: '5 days ago',
    duration: '12h 10m',
    exitReason: 'roi',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 1.01,
  },
  {
    id: 410,
    pair: 'PEPE/USDT',
    direction: 'long',
    stakeAmount: 800,
    amount: 41025641,
    openRate: 0.0000195,
    closeRate: 0.0000186,
    profitUsdt: -36.92,
    profitPct: -4.62,
    openDate: '5 days ago',
    closeDate: '5 days ago',
    duration: '2h 45m',
    exitReason: 'stop_loss',
    strategy: 'NostalgiaForInfinityX_FreqAI',
    leverage: 1,
    fees: 0.79,
  },
];

export const INITIAL_FREQAI_STATE: FreqAIState = {
  enabled: true,
  modelName: 'LightGBMRegressor_5m_v4',
  algorithm: 'LightGBM',
  trainWindowDays: 30,
  candlesTrained: 17280,
  lastTrainedTime: '18 minutes ago',
  retrainIntervalHours: 4,
  dissimilarityThreshold: 0.45,
  currentDI: 0.26,
  outlierCutoff: 3.0,
  featureImportance: [
    { feature: 'RSI_14_1h', importance: 0.182, description: 'Higher timeframe RSI momentum anchor' },
    { feature: 'volume_mean_ratio_12', importance: 0.145, description: 'Relative volume breakout intensity' },
    { feature: 'bb_width_5m', importance: 0.128, description: 'Bollinger volatility squeeze detection' },
    { feature: 'pct_change_3', importance: 0.114, description: 'Immediate price velocity over 3 candles' },
    { feature: 'orderbook_imbalance_bid_ask', importance: 0.098, description: 'Orderbook micro-depth pressure' },
    { feature: 'ema_ratio_20_200', importance: 0.089, description: 'Macro trend alignment indicator' },
    { feature: 'macd_hist_slope_5', importance: 0.076, description: 'MACD histogram acceleration' },
    { feature: 'atr_pct_5m', importance: 0.068, description: 'Average true range risk normalization' },
  ],
  modelMetrics: {
    mse: 0.00042,
    r2Score: 0.784,
    accuracyWinRate: 74.2,
    outlierPercent: 2.8,
    epochs: 1500,
  },
  liveSignals: [
    { pair: 'SUI/USDT', targetGainPct: 9.80, diScore: 0.19, validSignal: true, recommendation: 'STRONG BUY' },
    { pair: 'INJ/USDT', targetGainPct: 8.90, diScore: 0.21, validSignal: true, recommendation: 'STRONG BUY' },
    { pair: 'RENDER/USDT', targetGainPct: 8.20, diScore: 0.23, validSignal: true, recommendation: 'STRONG BUY' },
    { pair: 'NEAR/USDT', targetGainPct: 7.40, diScore: 0.35, validSignal: true, recommendation: 'BUY' },
    { pair: 'FET/USDT', targetGainPct: 6.85, diScore: 0.27, validSignal: true, recommendation: 'BUY' },
    { pair: 'TIA/USDT', targetGainPct: 6.20, diScore: 0.29, validSignal: true, recommendation: 'BUY' },
    { pair: 'SOL/USDT', targetGainPct: 5.12, diScore: 0.22, validSignal: true, recommendation: 'STRONG BUY' },
    { pair: 'KAS/USDT', targetGainPct: 4.90, diScore: 0.30, validSignal: true, recommendation: 'BUY' },
    { pair: 'FTM/USDT', targetGainPct: 4.60, diScore: 0.32, validSignal: true, recommendation: 'BUY' },
    { pair: 'APT/USDT', targetGainPct: 4.10, diScore: 0.33, validSignal: true, recommendation: 'BUY' },
    { pair: 'BTC/USDT', targetGainPct: 2.85, diScore: 0.28, validSignal: true, recommendation: 'BUY' },
    { pair: 'ADA/USDT', targetGainPct: 2.65, diScore: 0.36, validSignal: true, recommendation: 'BUY' },
    { pair: 'ARB/USDT', targetGainPct: 2.40, diScore: 0.38, validSignal: true, recommendation: 'BUY' },
    { pair: 'OP/USDT', targetGainPct: 2.10, diScore: 0.39, validSignal: true, recommendation: 'HOLD' },
    { pair: 'DOT/USDT', targetGainPct: 1.85, diScore: 0.40, validSignal: true, recommendation: 'HOLD' },
    { pair: 'ETH/USDT', targetGainPct: 1.45, diScore: 0.31, validSignal: true, recommendation: 'HOLD' },
    { pair: 'ATOM/USDT', targetGainPct: 0.95, diScore: 0.42, validSignal: false, recommendation: 'HOLD' },
    { pair: 'MATIC/USDT', targetGainPct: 0.40, diScore: 0.43, validSignal: false, recommendation: 'STANDBY (DI HIGH)' },
    { pair: 'BNB/USDT', targetGainPct: -0.60, diScore: 0.41, validSignal: false, recommendation: 'SELL' },
    { pair: 'XRP/USDT', targetGainPct: -1.25, diScore: 0.48, validSignal: false, recommendation: 'SELL' },
    { pair: 'DOGE/USDT', targetGainPct: -2.10, diScore: 0.58, validSignal: false, recommendation: 'SELL' },
    { pair: 'PEPE/USDT', targetGainPct: -4.40, diScore: 0.62, validSignal: false, recommendation: 'SELL' },
  ],
};

export function generateCandleData(basePrice: number = 94000, count: number = 40): CandleData[] {
  const candles: CandleData[] = [];
  let price = basePrice * 0.96;
  const now = Date.now();
  const fiveMinMs = 5 * 60 * 1000;
  const decimals = basePrice >= 1000 ? 1 : basePrice >= 10 ? 2 : basePrice >= 1 ? 4 : basePrice >= 0.01 ? 5 : 8;

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * fiveMinMs;
    const dateObj = new Date(timestamp);
    const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    // Random walk with slight upward drift
    const changePct = (Math.random() - 0.47) * 0.008;
    const open = price;
    const close = price * (1 + changePct);
    const high = Math.max(open, close) * (1 + Math.random() * 0.003);
    const low = Math.min(open, close) * (1 - Math.random() * 0.003);
    const volume = Math.floor(Math.random() * 120 + 40);

    price = close;

    // Technical indicators approximation
    const ema20 = price * (1 + (Math.sin(i / 4) * 0.002));
    const ema50 = price * (1 - (i * 0.0003));
    const ema200 = price * 0.985;
    const bbMiddle = ema20;
    const bbUpper = bbMiddle * 1.012;
    const bbLower = bbMiddle * 0.988;
    const rsi = Math.min(85, Math.max(25, 52 + Math.sin(i / 3) * 22 + (Math.random() - 0.5) * 8));
    const macd = (open - ema20) * 0.8;
    const macdSignal = macd * 0.7;
    const macdHist = macd - macdSignal;
    const freqaiPredictedClose = close * (1 + (Math.sin(i / 5) * 0.006) + 0.003);
    const freqaiDI = Math.max(0.12, Math.min(0.65, 0.25 + Math.cos(i / 6) * 0.12));

    let signal: 'buy_long' | 'buy_short' | 'exit_long' | 'exit_short' | undefined = undefined;
    let tradeMarker: CandleData['tradeMarker'] = undefined;

    if (i === 28) {
      signal = 'buy_long';
      tradeMarker = { type: 'entry', price: close, text: 'LONG ENTRY (FreqAI + RSI Oversold)' };
    } else if (i === 15) {
      signal = 'exit_long';
      tradeMarker = { type: 'exit', price: close, text: 'EXIT ROI Target (+3.2%)', profitPct: 3.2 };
    } else if (i === 8) {
      signal = 'buy_long';
      tradeMarker = { type: 'entry', price: close, text: 'LONG ENTRY (BB Squeeze Breakout)' };
    }

    candles.push({
      time: timeStr,
      timestamp,
      open: parseFloat(open.toFixed(decimals)),
      high: parseFloat(high.toFixed(decimals)),
      low: parseFloat(low.toFixed(decimals)),
      close: parseFloat(close.toFixed(decimals)),
      volume,
      ema20: parseFloat(ema20.toFixed(decimals)),
      ema50: parseFloat(ema50.toFixed(decimals)),
      ema200: parseFloat(ema200.toFixed(decimals)),
      bbUpper: parseFloat(bbUpper.toFixed(decimals)),
      bbMiddle: parseFloat(bbMiddle.toFixed(decimals)),
      bbLower: parseFloat(bbLower.toFixed(decimals)),
      rsi: parseFloat(rsi.toFixed(1)),
      macd: parseFloat(macd.toFixed(decimals)),
      macdSignal: parseFloat(macdSignal.toFixed(decimals)),
      macdHist: parseFloat(macdHist.toFixed(decimals)),
      freqaiPredictedClose: parseFloat(freqaiPredictedClose.toFixed(decimals)),
      freqaiDI: parseFloat(freqaiDI.toFixed(2)),
      signal,
      tradeMarker,
    });
  }

  return candles;
}

export const INITIAL_BACKTEST_RESULTS: BacktestResults = {
  summary: {
    totalTrades: 384,
    wins: 298,
    losses: 82,
    draws: 4,
    winRatePct: 77.6,
    startingBalance: 10000,
    finalBalance: 14820.5,
    totalProfitUsdt: 4820.5,
    totalProfitPct: 48.21,
    cagrPct: 184.5,
    profitFactor: 2.68,
    sharpeRatio: 2.45,
    sortinoRatio: 3.82,
    calmarRatio: 7.42,
    maxDrawdownPct: 6.5,
    maxDrawdownUsdt: 740.2,
    avgTradeDuration: '4h 18m',
    avgProfitPerTradePct: 1.25,
  },
  equityCurve: [
    { date: 'Day 1', balance: 10000, profitUsdt: 0, drawdownPct: 0, benchmarkBtcBalance: 10000 },
    { date: 'Day 5', balance: 10420, profitUsdt: 420, drawdownPct: -0.4, benchmarkBtcBalance: 9850 },
    { date: 'Day 10', balance: 10890, profitUsdt: 890, drawdownPct: -0.8, benchmarkBtcBalance: 10120 },
    { date: 'Day 15', balance: 11240, profitUsdt: 1240, drawdownPct: -1.2, benchmarkBtcBalance: 9780 },
    { date: 'Day 20', balance: 11110, profitUsdt: 1110, drawdownPct: -2.3, benchmarkBtcBalance: 9640 },
    { date: 'Day 25', balance: 11750, profitUsdt: 1750, drawdownPct: -0.5, benchmarkBtcBalance: 10400 },
    { date: 'Day 30', balance: 12380, profitUsdt: 2380, drawdownPct: -0.2, benchmarkBtcBalance: 10800 },
    { date: 'Day 35', balance: 12100, profitUsdt: 2100, drawdownPct: -3.8, benchmarkBtcBalance: 10300 },
    { date: 'Day 40', balance: 12890, profitUsdt: 2890, drawdownPct: -0.4, benchmarkBtcBalance: 10950 },
    { date: 'Day 45', balance: 13420, profitUsdt: 3420, drawdownPct: -0.1, benchmarkBtcBalance: 11200 },
    { date: 'Day 50', balance: 13980, profitUsdt: 3980, drawdownPct: -0.3, benchmarkBtcBalance: 11600 },
    { date: 'Day 55', balance: 14350, profitUsdt: 4350, drawdownPct: -1.1, benchmarkBtcBalance: 11450 },
    { date: 'Day 60', balance: 14820.5, profitUsdt: 4820.5, drawdownPct: -0.2, benchmarkBtcBalance: 11900 },
  ],
  monthlyReturns: [
    { year: 2025, month: 'Jan', profitPct: 14.8, trades: 132 },
    { year: 2025, month: 'Feb', profitPct: 18.2, trades: 146 },
    { year: 2025, month: 'Mar', profitPct: 15.21, trades: 106 },
  ],
  exitReasons: [
    { reason: 'roi', count: 184, profitUsdt: 2944.0, pct: 47.9 },
    { reason: 'trailing_stop_loss', count: 96, profitUsdt: 2112.0, pct: 25.0 },
    { reason: 'exit_signal', count: 42, profitUsdt: 672.0, pct: 10.9 },
    { reason: 'stop_loss', count: 52, profitUsdt: -880.0, pct: 13.5 },
    { reason: 'custom_exit', count: 10, profitUsdt: -27.5, pct: 2.7 },
  ],
  pairPerformance: [
    { pair: 'SOL/USDT', trades: 78, wins: 64, winRate: 82.1, totalProfitUsdt: 1420.5, totalProfitPct: 14.2, avgProfitPct: 1.82, avgDuration: '3h 45m' },
    { pair: 'BTC/USDT', trades: 84, wins: 68, winRate: 80.9, totalProfitUsdt: 1140.0, totalProfitPct: 11.4, avgProfitPct: 1.35, avgDuration: '5h 10m' },
    { pair: 'SUI/USDT', trades: 56, wins: 46, winRate: 82.1, totalProfitUsdt: 980.2, totalProfitPct: 9.8, avgProfitPct: 1.75, avgDuration: '3h 12m' },
    { pair: 'NEAR/USDT', trades: 62, wins: 48, winRate: 77.4, totalProfitUsdt: 740.8, totalProfitPct: 7.4, avgProfitPct: 1.19, avgDuration: '4h 05m' },
    { pair: 'ETH/USDT', trades: 64, wins: 44, winRate: 68.7, totalProfitUsdt: 420.0, totalProfitPct: 4.2, avgProfitPct: 0.65, avgDuration: '6h 30m' },
    { pair: 'DOGE/USDT', trades: 40, wins: 28, winRate: 70.0, totalProfitUsdt: 119.0, totalProfitPct: 1.19, avgProfitPct: 0.29, avgDuration: '2h 50m' },
  ],
};

export const INITIAL_HYPEROPT_EPOCHS: HyperOptEpoch[] = [
  {
    epoch: 84,
    loss: -2.842,
    totalProfitPct: 52.4,
    totalProfitUsdt: 5240,
    trades: 392,
    winRatePct: 79.2,
    drawdownPct: 5.1,
    sharpe: 2.84,
    params: {
      roi_0: 0.082,
      roi_20: 0.041,
      roi_60: 0.019,
      stoploss: -0.065,
      trailing_stop_positive: 0.015,
      trailing_stop_positive_offset: 0.028,
      rsi_buy_threshold: 31,
      rsi_sell_threshold: 74,
      ema_fast: 18,
      ema_slow: 48,
    },
    isBest: true,
  },
  {
    epoch: 71,
    loss: -2.618,
    totalProfitPct: 48.1,
    totalProfitUsdt: 4810,
    trades: 364,
    winRatePct: 77.5,
    drawdownPct: 5.8,
    sharpe: 2.62,
    params: {
      roi_0: 0.075,
      roi_20: 0.038,
      roi_60: 0.018,
      stoploss: -0.07,
      trailing_stop_positive: 0.018,
      trailing_stop_positive_offset: 0.032,
      rsi_buy_threshold: 33,
      rsi_sell_threshold: 72,
      ema_fast: 20,
      ema_slow: 50,
    },
  },
  {
    epoch: 55,
    loss: -2.315,
    totalProfitPct: 42.6,
    totalProfitUsdt: 4260,
    trades: 330,
    winRatePct: 75.1,
    drawdownPct: 6.4,
    sharpe: 2.31,
    params: {
      roi_0: 0.065,
      roi_20: 0.032,
      roi_60: 0.015,
      stoploss: -0.08,
      trailing_stop_positive: 0.02,
      trailing_stop_positive_offset: 0.035,
      rsi_buy_threshold: 28,
      rsi_sell_threshold: 70,
      ema_fast: 22,
      ema_slow: 55,
    },
  },
  {
    epoch: 32,
    loss: -1.984,
    totalProfitPct: 36.2,
    totalProfitUsdt: 3620,
    trades: 310,
    winRatePct: 72.4,
    drawdownPct: 7.8,
    sharpe: 1.98,
    params: {
      roi_0: 0.05,
      roi_20: 0.028,
      roi_60: 0.012,
      stoploss: -0.09,
      trailing_stop_positive: 0.022,
      trailing_stop_positive_offset: 0.04,
      rsi_buy_threshold: 35,
      rsi_sell_threshold: 68,
      ema_fast: 24,
      ema_slow: 60,
    },
  },
  {
    epoch: 12,
    loss: -1.412,
    totalProfitPct: 24.8,
    totalProfitUsdt: 2480,
    trades: 280,
    winRatePct: 68.2,
    drawdownPct: 9.2,
    sharpe: 1.41,
    params: {
      roi_0: 0.04,
      roi_20: 0.02,
      roi_60: 0.01,
      stoploss: -0.10,
      trailing_stop_positive: 0.025,
      trailing_stop_positive_offset: 0.045,
      rsi_buy_threshold: 30,
      rsi_sell_threshold: 65,
      ema_fast: 26,
      ema_slow: 65,
    },
  },
];

export const STRATEGY_CATALOG: StrategyCatalogItem[] = [
  {
    id: 'tape_reading_strategy',
    name: 'TapeReadingStrategy',
    description: 'Estratégia de alta assertividade institucional baseada nas 8 métricas de Tape Reading & Orderflow nativo do Freqtrade (CVD, Imbalance, Absorção, VWAP, MFI, OFI, Volume Profile e VWRSI).',
    timeframe: '5m',
    author: 'Freqtrade Dev + Tape Reading Core',
    rating: 5.0,
    tags: ['Tape Reading', 'Order Flow', 'CVD', 'Absorption', 'OFI', 'High Assertiveness'],
    usesFreqAI: false,
    code: `"""
TapeReadingStrategy - High Assertiveness Order Flow & Tape Reading Strategy
Built for Freqtrade 2025+ with Native Orderflow Support (develop branch)
8 Tape Reading Pillars: CVD, Bid/Ask Imbalance, Absorption, VWAP Deviation, MFI, OFI, Volume Profile, VWRSI
"""
from freqtrade.strategy import IStrategy, DecimalParameter, IntParameter, BooleanParameter
from pandas import DataFrame
import talib.abstract as ta
import freqtrade.vendor.qtpylib.indicators as qtpylib
import numpy as np

class TapeReadingStrategy(IStrategy):
    # Strategy interface version
    INTERFACE_VERSION = 3

    timeframe = '5m'
    informative_timeframe = '1h'
    can_short = False

    # Minimal ROI decrescente para rápida realização de lucros: 3% -> 2% -> 1% -> 0.5%
    minimal_roi = {
        "0": 0.030,
        "15": 0.020,
        "40": 0.010,
        "90": 0.005
    }

    # Stop-loss institucional rigoroso de 2.5% com trailing stop de 1%
    stoploss = -0.025
    trailing_stop = True
    trailing_stop_positive = 0.010
    trailing_stop_positive_offset = 0.018
    trailing_only_offset_is_reached = True

    process_only_new_candles = True
    use_exit_signal = True
    exit_profit_only = False
    ignore_roi_if_entry_signal = False

    # Hyperoptable Tape Reading parameters
    buy_imbalance_threshold = DecimalParameter(0.2, 0.8, default=0.5, space='buy')
    buy_mfi_threshold = IntParameter(20, 35, default=30, space='buy')
    buy_rsi_threshold = IntParameter(25, 40, default=35, space='buy')
    buy_vwap_dev_min = DecimalParameter(-0.04, -0.01, default=-0.02, space='buy')
    buy_vol_factor = DecimalParameter(1.2, 2.0, default=1.5, space='buy')

    sell_imbalance_threshold = DecimalParameter(-0.8, -0.2, default=-0.5, space='sell')
    sell_mfi_threshold = IntParameter(65, 85, default=70, space='sell')
    sell_vwap_dev_max = DecimalParameter(0.01, 0.04, default=0.02, space='sell')

    def informative_pairs(self):
        pairs = self.dp.current_whitelist()
        return [(pair, self.informative_timeframe) for pair in pairs]

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # 1. Indicadores Base Tradicionais
        dataframe['rsi'] = ta.RSI(dataframe, timeperiod=14)
        dataframe['ema_fast'] = ta.EMA(dataframe, timeperiod=20)
        dataframe['ema_slow'] = ta.EMA(dataframe, timeperiod=50)
        dataframe['adx'] = ta.ADX(dataframe, timeperiod=14)
        dataframe['vol_ma20'] = ta.SMA(dataframe['volume'], timeperiod=20)

        # 2. VWAP & Desvio Padrão
        dataframe['vwap'] = qtpylib.rolling_vwap(dataframe, window=48)
        dataframe['vwap_dev'] = (dataframe['close'] - dataframe['vwap']) / dataframe['vwap']

        # 3. MFI (Money Flow Index - RSI com volume real integrado)
        dataframe['mfi'] = ta.MFI(dataframe, timeperiod=14)

        # 4. Volume Delta & Cumulative Volume Delta (CVD)
        # Se orderflow nativo estiver ativo, usamos os trades públicos
        if 'orderflow' in dataframe.columns:
            dataframe['volume_delta'] = dataframe['orderflow']['bid_ask_delta']
            dataframe['cvd'] = dataframe['volume_delta'].cumsum()
            dataframe['imbalance_ratio'] = dataframe['orderflow']['imbalance_ratio']
        else:
            # Aproximação quantitativa precisa baseada em tick rule e candle wicks
            vol_delta_approx = np.where(
                dataframe['close'] >= dataframe['open'],
                dataframe['volume'] * ((dataframe['close'] - dataframe['low']) / (dataframe['high'] - dataframe['low'] + 1e-9)),
                -dataframe['volume'] * ((dataframe['high'] - dataframe['close']) / (dataframe['high'] - dataframe['low'] + 1e-9))
            )
            dataframe['volume_delta'] = vol_delta_approx
            dataframe['cvd'] = dataframe['volume_delta'].cumsum()
            dataframe['imbalance_ratio'] = np.clip(vol_delta_approx / (dataframe['volume'] + 1e-9), -1.0, 1.0)

        # 5. OFI (Order Flow Imbalance - Agressão de Mercado)
        dataframe['ofi'] = dataframe['volume_delta'] - dataframe['volume_delta'].shift(1).fillna(0)

        # 6. Detecção de Absorção (Grande volume sem movimento direcional de baixa)
        dataframe['absorption_bottom'] = (
            (dataframe['volume'] > dataframe['vol_ma20'] * 1.4) &
            (dataframe['close'] >= dataframe['open']) &
            (dataframe['low'] <= dataframe['low'].shift(1)) &
            (dataframe['volume_delta'] > 0)
        )
        dataframe['absorption_top'] = (
            (dataframe['volume'] > dataframe['vol_ma20'] * 1.4) &
            (dataframe['close'] <= dataframe['open']) &
            (dataframe['high'] >= dataframe['high'].shift(1)) &
            (dataframe['volume_delta'] < 0)
        )

        # 7. Volume Profile & Níveis de Suporte/Resistência (Percentil de Preço no Range de Volume)
        rolling_high = dataframe['high'].rolling(48).max()
        rolling_low = dataframe['low'].rolling(48).min()
        dataframe['vp_level'] = (dataframe['close'] - rolling_low) / (rolling_high - rolling_low + 1e-9)

        # 8. Volume Weighted RSI (VWRSI)
        dataframe['vwrsi'] = ta.RSI(dataframe['close'] * (dataframe['volume'] / dataframe['vol_ma20'].clip(lower=1)), timeperiod=14)

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # Condição A+ (Confluência Total de 8 Métricas de Tape Reading)
        cond_a_plus = (
            (dataframe['rsi'] < self.buy_rsi_threshold.value) &
            (dataframe['volume_delta'] > 0) &
            (dataframe['imbalance_ratio'] > self.buy_imbalance_threshold.value) &
            (dataframe['absorption_bottom'] == True) &
            (dataframe['ofi'] > 0) &
            (dataframe['mfi'] < self.buy_mfi_threshold.value) &
            (dataframe['vwap_dev'] < self.buy_vwap_dev_min.value) &
            (dataframe['volume'] > dataframe['vol_ma20'] * self.buy_vol_factor.value)
        )

        # Condição de Absorção Institucional na Base
        cond_absorption = (
            (dataframe['absorption_bottom'] == True) &
            (dataframe['cvd'] > dataframe['cvd'].shift(1)) &
            (dataframe['mfi'] < 35) &
            (dataframe['adx'] > 20)
        )

        # Condição OFI + EMA (Fluxo de Ordens Agressivo com médias)
        cond_ofi_ema = (
            (dataframe['ofi'] > 0) &
            (dataframe['volume_delta'] > 0) &
            (dataframe['close'] > dataframe['ema_fast']) &
            (dataframe['ema_fast'] > dataframe['ema_slow']) &
            (dataframe['imbalance_ratio'] > 0.3)
        )

        # Condição Volume Profile (Suporte com confirmação de Delta)
        cond_vp_support = (
            (dataframe['vp_level'] < 0.25) &
            (dataframe['volume_delta'] > 0) &
            (dataframe['vwrsi'] < 35) &
            (dataframe['volume'] > dataframe['vol_ma20'])
        )

        # Aplica gatilhos de entrada com volume positivo
        dataframe.loc[
            (cond_a_plus | cond_absorption | cond_ofi_ema | cond_vp_support) &
            (dataframe['volume'] > 0),
            'enter_long'
        ] = 1

        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # 1. Exhaustion Delta (Delta vira fortemente negativo no topo)
        exit_exhaustion = (
            (dataframe['volume_delta'] < 0) &
            (dataframe['imbalance_ratio'] < self.sell_imbalance_threshold.value) &
            (dataframe['rsi'] > 70)
        )

        # 2. Absorção no Topo (Distribuição de Smart Money)
        exit_absorption = (
            (dataframe['absorption_top'] == True) &
            (dataframe['mfi'] > self.sell_mfi_threshold.value)
        )

        # 3. Desvio Excessivo de VWAP (Overbought > +2%)
        exit_vwap_overbought = (
            (dataframe['vwap_dev'] > self.sell_vwap_dev_max.value) &
            (dataframe['vwrsi'] > 65)
        )

        # 4. Zona de Resistência do Volume Profile (> 0.85) com reversão de OFI
        exit_vp_resistance = (
            (dataframe['vp_level'] > 0.85) &
            (dataframe['ofi'] < 0)
        )

        dataframe.loc[
            (exit_exhaustion | exit_absorption | exit_vwap_overbought | exit_vp_resistance) &
            (dataframe['volume'] > 0),
            'exit_long'
        ] = 1

        return dataframe
`,
  },
  {
    id: 'nfi_freqai',
    name: 'NostalgiaForInfinityX_FreqAI',
    description: 'High-frequency multi-indicator strategy combining 20+ sub-signals with FreqAI adaptive LightGBM ML predictions.',
    timeframe: '5m',
    author: 'iterativ + Freqtrade Team',
    rating: 4.9,
    tags: ['FreqAI', 'Multi-Indicator', 'Adaptive', 'High-Winrate'],
    usesFreqAI: true,
    code: `"""
NostalgiaForInfinityX_FreqAI Strategy for Freqtrade
Author: iterativ / Freqtrade Community
"""
from freqtrade.strategy import IStrategy, DecimalParameter, IntParameter, BooleanParameter
from pandas import DataFrame
import talib.abstract as ta
import freqtrade.vendor.qtpylib.indicators as qtpylib
import numpy as np

class NostalgiaForInfinityX_FreqAI(IStrategy):
    # Strategy interface version - built for Freqtrade 2025+
    INTERFACE_VERSION = 3

    timeframe = '5m'
    can_short = False

    # Minimal ROI designed for quick compounding
    minimal_roi = {
        "0": 0.082,
        "20": 0.041,
        "60": 0.019,
        "120": 0.008
    }

    stoploss = -0.065
    trailing_stop = True
    trailing_stop_positive = 0.015
    trailing_stop_positive_offset = 0.028
    trailing_only_offset_is_reached = True

    process_only_new_candles = True
    use_exit_signal = True
    exit_profit_only = False
    ignore_roi_if_entry_signal = False

    # Hyperoptable parameters
    buy_rsi_threshold = IntParameter(25, 45, default=32, space='buy')
    buy_bb_factor = DecimalParameter(0.97, 1.01, default=0.985, space='buy')
    freqai_target_min = DecimalParameter(1.5, 5.0, default=2.5, space='buy')

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # FreqAI feature generation hook
        if self.freqai_info:
            dataframe = self.freqai.start(dataframe, metadata, self)

        # Technical Indicators
        dataframe['rsi'] = ta.RSI(dataframe, timeperiod=14)
        dataframe['rsi_fast'] = ta.RSI(dataframe, timeperiod=7)
        dataframe['ema_20'] = ta.EMA(dataframe, timeperiod=20)
        dataframe['ema_50'] = ta.EMA(dataframe, timeperiod=50)
        dataframe['ema_200'] = ta.EMA(dataframe, timeperiod=200)

        # Bollinger Bands
        bollinger = qtpylib.bollinger_bands(qtpylib.typical_price(dataframe), window=20, stds=2)
        dataframe['bb_lowerband'] = bollinger['lower']
        dataframe['bb_middleband'] = bollinger['mid']
        dataframe['bb_upperband'] = bollinger['upper']

        # Volume mean
        dataframe['volume_mean_12'] = dataframe['volume'].rolling(12).mean()

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        conditions = []

        # Condition 1: Technical oversold with volume confirmation
        cond_tech = (
            (dataframe['rsi'] < self.buy_rsi_threshold.value) &
            (dataframe['close'] < dataframe['bb_lowerband'] * self.buy_bb_factor.value) &
            (dataframe['volume'] > dataframe['volume_mean_12'] * 1.2)
        )

        # Condition 2: FreqAI ML Target Prediction & Dissimilarity Index check
        if 'do_predict' in dataframe.columns and '&-s_close_target' in dataframe.columns:
            cond_freqai = (
                (dataframe['do_predict'] == 1) &
                (dataframe['&-s_close_target'] > self.freqai_target_min.value) &
                (dataframe['DI_values'] < 0.45) # Dissimilarity safe zone
            )
            conditions.append(cond_tech & cond_freqai)
        else:
            conditions.append(cond_tech)

        if conditions:
            dataframe.loc[
                np.logical_or.reduce(conditions),
                'enter_long'
            ] = 1

        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (dataframe['rsi'] > 78) &
                (dataframe['close'] > dataframe['bb_upperband']) &
                (dataframe['volume'] > 0)
            ),
            'exit_long'
        ] = 1
        return dataframe
`,
  },
  {
    id: 'freqai_regressor_v4',
    name: 'FreqAI_AdaptiveLightGBM',
    description: 'Pure Machine Learning strategy powered by LightGBM regressor predicting forward 5-candle price movement with automated DI outlier rejection.',
    timeframe: '5m',
    author: 'Freqtrade Dev Team',
    rating: 4.8,
    tags: ['Machine Learning', 'LightGBM', 'FreqAI', 'Regimes'],
    usesFreqAI: true,
    code: `"""
FreqAI_AdaptiveLightGBM
Designed specifically for FreqAI ML pipeline
"""
from freqtrade.strategy import IStrategy
from pandas import DataFrame
import talib.abstract as ta

class FreqAI_AdaptiveLightGBM(IStrategy):
    INTERFACE_VERSION = 3
    timeframe = '5m'
    can_short = False

    minimal_roi = {
        "0": 0.05,
        "30": 0.025,
        "90": 0.01
    }

    stoploss = -0.05
    trailing_stop = True
    trailing_stop_positive = 0.012

    def feature_engineering_expand_all(self, dataframe: DataFrame, period: int, metadata: dict, **kwargs) -> DataFrame:
        dataframe[f"%-rsi-period_{period}"] = ta.RSI(dataframe, timeperiod=period)
        dataframe[f"%-mfi-period_{period}"] = ta.MFI(dataframe, timeperiod=period)
        dataframe[f"%-ema-period_{period}"] = ta.EMA(dataframe, timeperiod=period)
        return dataframe

    def set_freqai_targets(self, dataframe: DataFrame, metadata: dict, **kwargs) -> DataFrame:
        # Target: % gain in next 12 candles (1 hour)
        dataframe["&-s_close_target"] = (
            dataframe["close"].shift(-12) - dataframe["close"]
        ) / dataframe["close"] * 100
        return dataframe

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe = self.freqai.start(dataframe, metadata, self)
        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (dataframe["do_predict"] == 1) &
                (dataframe["&-s_close_target"] > 2.0) & # Predicts >2% gain
                (dataframe["DI_values"] < 0.40) & # Not an anomaly regime
                (dataframe["volume"] > 0)
            ),
            "enter_long",
        ] = 1
        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (dataframe["do_predict"] == 1) &
                (dataframe["&-s_close_target"] < -1.0) & # Model predicts reversal
                (dataframe["volume"] > 0)
            ),
            "exit_long",
        ] = 1
        return dataframe
`,
  },
  {
    id: 'bband_rsi',
    name: 'BbandRsi_Scalper',
    description: 'Classic, highly reliable mean-reversion scalp strategy utilizing Bollinger Band compression and RSI divergences.',
    timeframe: '15m',
    author: 'Freqtrade Core',
    rating: 4.6,
    tags: ['Mean Reversion', 'Bollinger Bands', 'RSI', 'Low Risk'],
    usesFreqAI: false,
    code: `"""
BbandRsi_Scalper Strategy
Classic Mean Reversion for Freqtrade
"""
from freqtrade.strategy import IStrategy
from pandas import DataFrame
import talib.abstract as ta
import freqtrade.vendor.qtpylib.indicators as qtpylib

class BbandRsi_Scalper(IStrategy):
    INTERFACE_VERSION = 3
    timeframe = '15m'

    minimal_roi = {
        "0": 0.04,
        "30": 0.02,
        "60": 0.01
    }

    stoploss = -0.04
    trailing_stop = False

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe['rsi'] = ta.RSI(dataframe, timeperiod=14)
        bollinger = qtpylib.bollinger_bands(qtpylib.typical_price(dataframe), window=20, stds=2)
        dataframe['bb_lowerband'] = bollinger['lower']
        dataframe['bb_middleband'] = bollinger['mid']
        dataframe['bb_upperband'] = bollinger['upper']
        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (dataframe['rsi'] < 30) &
                (dataframe['close'] < dataframe['bb_lowerband']) &
                (dataframe['volume'] > 0)
            ),
            'enter_long'
        ] = 1
        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (dataframe['rsi'] > 70) &
                (dataframe['close'] > dataframe['bb_upperband']) &
                (dataframe['volume'] > 0)
            ),
            'exit_long'
        ] = 1
        return dataframe
`,
  },
];

export const INITIAL_LOG_ENTRIES: LogEntry[] = [
  { id: '1', timestamp: '12:54:12', level: 'INFO', module: 'freqtrade.worker', message: 'Freqtrade 2025.2-freqai process active. Heartbeat ok.' },
  { id: '2', timestamp: '12:54:15', level: 'FREQAI', module: 'freqtrade.freqai', message: 'Model LightGBMRegressor_5m_v4 loaded. DI threshold: 0.45, active features: 48.' },
  { id: '3', timestamp: '12:54:20', level: 'INFO', module: 'freqtrade.wallets', message: 'Dry-run balance synced: 12,450.80 USDT (Available: 8,200.80 USDT).' },
  { id: '4', timestamp: '12:54:25', level: 'INFO', module: 'freqtrade.pairlist', message: 'VolumePairList updated 10 pairs. Whitelist: BTC/USDT, ETH/USDT, SOL/USDT, NEAR/USDT, SUI/USDT...' },
  { id: '5', timestamp: '12:55:02', level: 'FREQAI', module: 'freqtrade.freqai', message: 'Inference for SUI/USDT: Predicted Gain +9.80% (DI: 0.19 <= 0.45). Signal: VALID STRONG BUY' },
  { id: '6', timestamp: '12:55:10', level: 'INFO', module: 'freqtrade.strategy', message: 'Trade #424 entered for SUI/USDT @ 3.20 USDT. Stake: 1050 USDT. Stoploss: -2.87% (3.10 USDT).' },
  { id: '7', timestamp: '12:55:40', level: 'INFO', module: 'freqtrade.exchange', message: 'Exchange WebSocket ping: 18ms (Binance API healthy).' },
  { id: '8', timestamp: '12:56:05', level: 'FREQAI', module: 'freqtrade.freqai', message: 'Adaptive background trainer scheduled next retraining in 3h 42m.' },
];
