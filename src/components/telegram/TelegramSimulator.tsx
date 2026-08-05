import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Play,
  Pause,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { OpenTrade, ClosedTrade } from '../../types';

interface TelegramSimulatorProps {
  openTrades: OpenTrade[];
  closedTrades: ClosedTrade[];
  totalBalance: number;
  botStatus: string;
  onForceExitTrade: (id: number) => void;
  onSetBotStatus: (status: any) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isFormatted?: boolean;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({
  openTrades,
  closedTrades,
  totalBalance,
  botStatus,
  onForceExitTrade,
  onSetBotStatus,
}) => {
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `🤖 *Freqtrade Bot Connected*\n\nWelcome to your Freqtrade Telegram interface. You can monitor open positions, view daily profits, or execute remote commands.\n\nType \`/help\` or tap one of the quick command buttons below!`,
      time: '12:00',
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendCommand = (cmd: string) => {
    const userText = cmd.trim();
    if (!userText) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgId = Date.now().toString();

    // Add user message
    const updatedMessages: Message[] = [
      ...messages,
      { id: newMsgId, sender: 'user', text: userText, time: timeStr },
    ];

    setMessages(updatedMessages);
    setInputMsg('');

    // Generate Freqtrade bot response
    setTimeout(() => {
      let botReply = '';
      const lower = userText.toLowerCase();

      if (lower === '/status' || lower === '/status table') {
        if (openTrades.length === 0) {
          botReply = `📊 *Trade Status*\n\nNo active trades currently open.\nBot is scanning whitelist with NostalgiaForInfinityX + FreqAI.`;
        } else {
          let list = openTrades
            .map(
              (t) =>
                `• *#${t.id} ${t.pair}* (${t.direction.toUpperCase()} 1x)\n  💰 Stake: $${t.stakeAmount} | Open: $${t.openRate}\n  📈 Rate: $${t.currentRate} (${t.currentProfitPct >= 0 ? '+' : ''}${t.currentProfitPct.toFixed(2)}% | ${t.currentProfit >= 0 ? '+' : ''}$${t.currentProfit.toFixed(2)})\n  🎯 Target: $${t.roiTargetRate} | Stop: $${t.stopLossRate}\n  ⏱️ Duration: ${t.durationMinutes}m`
            )
            .join('\n\n');
          botReply = `📊 *Active Trades (${openTrades.length}/5)*\n\n${list}`;
        }
      } else if (lower === '/profit') {
        const totalProfitUsdt = closedTrades.reduce((acc, t) => acc + t.profitUsdt, 0);
        const wins = closedTrades.filter((t) => t.profitUsdt > 0).length;
        const losses = closedTrades.length - wins;
        const winrate = closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : '0';

        botReply = `💰 *Profit Report*\n\n• *Closed Trades:* ${closedTrades.length}\n• *Wins/Losses:* ${wins}W / ${losses}L (${winrate}% winrate)\n• *Total Profit:* +$${totalProfitUsdt.toFixed(2)} USDT\n• *Profit Factor:* 2.48\n• *Avg Duration:* 4h 18m\n• *Best Trade:* SOL/USDT (+6.36% / +$63.63)`;
      } else if (lower === '/balance') {
        const inTrades = openTrades.reduce((acc, t) => acc + t.stakeAmount, 0);
        const free = totalBalance - inTrades;
        botReply = `💳 *Account Balance (Binance Spot)*\n\n• *Total Wallet:* $${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT\n• *In Open Trades:* $${inTrades.toFixed(2)} USDT\n• *Available Free:* $${free.toFixed(2)} USDT\n• *Open Positions:* ${openTrades.length}/5`;
      } else if (lower === '/daily') {
        botReply = `📅 *Daily Profit (Last 5 Days)*\n\n• Today: *+$128.40 USDT* (4 trades)\n• Yesterday: *+$132.00 USDT* (3 trades)\n• 2 days ago: *-$3.63 USDT* (2 trades)\n• 3 days ago: *+$97.87 USDT* (2 trades)\n• 4 days ago: *+$45.20 USDT* (1 trade)\n\n*Total 5d:* +$399.84 USDT`;
      } else if (lower === '/count') {
        botReply = `🔢 *Open Trades Count:* ${openTrades.length} / 5 (Max allowed)`;
      } else if (lower === '/performance') {
        botReply = `🏆 *Pair Performance Ranking*\n\n1. *SOL/USDT:* 82.1% winrate (+$1,420.50)\n2. *BTC/USDT:* 80.9% winrate (+$1,140.00)\n3. *SUI/USDT:* 82.1% winrate (+$980.20)\n4. *NEAR/USDT:* 77.4% winrate (+$740.80)\n5. *ETH/USDT:* 68.7% winrate (+$420.00)`;
      } else if (lower === '/reload_config') {
        botReply = `🔄 *Config & Strategy Reloaded*\n\nStrategy: \`NostalgiaForInfinityX_FreqAI\`\nWhitelist pairs synced: 10 pairs.\nFreqAI model weights verified.`;
      } else if (lower === '/stop') {
        onSetBotStatus('paused');
        botReply = `⏸️ *Bot Paused*\n\nNew trade entries disabled. Active open trades will continue to be monitored for exit conditions.`;
      } else if (lower === '/start') {
        onSetBotStatus('running');
        botReply = `▶️ *Bot Started*\n\nTrading loop resumed. Scanning pairlist whitelist for entry signals.`;
      } else if (lower.startsWith('/forceexit')) {
        if (openTrades.length > 0) {
          const tradeToExit = openTrades[0];
          onForceExitTrade(tradeToExit.id);
          botReply = `🛑 *Force Exit Executed*\n\nTrade #${tradeToExit.id} for *${tradeToExit.pair}* sold on exchange @ current market price.`;
        } else {
          botReply = `⚠️ No open trades to force exit.`;
        }
      } else {
        botReply = `ℹ️ *Freqtrade Telegram Commands:*\n\n\`/status\` - View open trades & current profit\n\`/profit\` - Summary of closed trades & ROI\n\`/balance\` - Current wallet & stake breakdown\n\`/daily\` - Daily profit breakdown\n\`/performance\` - Per-pair ranking\n\`/count\` - Active trade count\n\`/reload_config\` - Reload configuration\n\`/stop\` - Pause trade entries\n\`/start\` - Resume trading\n\`/forceexit\` - Force close trade`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 400);
  };

  const quickCommands = [
    { label: '/status', desc: 'Open Trades' },
    { label: '/profit', desc: 'PnL Summary' },
    { label: '/balance', desc: 'Wallet' },
    { label: '/daily', desc: '7d History' },
    { label: '/performance', desc: 'Pairs' },
    { label: '/reload_config', desc: 'Reload' },
    { label: '/count', desc: 'Count' },
    { label: '/forceexit', desc: 'Force Exit' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Telegram Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
            <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">@Freqtrade_Official_Bot</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-mono">bot online</span>
            </div>
            <p className="text-xs text-slate-400">Canal Oficial de Webhooks Telegram & Terminal de Comandos Remotos</p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-mono text-slate-400">Telegram Token: <code className="text-blue-400">78219...:AAH***</code></span>
        </div>
      </div>

      {/* Telegram Chat Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="text-xs whitespace-pre-wrap leading-relaxed font-sans">
                  {msg.text.split('\n').map((line, idx) => {
                    // Quick bold formatting
                    const formatted = line.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
                    return (
                      <p
                        key={idx}
                        className={line === '' ? 'h-2' : ''}
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    );
                  })}
                </div>
                <div className={`text-[10px] text-right mt-1 font-mono ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Command Chips */}
        <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickCommands.map((c) => (
            <button
              key={c.label}
              onClick={() => handleSendCommand(c.label)}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-950 hover:bg-blue-600/30 hover:border-blue-500/50 text-blue-400 border border-slate-800 whitespace-nowrap transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Text Input Area */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCommand(inputMsg)}
            placeholder="Type a command (e.g. /status, /profit, /daily)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => handleSendCommand(inputMsg)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};
