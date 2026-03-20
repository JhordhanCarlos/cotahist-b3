# Cotahist B3

> B3 stock market data, made human.

Live: **[cotahist-b3.vercel.app](https://cotahist-b3.vercel.app)**

The Brazilian stock exchange (B3) publishes a daily file called **COTAHIST** — a fixed-width text format containing every trade that happened on the market that day. It's incredibly rich data, buried inside an obscure file format that most people have never heard of.

This project parses it, stores it, and serves it through a clean interface that anyone can understand — no finance background required.

---

## What it does

Every trading day, after market close, a cron job automatically:

1. Downloads the COTAHIST ZIP directly from B3's public servers
2. Decompresses and parses each line (fixed-width format, 245 characters per record)
3. Truncates and repopulates a Neon (serverless PostgreSQL) database

Users get a fast, clean snapshot of the day's trading data — open, close, high, low, volume, and variation — searchable by ticker or company name, with a click-through modal for full detail.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) |
| Database | [Neon](https://neon.tech) — serverless PostgreSQL |
| ORM | [Drizzle](https://orm.drizzle.team) |
| Hosting | [Vercel](https://vercel.com) |
| Scheduler | Vercel Cron Jobs |
| Compiler | React Compiler (experimental) |

---

## How the COTAHIST format works

B3 publishes the file daily at:
```
https://bvmf.bmfbovespa.com.br/InstDados/SerHist/COTAHIST_DDDMMAA.ZIP
```

Each line is exactly **245 characters** wide. Fields are positional — no delimiters, no JSON, just offsets and lengths defined in a spec document.

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
    page.tsx                        # Home — fetches data, passes to shell
    loading.tsx                     # Skeleton screen while data loads
    icon.svg                        # Favicon
    api/
      cron/
        route.ts                    # Cron endpoint — triggered by Vercel scheduler
  components/
    logo.tsx                        # Candlestick SVG logo
    cotacoes/
      cotacoes-shell.tsx            # Client shell — search, filters, modal state
      cotacao-card.tsx              # Individual stock card
      cotacao-modal.tsx             # Click-through detail modal
      variacao-badge.tsx            # ▲▼ variation badge
  db/
    schema.ts                       # Drizzle table definition
    index.ts                        # Neon connection
    queries.ts                      # getCotacoes, truncateAndInsert
  lib/
    cotahist-parser.ts              # Fixed-width line parser → typed objects
    job.ts                          # Core job: download → parse → insert
    formatters.ts                   # formatBRL, formatDate, calcVariacao
    mock-data.ts                    # Hardcoded data for local development
scripts/
  seed.ts                           # Populates homolog branch with mock data
drizzle.config.ts                   # Drizzle Kit config (points to homolog locally)
vercel.json                         # Cron schedule
```

---

## Getting started

**Prerequisites:** Node.js 18+, a [Neon](https://neon.tech) account.

```bash
# Clone and install
git clone https://github.com/your-username/cotahist-b3.git
cd cotahist-b3
npm install

# Install shadcn components
npx shadcn@latest add card badge separator input dialog skeleton

# Set up environment variables
cp .env.example .env.local
# Fill in your credentials (see below)

# Run migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# Seed homolog with mock data
npm run seed

# Run locally
npm run dev
```

The app runs on `http://localhost:3000`.

To test the cron job manually (Git Bash or Unix):
```bash
curl -H "Authorization: Bearer your-cron-secret" http://localhost:3000/api/cron
```

---

## Environment variables

```env
# Neon — production branch
DATABASE_URL=

# Neon — homolog branch (local development only)
DATABASE_URL_HOMOLOG=

# Cron secret — protects /api/cron from unauthorized calls
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CRON_SECRET=
```

Only `DATABASE_URL` and `CRON_SECRET` are needed in Vercel. `DATABASE_URL_HOMOLOG` is local only.

---

## Data pipeline

```
Vercel Cron (weekdays at 10 PM UTC / 7 PM BRT)
  → Download ZIP from B3
  → Decompress in memory
  → Parse line by line (245 chars/record)
  → Filter: record type 01, BDI 02 or 96
  → TRUNCATE cotacoes
  → Batch INSERT (500 rows at a time)

User visits the page
  → Server Component fetches from Neon
  → Renders instantly — no client round-trips
```

---

## Design principles

- **No charts.** Candlestick charts are for traders. This is for everyone else.
- **One table, refreshed daily.** The database is truncated and repopulated every trading day — simple, predictable, no drift.
- **Server Components by default.** Data fetching happens on the server. The client only handles search, filters, and the modal.
- **Weekend-aware.** The app detects weekends and skips the database query entirely, showing a friendly message instead.

---

## License

MIT
