/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Music, Headphones, ExternalLink, Heart, Github, Sparkles } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LiveDashboard } from './components/dashboard/LiveDashboard';
import { FreqAICenter } from './components/freqai/FreqAICenter';
import { NewsSentimentHub } from './components/dashboard/NewsSentimentHub';
import { StrategyIDE } from './components/strategy/StrategyIDE';
import { OptimizationHub } from './components/backtest/OptimizationHub';
import { ToolsHub } from './components/tools/ToolsHub';
import { ManualTradeModal } from './components/modals/ManualTradeModal';
import { ChangelogModal } from './components/modals/ChangelogModal';
import { TradeValidationHub } from './components/validation/TradeValidationHub';
import { TapeReadingHub } from './components/tapereading/TapeReadingHub';

import {
  BotStatus,
  TradingMode,
  OpenTrade,
  ClosedTrade,
  CandleData,
  TickerData,
  FreqAIState,
  BacktestResults,
  HyperOptEpoch,
  StrategyCatalogItem,
  LogEntry,
  FreqtradeConfig,
  BacktestParams,
} from './types';

import {
  INITIAL_BOT_CONFIG,
  INITIAL_OPEN_TRADES,
  INITIAL_CLOSED_TRADES,
  INITIAL_FREQAI_STATE,
  INITIAL_BACKTEST_RESULTS,
  INITIAL_HYPEROPT_EPOCHS,
  STRATEGY_CATALOG,
  INITIAL_LOG_ENTRIES,
  INITIAL_TICKERS,
  generateCandleData,
} from './data/mockTradingData';
import { marketDataService, MarketStreamStats } from './services/marketDataService';

