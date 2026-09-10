# 🚀 Crypto AI — Autonomous Cryptocurrency Intelligence Platform

![Crypto AI Banner](public/favicon.svg)

An AI-driven cryptocurrency tracking and sentiment analysis platform built with **Laravel 11**, **Inertia.js**, **React**, **TypeScript**, and **Tailwind CSS**. 

Crypto AI monitors **15 top market cryptocurrencies**, tracking daily price history, delivering **database-cached AI trading recommendations**, managing **favorite coins**, and dispatching scheduled notifications directly to **Telegram** and **Slack**.

---

## ✨ Features

- 🪙 **15 Top Cryptocurrencies**: Automatic daily price fetching & historical tracking powered by CoinGecko API.
- 🤖 **AI Trading Sentiment**: Real-time Buy / Sell / Hold recommendations with confidence scores using Local LLM (Ollama).
- ⚡ **Database AI Response Caching**: Dedicated `ai_analysis_caches` PostgreSQL table caching AI output with configurable TTL for instant load times.
- ⭐ **Favorite Coin System**: Star favorite cryptocurrencies to highlight them in the dashboard and track price changes.
- 👤 **User Feature Flagging**: Configurable `can_favourite_coins` permission flag on users table.
- 📱 **Telegram & Slack Integrations**: Test connections, send test messages, and receive scheduled daily report updates.
- ⏰ **Interactive Daily Report Timepicker**: Select delivery schedules (e.g. 09:00 AM) with preset time pills.
- 📈 **Interactive Price Charts**: Trend visualization supporting **7D / 30D / 90D / All** timeframes with green/red trend segment coloring.
- 🕒 **Topbar Digital Clock**: Real-time ticking UTC/Local digital clock widget.
- 🎨 **Modern Responsive UI**: Dark & Light mode theme support, glassmorphism cards, micro-animations, and toast feedback.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Laravel 11 (PHP 8.3+) |
| **Frontend Adapter** | Inertia.js (React 19 + TypeScript) |
| **Styling** | Tailwind CSS v4 + Class Variance Authority |
| **Database** | PostgreSQL |
| **Cache & Queue** | Database / Redis |
| **Charts** | Chart.js + react-chartjs-2 |
| **AI Engine** | Ollama Local LLM / Local AI Service |
| **Notifications** | Telegram Bot API & Slack Webhooks/Bot API |
| **Environment** | Laravel Sail (Docker Compose) |

---

## 🚀 Getting Started

### Prerequisites

- Docker Desktop / Docker Engine & Docker Compose
- Node.js 20+ & npm

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/crypto-ai.git
   cd crypto-ai
   ```

2. **Copy Environment File**:
   ```bash
   cp .env.example .env
   ```

3. **Start Docker Environment via Laravel Sail**:
   ```bash
   ./vendor/bin/sail up -d
   ```

4. **Install PHP Dependencies**:
   ```bash
   ./vendor/bin/sail composer install
   ```

5. **Install Node Dependencies & Build Assets**:
   ```bash
   npm install
   npm run dev
   ```

6. **Generate Application Key**:
   ```bash
   ./vendor/bin/sail artisan key:generate
   ```

7. **Run Database Migrations & Seeders**:
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```

---

## ⚙️ Environment Configuration (`.env`)

```env
APP_NAME="Crypto AI"
APP_ENV=local
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=pgsql
DB_PORT=5432
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password

# CoinGecko API Key
COINGECKO_API_KEY=your_coingecko_api_key

# Local LLM / Ollama Configuration
LLM_BASE_URL=http://ollama:11434
LLM_MODEL=llama3.2:3b
LLM_TIMEOUT=120

# Slack Bot Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
```

---

## 📜 Console Commands & Artisan Scheduler

| Command | Description |
| :--- | :--- |
| `php artisan app:fetch-daily-crypto-prices` | Fetches today's prices for tracked cryptocurrencies and triggers notification dispatches. |
| `php artisan app:send-favourite-coin-notifications` | Dispatches daily price updates for users' favorite coins to Telegram & Slack. |

---

## 💻 Database Schema Overview

- **`users`**: User accounts including `can_favourite_coins` boolean feature flag.
- **`cryptocurrencies`**: Master table storing the 15 tracked coins (`symbol`, `name`, `image_url`, `api_id`).
- **`prices`**: Daily historical price recordings (`cryptocurrency_id`, `price`, `recorded_at`).
- **`user_cryptocurrencies`**: Many-to-many relation mapping user favorited coins.
- **`ai_analysis_caches`**: PostgreSQL DB cache for AI responses (`cryptocurrency_id`, `analysis` JSON, `expires_at`).
- **`notification_settings`**: Integrations settings per user (`telegram_user_id`, `slack_user_id`, `notifications_enabled`, `scheduled_time`).

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
