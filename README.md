# Cotahist B3

> Real-time B3 stock market data, made human.

The Brazilian stock exchange (B3) publishes a daily file called **COTAHIST** — a fixed-width text format containing every trade that happened on the market that day. It's incredibly rich data, buried inside an obscure file format that most people have never heard of.

This project parses it, stores it, and serves it through a clean interface that anyone can understand — no finance background required.

---

## What it does

Every trading day, after market close, a cron job automatically:

1. Downloads the COTAHIST file directly from B3's public servers
2. Streams and parses each line (fixed-width format, 245 characters per record)
3. Writes the processed data to a Neon (serverless PostgreSQL) database
4. Caches the result in Upstash Redis for near-instant reads

Users get a fast, clean snapshot of the day's trading data — open, close, high, low, volume, and variation — without touching a spreadsheet or knowing what a ticker symbol is.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16.2](https://nextjs.org) (App Router) |
| Language | TypeScript |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) |
| Database | [Neon](https://neon.tech) — serverless PostgreSQL |
| Cache | [Upstash Redis](https://upstash.com) |
| Hosting | [Vercel](https://vercel.com) |
| Scheduler | Vercel Cron Jobs |
| Compiler | React Compiler (experimental) |

---

## How the COTAHIST format works

B3 publishes the file daily at:

```
https://bvmf.bmfbovespa.com.br/InstDados/SerHist/COTAHIST_DDDMMAA.ZIP
```

Each line in the file is exactly **245 characters** wide. Fields are positional — no delimiters, no JSON, just offsets and lengths defined in a spec document.

Example line:

```
01202602250200PETR4       010PETROBRAS   PN      N1   R$  0000000003520...
```

Parsed:

| Field | Position | Raw | Interpreted |
|---|---|---|---|
| Record type | 1–2 | `01` | Detail record |
| Trade date | 3–10 | `20260225` | Feb 25, 2026 |
| Ticker | 13–24 | `PETR4` | PETR4 |
| Market type | 25–27 | `010` | Spot market |
| Company | 28–39 | `PETROBRAS` | Petrobras |
| Open | 57–69 | `0000000003520` | R$ 35.20 |
| High | 70–82 | `0000000003650` | R$ 36.50 |
| Low | 83–95 | `0000000003480` | R$ 34.80 |
| Close | 109–121 | `0000000003580` | R$ 35.80 |

> All price fields are integers with **2 implicit decimal places**. Divide by 100 to get the real value.

---

## Project structure

```
src/
  app/
    page.tsx                    # Home — composes the page
    api/
      cron/
        route.ts                # Cron endpoint — triggered by Vercel scheduler
  components/
    cotacoes/
      cotacao-card.tsx          # Individual stock card
      variacao-badge.tsx        # ▲▼ variation badge
  lib/
    cotahist-parser.ts          # Fixed-width line parser → typed objects
    mock-data.ts                # Hardcoded data for local development
    formatters.ts               # formatBRL, formatDate, calcVariacao
    utils.ts                    # shadcn cn() utility
```

---

## Getting started

**Prerequisites:** Node.js 18+, a [Neon](https://neon.tech) account, an [Upstash](https://upstash.com) account.

```bash
# Clone and install
git clone https://github.com/Jhordhan-carlos/cotahist-b3.git
cd cotahist-b3
npm install

# Install shadcn components
npx shadcn@latest add card badge separator

# Set up environment variables
cp .env.example .env.local
# Fill in your Neon and Upstash credentials

# Run locally
npm run dev
```

The app runs on `http://localhost:3000`.

During development, the page renders from `mock-data.ts` — no database or cron job needed.

To test the cron job manually:

```bash
curl http://localhost:3000/api/cron
```

---

## Environment variables

```env
# Neon
DATABASE_URL=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Cron secret (used to protect the /api/cron endpoint)
CRON_SECRET=
```

---

## Data pipeline

```
Vercel Cron (weekdays at 10 PM UTC / 7 PM BRT)
  → Download ZIP from B3
  → Decompress in memory
  → Stream line by line
  → Filter: record type 01, market type 010 or 020
  → Batch insert into Neon
  → Pipeline write to Redis
  → Set status key: cotahist:status = "ready"

User visits the page
  → Check cotahist:status in Redis
  → If ready → serve from Redis cache
  → If miss  → fallback query to Neon
```

---

## Design principles

- **No charts.** Candlestick charts are for traders. This is for everyone else.
- **Streaming over buffering.** The COTAHIST file is processed line by line — never loaded fully into memory.
- **Cache as assurance.** Redis sits in front of Neon. If the cron job is slow or runs twice, the user experience stays instant and consistent.
- **One table, refreshed daily.** The database is truncated and repopulated every trading day. No historical accumulation, no migrations to worry about — yet.

---

## License

MIT