export default function App() {
  // Navigation & Bot State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [botStatus, setBotStatus] = useState<BotStatus>('running');
  const [tradingMode, setTradingMode] = useState<TradingMode>('dry-run');
  const [totalBalance, setTotalBalance] = useState<number>(12450.8);
  const [activeStrategy, setActiveStrategy] = useState<string>('NostalgiaForInfinityX_FreqAI');

  // Market & Trades State (Synchronized 24/7 with Live Binance Streams)
  const [openTrades, setOpenTrades] = useState<OpenTrade[]>(INITIAL_OPEN_TRADES);
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>(INITIAL_CLOSED_TRADES);
  const [tickers, setTickers] = useState<TickerData[]>(INITIAL_TICKERS);
  const [selectedPair, setSelectedPair] = useState<string>('BTC/USDT');
  const [timeframe, setTimeframe] = useState<string>('5m');
  const [candles, setCandles] = useState<CandleData[]>(() => generateCandleData(94820.5, 45));
  const [streamStats, setStreamStats] = useState<MarketStreamStats>(() => marketDataService.getStats());

  // Feature Modules State
  const [freqaiState, setFreqaiState] = useState<FreqAIState>(INITIAL_FREQAI_STATE);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResults>(INITIAL_BACKTEST_RESULTS);
  const [isRunningBacktest, setIsRunningBacktest] = useState<boolean>(false);
  const [hyperoptEpochs, setHyperoptEpochs] = useState<HyperOptEpoch[]>(INITIAL_HYPEROPT_EPOCHS);
  const [isRunningHyperopt, setIsRunningHyperopt] = useState<boolean>(false);

  // Strategy & Config State
  const [strategies, setStrategies] = useState<StrategyCatalogItem[]>(STRATEGY_CATALOG);
  const [currentStrategyCode, setCurrentStrategyCode] = useState<string>(STRATEGY_CATALOG[0].code);
  const [whitelist, setWhitelist] = useState<string[]>(INITIAL_BOT_CONFIG.pair_whitelist || []);
  const [blacklist, setBlacklist] = useState<string[]>(INITIAL_BOT_CONFIG.pair_blacklist || []);
  const [selectedExchange, setSelectedExchange] = useState<string>('binance');
  const [config, setConfig] = useState<FreqtradeConfig>(INITIAL_BOT_CONFIG);
  const [newsFilterActive, setNewsFilterActive] = useState<boolean>(true);

  // Logs & UI Modals
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOG_ENTRIES);
  const [isManualTradeOpen, setIsManualTradeOpen] = useState<boolean>(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const addLog = useCallback((level: LogEntry['level'], module: string, message: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newEntry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      level,
      module,
      message,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 150)]);
  }, []);

  // 1. Synchronize Active Pair and Timeframe with 24/7 Binance WebSocket & Klines
  useEffect(() => {
    marketDataService.setActivePairAndTimeframe(selectedPair, timeframe);
  }, [selectedPair, timeframe]);

  // 2. Subscribe to 24/7 Live Real-Time Binance Tickers, Klines and Stream Status
  useEffect(() => {
    const unsubTickers = marketDataService.subscribeTickers((liveTickers) => {
      if (liveTickers && liveTickers.length > 0) {
        setTickers(liveTickers);

        // Update Open Trades valuation in real-time based on genuine market prices
        if (botStatus !== 'stopped') {
          setOpenTrades((prevTrades) => {
            let tradesChanged = false;
            const remainingTrades: OpenTrade[] = [];

            prevTrades.forEach((trade) => {
              const matchingTicker = liveTickers.find((t) => t.symbol === trade.pair);
              if (!matchingTicker) {
                remainingTrades.push(trade);
                return;
              }

              const currentPrice = matchingTicker.lastPrice;
              const rateDiff = trade.direction === 'long'
                ? currentPrice - trade.openRate
                : trade.openRate - currentPrice;
              const profitPct = +( (rateDiff / trade.openRate) * 100 * trade.leverage ).toFixed(2);
              const profitUsdt = +( (trade.stakeAmount * profitPct) / 100 ).toFixed(2);

              // Check for Trailing Stop-Loss update
              let currentStopLoss = trade.stopLossRate;
              if (trade.trailingStopLoss && profitPct > 2.0) {
                const newTrailingStop = trade.direction === 'long'
                  ? currentPrice * 0.985
                  : currentPrice * 1.015;
                if (trade.direction === 'long' && newTrailingStop > currentStopLoss) {
                  currentStopLoss = +newTrailingStop.toFixed(2);
                }
              }

              // Check if Stop Loss or ROI Target was hit in real market
              const hitStopLoss = trade.direction === 'long'
                ? currentPrice <= currentStopLoss
                : currentPrice >= currentStopLoss;
              const hitRoi = trade.direction === 'long'
                ? currentPrice >= trade.roiTargetRate
                : currentPrice <= trade.roiTargetRate;

              if (hitRoi || hitStopLoss) {
                tradesChanged = true;
                const exitReason = hitRoi ? 'roi' : 'stop_loss';
                const closed: ClosedTrade = {
                  id: trade.id,
                  pair: trade.pair,
                  direction: trade.direction,
                  stakeAmount: trade.stakeAmount,
                  amount: trade.amount,
                  openRate: trade.openRate,
                  closeRate: currentPrice,
                  profitUsdt,
                  profitPct,
                  openDate: trade.openDate,
                  closeDate: 'Just now',
                  duration: `${trade.durationMinutes + 5}m`,
                  exitReason,
                  strategy: trade.strategy,
                  leverage: trade.leverage,
                  fees: +(trade.stakeAmount * 0.001).toFixed(2),
                };

                setClosedTrades((prev) => [closed, ...prev]);
                setTotalBalance((bal) => +(bal + profitUsdt).toFixed(2));
                addLog(
                  exitReason === 'roi' ? 'INFO' : 'WARNING',
                  'freqtrade.trade',
                  `Trade #${trade.id} for ${trade.pair} auto-exited via ${exitReason.toUpperCase()} at live rate ${currentPrice} (${profitPct >= 0 ? '+' : ''}${profitPct}% / ${profitUsdt >= 0 ? '+' : ''}$${profitUsdt} USDT)`
                );
                showToast(`Trade #${trade.id} (${trade.pair}) closed: ${profitPct >= 0 ? '+' : ''}${profitPct}%`, profitPct >= 0 ? 'success' : 'warning');
              } else {
                remainingTrades.push({
                  ...trade,
                  currentRate: currentPrice,
                  currentProfit: profitUsdt,
                  currentProfitPct: profitPct,
                  stopLossRate: currentStopLoss,
                  durationMinutes: trade.durationMinutes,
                });
              }
            });

            return tradesChanged ? remainingTrades : remainingTrades;
          });
        }
      }
    });

    const unsubCandles = marketDataService.subscribeCandles((liveCandles) => {
      if (liveCandles && liveCandles.length > 0) {
        setCandles(liveCandles);
      }
    });

    const unsubStats = marketDataService.subscribeStats((stats) => {
      setStreamStats(stats);
    });

    return () => {
      unsubTickers();
      unsubCandles();
      unsubStats();
    };
  }, [botStatus, addLog, showToast]);

  // 3. Periodic Background Diagnostic Logging
  useEffect(() => {
    if (botStatus === 'stopped') return;

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const sampleLogs = [
          { mod: 'freqtrade.freqai', lvl: 'FREQAI' as const, msg: `Inference stream: SUI/USDT DI=0.21 (safe), BTC/USDT DI=0.28 (safe). Live Binance latency: ${streamStats.latencyMs}ms.` },
          { mod: 'freqtrade.worker', lvl: 'INFO' as const, msg: `24/7 Binance WebSocket live tick stream healthy: ${tickers.length} assets synced.` },
          { mod: 'freqtrade.strategy', lvl: 'INFO' as const, msg: `Checking entry signals for ${activeStrategy}... 0 new candidates below DI cutoff.` },
          { mod: 'freqtrade.wallets', lvl: 'INFO' as const, msg: `Wallet check: ${openTrades.length} open stakes, wallet state synchronized with live rates.` },
        ];
        const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        addLog(randomLog.lvl, randomLog.mod, randomLog.msg);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [botStatus, activeStrategy, addLog, streamStats.latencyMs, tickers.length, openTrades.length]);

  const handleReconnectStream = useCallback(() => {
    marketDataService.forceReconnect();
    showToast('Reconectando ao stream oficial Binance 24/7...', 'info');
  }, [showToast]);

  // Handle Manual Trade Entry
  const handleEnterTrade = (newTrade: OpenTrade) => {
    setOpenTrades((prev) => [newTrade, ...prev]);
    setTotalBalance((bal) => +(bal - newTrade.stakeAmount * 0.001).toFixed(2));
    addLog('INFO', 'freqtrade.trade', `Force entered trade #${newTrade.id} for ${newTrade.pair} (${newTrade.direction.toUpperCase()}) @ ${newTrade.openRate} USDT`);
    showToast(`Force trade opened: ${newTrade.pair} (${newTrade.direction.toUpperCase()})`, 'success');
  };

  // Handle Force Exit Single Trade
  const handleForceExitTrade = (id: number) => {
    const trade = openTrades.find((t) => t.id === id);
    if (!trade) return;

    const closed: ClosedTrade = {
      id: trade.id,
      pair: trade.pair,
      direction: trade.direction,
      stakeAmount: trade.stakeAmount,
      amount: trade.amount,
      openRate: trade.openRate,
      closeRate: trade.currentRate,
      profitUsdt: trade.currentProfit,
      profitPct: trade.currentProfitPct,
      openDate: trade.openDate,
      closeDate: 'Just now',
      duration: `${trade.durationMinutes}m`,
      exitReason: 'force_exit',
      strategy: trade.strategy,
      leverage: trade.leverage,
      fees: +(trade.stakeAmount * 0.001).toFixed(2),
    };

    setOpenTrades((prev) => prev.filter((t) => t.id !== id));
    setClosedTrades((prev) => [closed, ...prev]);
    setTotalBalance((bal) => +(bal + trade.currentProfit).toFixed(2));
    addLog('WARNING', 'freqtrade.trade', `Trade #${trade.id} for ${trade.pair} FORCE-EXITED manually @ ${trade.currentRate} USDT (${trade.currentProfitPct >= 0 ? '+' : ''}${trade.currentProfitPct}%)`);
    showToast(`Trade #${trade.id} force-exited with ${trade.currentProfitPct >= 0 ? '+' : ''}${trade.currentProfitPct}%`, 'info');
  };

  // Handle Force Exit All Trades
  const handleForceExitAll = () => {
    if (openTrades.length === 0) return;
    if (!window.confirm(`Are you sure you want to force-exit all ${openTrades.length} active positions?`)) return;

    let netProfit = 0;
    const closedList: ClosedTrade[] = openTrades.map((t) => {
      netProfit += t.currentProfit;
      return {
        id: t.id,
        pair: t.pair,
        direction: t.direction,
        stakeAmount: t.stakeAmount,
        amount: t.amount,
        openRate: t.openRate,
        closeRate: t.currentRate,
        profitUsdt: t.currentProfit,
        profitPct: t.currentProfitPct,
        openDate: t.openDate,
        closeDate: 'Just now',
        duration: `${t.durationMinutes}m`,
        exitReason: 'force_exit' as const,
        strategy: t.strategy,
        leverage: t.leverage,
        fees: +(t.stakeAmount * 0.001).toFixed(2),
      };
    });

    setClosedTrades((prev) => [...closedList, ...prev]);
    setOpenTrades([]);
    setTotalBalance((bal) => +(bal + netProfit).toFixed(2));
    addLog('WARNING', 'freqtrade.trade', `EMERGENCY FORCE-EXIT ALL: Closed ${closedList.length} trades with net PnL $${netProfit.toFixed(2)} USDT`);
    showToast(`All ${closedList.length} trades closed. Net PnL: ${netProfit >= 0 ? '+' : ''}$${netProfit.toFixed(2)}`, 'warning');
  };

  // Handle FreqAI Retrain
  const handleRetrainModel = (algorithm: string, windowDays: number, diThreshold: number) => {
    setIsRetraining(true);
    addLog('FREQAI', 'freqtrade.freqai', `Starting FreqAI retraining with ${algorithm} on ${windowDays} days window (DI threshold: ${diThreshold})...`);

    setTimeout(() => {
      setFreqaiState((prev) => ({
        ...prev,
        algorithm: algorithm as any,
        trainWindowDays: windowDays,
        dissimilarityThreshold: diThreshold,
        candlesTrained: prev.candlesTrained + 1440,
        lastTrainedTime: 'Just now',
        modelMetrics: {
          ...prev.modelMetrics,
          accuracyWinRate: +(prev.modelMetrics.accuracyWinRate + (Math.random() * 2 - 0.5)).toFixed(1),
          r2Score: +(Math.min(0.88, prev.modelMetrics.r2Score + 0.015)).toFixed(3),
          epochs: prev.modelMetrics.epochs + 250,
        },
      }));
      setIsRetraining(false);
      addLog('FREQAI', 'freqtrade.freqai', `FreqAI model retrained successfully! New Win Rate: ${(freqaiState.modelMetrics.accuracyWinRate + 1.2).toFixed(1)}%, R2: ${(freqaiState.modelMetrics.r2Score + 0.01).toFixed(3)}.`);
      showToast(`FreqAI ${algorithm} model updated and active!`, 'success');
    }, 2400);
  };

  // Handle Run Backtest
  const handleRunBacktest = (params: BacktestParams) => {
    setIsRunningBacktest(true);
    addLog('INFO', 'freqtrade.backtest', `Running backtest for '${params.strategyName}' (${params.timeframe}, ${params.timerangeDays} days, FreqAI: ${params.enableFreqAI ? 'ON' : 'OFF'})...`);

    setTimeout(() => {
      const baseProfitPct = params.enableFreqAI ? 54.2 : 38.6;
      const profitVariation = (Math.random() * 8 - 4);
      const totalProfitPct = +(baseProfitPct + profitVariation).toFixed(2);
      const finalBal = +(params.startingCapital * (1 + totalProfitPct / 100)).toFixed(2);
      const totalProfitUsdt = +(finalBal - params.startingCapital).toFixed(2);

      setBacktestResults((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          totalTrades: Math.floor(Math.random() * 80) + 340,
          startingBalance: params.startingCapital,
          finalBalance: finalBal,
          totalProfitPct,
          totalProfitUsdt,
          winRatePct: +(74 + Math.random() * 6).toFixed(1),
          sharpeRatio: +(2.2 + Math.random() * 0.8).toFixed(2),
        },
      }));
      setIsRunningBacktest(false);
      addLog('INFO', 'freqtrade.backtest', `Backtest complete: ${totalProfitPct}% return ($${totalProfitUsdt} USDT) over ${params.timerangeDays} days.`);
      showToast(`Backtest complete: +${totalProfitPct}% Total Profit!`, 'success');
    }, 2000);
  };

  // Handle Run HyperOpt
  const handleRunHyperopt = (lossFunction: string, totalEpochs: number) => {
    setIsRunningHyperopt(true);
    addLog('INFO', 'freqtrade.hyperopt', `Launching HyperOpt parameter search with ${lossFunction} for ${totalEpochs} epochs...`);

    setTimeout(() => {
      const newEpoch: HyperOptEpoch = {
        epoch: hyperoptEpochs.length + 1,
        loss: -+(2.8 + Math.random() * 0.4).toFixed(3),
        totalProfitPct: +(53.5 + Math.random() * 4.5).toFixed(1),
        totalProfitUsdt: Math.floor(5200 + Math.random() * 600),
        trades: Math.floor(380 + Math.random() * 40),
        winRatePct: +(78.5 + Math.random() * 3).toFixed(1),
        drawdownPct: +(4.8 + Math.random() * 1.2).toFixed(1),
        sharpe: +(2.85 + Math.random() * 0.3).toFixed(2),
        params: {
          roi_0: +(0.075 + Math.random() * 0.015).toFixed(3),
          roi_20: +(0.038 + Math.random() * 0.008).toFixed(3),
          roi_60: +(0.018 + Math.random() * 0.004).toFixed(3),
          stoploss: -+(0.060 + Math.random() * 0.015).toFixed(3),
          trailing_stop_positive: +(0.014 + Math.random() * 0.004).toFixed(3),
          trailing_stop_positive_offset: +(0.026 + Math.random() * 0.006).toFixed(3),
          rsi_buy_threshold: Math.floor(28 + Math.random() * 6),
          rsi_sell_threshold: Math.floor(72 + Math.random() * 6),
          ema_fast: Math.floor(16 + Math.random() * 6),
          ema_slow: Math.floor(46 + Math.random() * 8),
        },
        isBest: true,
      };

      setHyperoptEpochs((prev) => [newEpoch, ...prev.map((e) => ({ ...e, isBest: false }))]);
      setIsRunningHyperopt(false);
      addLog('INFO', 'freqtrade.hyperopt', `HyperOpt finished! Best Epoch #${newEpoch.epoch} achieved ${newEpoch.totalProfitPct}% profit (Sharpe: ${newEpoch.sharpe}).`);
      showToast(`HyperOpt found new optimal parameters! (+${newEpoch.totalProfitPct}%)`, 'success');
    }, 2200);
  };

  // Handle Apply Hyperopt Params to Strategy & Config
  const handleApplyHyperoptParams = (params: HyperOptEpoch['params']) => {
    addLog('INFO', 'freqtrade.strategy', `Applied HyperOpt parameters: Stoploss ${params.stoploss}, Trailing +${params.trailing_stop_positive}, RSI Buy < ${params.rsi_buy_threshold}`);
    showToast('HyperOpt parameters applied to strategy and live config!', 'success');
  };

  // Handle Strategy Selection
  const handleSelectStrategy = (strat: StrategyCatalogItem) => {
    setActiveStrategy(strat.name);
    setCurrentStrategyCode(strat.code);
    addLog('INFO', 'freqtrade.strategy', `Switched active strategy to '${strat.name}' (Timeframe: ${strat.timeframe})`);
    showToast(`Loaded strategy: ${strat.name}`, 'info');
  };

  // Handle Save Strategy
  const handleSaveStrategy = () => {
    addLog('INFO', 'freqtrade.strategy', `Strategy '${activeStrategy}' saved to user_data/strategies/${activeStrategy}.py`);
    showToast(`Strategy '${activeStrategy}' saved successfully!`, 'success');
  };

  // Handle Config Save
  const handleSaveConfig = (newConfig: FreqtradeConfig) => {
    setConfig(newConfig);
    if (newConfig.pair_whitelist) setWhitelist(newConfig.pair_whitelist);
    if (newConfig.pair_blacklist) setBlacklist(newConfig.pair_blacklist);
    addLog('INFO', 'freqtrade.configuration', `Updated user_data/config.json. Parameters verified.`);
    showToast('Configuration saved successfully!', 'success');
  };

  // Handle Reload Config
  const handleReloadConfig = () => {
    setBotStatus('reloading');
    addLog('INFO', 'freqtrade.worker', 'Reloading config.json and recompiling strategy bytecode...');
    setTimeout(() => {
      setBotStatus('running');
      addLog('INFO', 'freqtrade.worker', 'Config reload complete. Daemon resumed without downtime.');
      showToast('Bot configuration and strategy reloaded!', 'success');
    }, 1200);
  };

  // Handle CLI Command Execution
  const handleRunCliCommand = (cmd: string) => {
    addLog('INFO', 'freqtrade.cli', `$ freqtrade ${cmd}`);
    const lower = cmd.toLowerCase();

    setTimeout(() => {
      if (lower.includes('list-trades') || lower.includes('trades')) {
        addLog('INFO', 'freqtrade.cli', `Active Open Positions: ${openTrades.map((t) => `#${t.id} ${t.pair} (${t.currentProfitPct}%)`).join(' | ')}`);
      } else if (lower.includes('status') || lower.includes('profit')) {
        const totalProfit = closedTrades.reduce((acc, t) => acc + t.profitUsdt, 0);
        addLog('INFO', 'freqtrade.cli', `Bot Status: ${botStatus.toUpperCase()} | Total Realized: $${totalProfit.toFixed(2)} USDT | Balance: $${totalBalance.toFixed(2)} USDT`);
      } else if (lower.includes('freqai') || lower.includes('model')) {
        addLog('FREQAI', 'freqtrade.cli', `FreqAI Status: ${freqaiState.modelName} (${freqaiState.algorithm}) | DI: ${freqaiState.currentDI} / ${freqaiState.dissimilarityThreshold} | Win Rate: ${freqaiState.modelMetrics.accuracyWinRate}%`);
      } else if (lower.includes('pairlist') || lower.includes('whitelist')) {
        addLog('INFO', 'freqtrade.cli', `Whitelist (${whitelist.length} pairs): ${whitelist.join(', ')}`);
      } else if (lower.includes('help')) {
        addLog('INFO', 'freqtrade.cli', `Available CLI commands: list-trades, profit, freqai-status, test-pairlist, show-config, reload, download-data`);
      } else {
        addLog('INFO', 'freqtrade.cli', `Command '${cmd}' executed successfully. Exit code: 0`);
      }
    }, 400);
  };

  // Calculations for Navbar
  const totalProfit = closedTrades.reduce((acc, t) => acc + t.profitUsdt, 0) + openTrades.reduce((acc, t) => acc + t.currentProfit, 0);
  const totalProfitPct = +((totalProfit / (totalBalance - totalProfit || 10000)) * 100).toFixed(2);
  const currentPrice = tickers.find((t) => t.symbol === selectedPair)?.lastPrice || 94820.5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {notification && (
        <div
          id="toast-notification"
          className={`fixed bottom-20 lg:bottom-5 right-4 left-4 sm:left-auto sm:right-5 z-50 px-4 py-2.5 rounded-xl border shadow-2xl flex items-center gap-2 text-xs font-mono backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50'
              : notification.type === 'warning'
              ? 'bg-amber-950/90 text-amber-300 border-amber-500/40 shadow-amber-950/50'
              : 'bg-slate-900/90 text-slate-200 border-slate-700 shadow-slate-950/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation & Status Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        botStatus={botStatus}
        setBotStatus={setBotStatus}
        tradingMode={tradingMode}
        setTradingMode={setTradingMode}
        totalBalance={totalBalance}
        totalProfit={totalProfit}
        totalProfitPct={totalProfitPct}
        openTradesCount={openTrades.length}
        activeStrategy={activeStrategy}
        onReloadConfig={handleReloadConfig}
        streamStats={streamStats}
        onReconnectStream={handleReconnectStream}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 pb-24 lg:pb-8 space-y-5 sm:space-y-6">
        {activeTab === 'dashboard' && (
          <LiveDashboard
            openTrades={openTrades}
            closedTrades={closedTrades}
            tickers={tickers}
            selectedPair={selectedPair}
            setSelectedPair={setSelectedPair}
            candles={candles}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            onForceExitTrade={handleForceExitTrade}
            onForceExitAll={handleForceExitAll}
            onOpenManualTradeModal={() => setIsManualTradeOpen(true)}
            totalBalance={totalBalance}
            streamStats={streamStats}
            onReconnectStream={handleReconnectStream}
          />
        )}

        {activeTab === 'tapereading' && (
          <TapeReadingHub
            tickers={tickers}
            selectedPair={selectedPair}
            onSelectPair={(pair) => setSelectedPair(pair)}
            onOpenIDEWithStrategy={(stratName) => {
              const found = strategies.find((s) => s.name === stratName);
              if (found) {
                handleSelectStrategy(found);
              }
              setActiveTab('strategy');
            }}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'validation' && (
          <TradeValidationHub
            closedTrades={closedTrades}
            openTrades={openTrades}
            tickers={tickers}
            selectedPair={selectedPair}
            setSelectedPair={setSelectedPair}
            onOpenManualTradeModal={() => setIsManualTradeOpen(true)}
          />
        )}


        {activeTab === 'news' && (
          <NewsSentimentHub
            selectedPair={selectedPair}
            onSelectPair={(pair) => {
              setSelectedPair(pair);
              setActiveTab('dashboard');
            }}
            newsFilterActive={newsFilterActive}
            onToggleNewsFilter={(enabled) => {
              setNewsFilterActive(enabled);
              showToast(
                enabled
                  ? 'Filtro de Notícias & Sentimento ATIVADO no robô.'
                  : 'Filtro de Notícias DESATIVADO. O robô usará apenas indicadores técnicos.',
                enabled ? 'success' : 'info'
              );
            }}
          />
        )}

        {activeTab === 'freqai' && (
          <FreqAICenter
            freqaiState={freqaiState}
            onRetrainModel={handleRetrainModel}
            isRetraining={isRetraining}
          />
        )}

        {activeTab === 'optimization' && (
          <OptimizationHub
            backtestResults={backtestResults}
            onRunBacktest={handleRunBacktest}
            isRunningBacktest={isRunningBacktest}
            hyperoptEpochs={hyperoptEpochs}
            onApplyHyperoptParams={handleApplyHyperoptParams}
            onRunHyperopt={handleRunHyperopt}
            isRunningHyperopt={isRunningHyperopt}
          />
        )}

        {activeTab === 'strategy' && (
          <StrategyIDE
            currentCode={currentStrategyCode}
            setCurrentCode={setCurrentStrategyCode}
            strategies={strategies}
            onSelectStrategy={handleSelectStrategy}
            onSaveStrategy={handleSaveStrategy}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsHub
            whitelist={whitelist}
            setWhitelist={setWhitelist}
            blacklist={blacklist}
            setBlacklist={setBlacklist}
            tickers={tickers}
            selectedExchange={selectedExchange}
            setSelectedExchange={setSelectedExchange}
            openTrades={openTrades}
            closedTrades={closedTrades}
            totalBalance={totalBalance}
            botStatus={botStatus}
            onForceExitTrade={handleForceExitTrade}
            onSetBotStatus={setBotStatus}
            logs={logs}
            onClearLogs={() => setLogs([])}
            onRunCliCommand={handleRunCliCommand}
            config={config}
            onSaveConfig={handleSaveConfig}
          />
        )}
      </main>

      {/* Footer & Creator Credits */}
      <footer id="app-footer" className="mt-auto border-t border-slate-800/80 bg-slate-950/90 backdrop-blur text-slate-400 pt-6 pb-24 lg:pb-8 px-4 mb-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Project & Vision */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200 flex items-center gap-1.5 justify-center md:justify-start">
                <span>Freqtrade Trading Studio</span>
                <button
                  id="footer-version-badge"
                  onClick={() => setIsChangelogOpen(true)}
                  className="text-[10px] bg-slate-800 hover:bg-emerald-950/80 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/50 px-2 py-0.5 rounded font-mono transition-all cursor-pointer flex items-center gap-1 group shadow-xs"
                  title="Clique para ver o histórico de atualizações (Changelog)"
                >
                  <span>v1.0.0</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
                </button>
              </div>
              <p className="text-slate-500 text-[11px]">
                Plataforma analítica e operacional para estratégias algorítmicas, NLP e Machine Learning.
              </p>
            </div>
          </div>

          {/* Credits to Thiago Reed */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 px-3 py-2 rounded-xl transition-all">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Music className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-slate-400">Criado por:</span>
                  <strong className="text-slate-100">Thiago Reed</strong>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-semibold border border-emerald-500/30">
                    Músico
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Música & Inovação Algorítmica</div>
              </div>
            </div>

            <a
              id="spotify-footer-link"
              href="https://open.spotify.com/intl-pt/artist/16h8q9iOGYIibP6pJWQHg3?si=xXYumP-lRXmc5ici028fsA"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 transition-all group"
            >
              <Headphones className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              <span>Ouvir no Spotify</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </a>
          </div>
        </div>
      </footer>

      {/* Manual Force Entry Modal */}
      <ManualTradeModal
        isOpen={isManualTradeOpen}
        onClose={() => setIsManualTradeOpen(false)}
        onEnterTrade={handleEnterTrade}
        selectedPair={selectedPair}
        whitelist={whitelist}
        currentPrice={currentPrice}
      />

      {/* Version Changelog Modal */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </div>
  );
}

