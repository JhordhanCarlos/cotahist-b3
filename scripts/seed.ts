import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/db/schema'
import { cotacoes } from '../src/db/schema'
import { MOCK_DATA } from '../src/lib/mock-data'

const url = process.env.DATABASE_URL_HOMOLOG
if (!url) throw new Error('DATABASE_URL_HOMOLOG não definida no .env.local')

const db = drizzle(neon(url), { schema })

async function seed() {
  console.log('🌱 Seeding database with mock data...')

  const rows = MOCK_DATA.map((c) => ({
    ticker: c.ticker,
    datpre: c.datpre,
    codbdi: c.codbdi,
    tpmerc: c.tpmerc,
    nome:   c.nome,
    especi: c.especi,
    preabe: c.preabe.toString(),
    premax: c.premax.toString(),
    premin: c.premin.toString(),
    premed: c.premed.toString(),
    preult: c.preult.toString(),
    preofc: c.preofc.toString(),
    preofv: c.preofv.toString(),
    totneg: c.totneg,
    quatot: c.quatot,
    voltot: c.voltot.toString(),
  }))

  await db.delete(cotacoes)
  await db.insert(cotacoes).values(rows)

  console.log(`✅ Inserted ${rows.length} rows successfully.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})