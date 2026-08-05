# 🚀 Freqtrade Trading Studio

A high-performance visual dashboard, trade analyzer, and strategy development environment for the **Freqtrade** algorithmic crypto trading bot.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38b2ac.svg)
![Express](https://img.shields.io/badge/Express-4.21-000000.svg)

---

## 🌟 Key Features

- 📊 **Real-Time Trading Monitor**: Live trade executions, active positions, open orders, PnL tracking, and candle charts.
- 🎯 **Multi-Timeframe (MTF) Confluence Scanner**: Multi-timeframe trend alignment (1m, 5m, 15m, 1h, 4h, 1d) with RSI, MACD, Bollinger Bands, and EMA ribbon analysis.
- 🧠 **NLP Sentiment & Macro Consensus Scanner**: Real-time multi-source crypto news aggregator, natural language sentiment processing (Bullish/Neutral/Bearish), fear & greed index, and macroeconomic event tracking.
- 🤖 **FreqAI Machine Learning Suite**: Model training monitor, feature importance visualizer, prediction confidence intervals, and drift detectors.
- ⚡ **Backtesting Simulator**: High-speed historic simulations with equity curves, drawdown analysis, win-rate metrics, and trade distribution heatmaps.
- 🔬 **Hyperopt Parameter Visualizer**: Multi-dimensional parameter space optimizer with parallel coordinates, scatter plots, and epoch convergence curves.
- 💻 **Strategy Code Editor**: Built-in Python strategy editor with syntax highlighting, template presets, and parameter validation.
- 📋 **Dynamic Pairlist Manager**: Volume-based, volatility, and custom pair filtering for spot and futures markets.
- 📲 **Telegram Webhook Simulator**: Real-time alert preview and interactive test notification dispatch.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Motion (Framer Motion)
- **Backend / API**: Node.js, Express, tsx
- **Build Tool**: Vite 6, esbuild

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `pnpm` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/thiagocloudt1986-code/freqtrade-trading-studio.git

# Enter directory
cd freqtrade-trading-studio

# Install dependencies
npm install
```

### Development Server

```bash
# Start dev server on http://localhost:3000
npm run dev
```

### Production Build

```bash
# Build frontend and bundled server
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard widgets, monitors, and scanners
│   │   │   ├── MarketConsensusScanner.tsx
│   │   │   ├── TradingMonitor.tsx
│   │   │   ├── FreqAiMonitor.tsx
│   │   │   ├── BacktestVisualizer.tsx
│   │   │   ├── HyperoptVisualizer.tsx
│   │   │   ├── StrategyEditor.tsx
│   │   │   ├── PairlistManager.tsx
│   │   │   └── TelegramWebhookSimulator.tsx
│   │   └── layout/          # Header, Sidebar, Navigation
│   ├── types.ts             # Global TypeScript models & interfaces
│   ├── App.tsx              # Main application shell
│   └── main.tsx             # React entrypoint
├── server.ts                # Express backend API & Vite middleware
├── package.json
└── vite.config.ts
```

---

## 🎵 Créditos & Autor / Creator Credits

Este projeto foi idealizado e desenvolvido sob a visão e direção criativa de:

- **Autor / Criador**: **Thiago Reed**
- 🎸 **Ocupação**: Músico, Produtor Musical & Entusiasta de Trading Algorítmico
- 🎧 **Spotify Oficial**: [Ouvir Thiago Reed no Spotify](https://open.spotify.com/intl-pt/artist/16h8q9iOGYIibP6pJWQHg3?si=xXYumP-lRXmc5ici028fsA)
- 🔗 **Perfil do Artista**: `https://open.spotify.com/intl-pt/artist/16h8q9iOGYIibP6pJWQHg3?si=xXYumP-lRXmc5ici028fsA`

---

## 📄 License

MIT License - Developed with Google AI Studio. Dedicated to Thiago Reed.
