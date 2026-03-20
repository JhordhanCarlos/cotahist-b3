import { db } from './index'
import { cotacoes, CotacaoInsert } from './schema'
 
export async function getCotacoes() {
  return db.select().from(cotacoes).orderBy(cotacoes.ticker)
}
 
export async function truncateAndInsert(rows: CotacaoInsert[]) {
  await db.delete(cotacoes)
 
  // insere em batches de 500 para não estourar o limite do Neon
  const BATCH_SIZE = 500
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    await db.insert(cotacoes).values(rows.slice(i, i + BATCH_SIZE))
  }
}