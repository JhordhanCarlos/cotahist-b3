import { pgTable, varchar, date, numeric, integer, bigint } from 'drizzle-orm/pg-core'
 
export const cotacoes = pgTable('cotacoes', {
  ticker:  varchar('ticker', { length: 12 }).notNull(),
  datpre:  date('datpre').notNull(),
  codbdi:  varchar('codbdi', { length: 2 }).notNull(),
  tpmerc:  varchar('tpmerc', { length: 3 }).notNull(),
  nome:    varchar('nome', { length: 12 }).notNull(),
  especi:  varchar('especi', { length: 10 }).notNull(),
  preabe:  numeric('preabe', { precision: 13, scale: 2 }).notNull(),
  premax:  numeric('premax', { precision: 13, scale: 2 }).notNull(),
  premin:  numeric('premin', { precision: 13, scale: 2 }).notNull(),
  premed:  numeric('premed', { precision: 13, scale: 2 }).notNull(),
  preult:  numeric('preult', { precision: 13, scale: 2 }).notNull(),
  preofc:  numeric('preofc', { precision: 13, scale: 2 }).notNull(),
  preofv:  numeric('preofv', { precision: 13, scale: 2 }).notNull(),
  totneg:  integer('totneg').notNull(),
  quatot:  bigint('quatot', { mode: 'number' }).notNull(),
  voltot:  numeric('voltot', { precision: 18, scale: 2 }).notNull(),
})
 
export type CotacaoRow = typeof cotacoes.$inferSelect
export type CotacaoInsert = typeof cotacoes.$inferInsert