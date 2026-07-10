import AdmZip from 'adm-zip'
import { Cotacao, parseArquivo } from './cotahist-parser'
import { truncateAndInsert } from '@/db/queries'

/**
 * Retorna o pregão anterior à data de referência, pulando o fim de semana.
 * Ex.: numa segunda-feira retorna a sexta anterior.
 * (Feriados da B3 não são tratados — nesses dias o arquivo não existe e o
 * download falha com 404, sem alterar a base.)
 */
function previousTradingDay(reference: Date): Date {
    const d = new Date(reference)
    do {
        d.setUTCDate(d.getUTCDate() - 1)
    } while (d.getUTCDay() === 0 || d.getUTCDay() === 6)
    return d
}

function generateUrl(reference: Date = new Date()): string {
    // O job roda de manhã (08h BRT / 11h UTC), então a data UTC coincide com a
    // data no Brasil e podemos formatar direto em UTC.
    const target = previousTradingDay(reference)
    const day = String(target.getUTCDate()).padStart(2, '0')
    const month = String(target.getUTCMonth() + 1).padStart(2, '0')
    const year = target.getUTCFullYear()
    return `https://bvmf.bmfbovespa.com.br/InstDados/SerHist/COTAHIST_D${day}${month}${year}.ZIP`
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

    await truncateAndInsert(rows)
}

export async function runDailyJob() {
    const url = generateUrl()
    const file = await downloadFile(url)
    const cotacoes: Cotacao[] = transformFileIntoArray(file)

    // Não zera a base se o arquivo veio sem cotações válidas (formato inesperado):
    // preserva os dados do último pregão em vez de deixar a página vazia.
    if (cotacoes.length === 0) {
        throw new Error('Nenhuma cotação válida encontrada no arquivo — base preservada')
    }

    await insertRowsOnDB(cotacoes)

    return { success: true, message: `${cotacoes.length} cotações inseridas com sucesso` }
}
