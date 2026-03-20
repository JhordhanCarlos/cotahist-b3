import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
 
const url = process.env.DATABASE_URL_HOMOLOG ?? process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL_HOMOLOG ou DATABASE_URL não definida')
const sql = neon(url)
 
export const db = drizzle(sql, { schema })