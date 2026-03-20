import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const url = process.env.DATABASE_URL_HOMOLOG ?? process.env.DATABASE_URL
console.log(url, 'from drizzle.config.ts')
if (!url) throw new Error('DATABASE_URL_HOMOLOG ou DATABASE_URL não definida')
export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url : url,
  },
} satisfies Config
 