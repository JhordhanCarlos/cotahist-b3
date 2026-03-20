import AdmZip from 'adm-zip'
import { Cotacao, parseArquivo } from './cotahist-parser'
const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL não definida')

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/db/schema'
import { truncateAndInsert } from 'src/db/queries'
const db = drizzle(neon(url), { schema })


function generateUrl() {
    const today = new Date()
    today.setDate(today.getDate() - 1)
    const day = String(today.getDate()).padStart(2, '0')
    const month = today.getUTCMonth().toString().length === 1 ? `0${today.getUTCMonth() + 1}` : today.getUTCMonth() + 1
    const year = today.getUTCFullYear()
    const formattedDate = `${day}${month}${year}`
    return `https://bvmf.bmfbovespa.com.br/InstDados/SerHist/COTAHIST_D${formattedDate}.ZIP`
}

async function downloadFile(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Falha ao baixar o arquivo: ${response.status}`)
    }
    const data = await response.arrayBuffer()
    const zip = new AdmZip(Buffer.from(data))
    const entry = zip.getEntries()[0]
    return zip.readAsText(entry, 'latin1')
}

function transformFileIntoArray(file: string) {
    const cotacoes = parseArquivo(file)
    return cotacoes.filter(c => c.codbdi === '02' || c.codbdi === '96')
}

async function insertRowsOnDB(cotacoes: Cotacao[]) {
    const rows = cotacoes.map((c) => ({
        ticker: c.ticker,
        datpre: c.datpre,
        codbdi: c.codbdi,
        tpmerc: c.tpmerc,
        nome: c.nome,
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

    truncateAndInsert(rows)
}

export async function runDailyJob() {
    const url = generateUrl()
    const file = await downloadFile(url)
    const cotacoes: Cotacao[] = transformFileIntoArray(file)
    await insertRowsOnDB(cotacoes)

    return { success: true, message: 'Cotações inseridas com sucesso' }
}