export interface Cotacao {
    datpre: string       // "2026-02-25"
    codbdi: string       // "02"
    ticker: string       // "PETR4"
    tpmerc: string       // "010"
    nome: string         // "PETROBRAS"
    especi: string       // "PN N1"
    preabe: number       // 35.20
    premax: number       // 36.50
    premin: number       // 34.80
    premed: number       // 35.60
    preult: number       // 35.80 — fechamento
    preofc: number       // 35.70
    preofv: number       // 35.90
    totneg: number       // 3456
    quatot: number
    voltot: number
  }
  
  function parsePreco(raw: string): number {
    const n = parseInt(raw.trim(), 10)
    return isNaN(n) ? 0 : n / 100
  }
  
  function parseData(raw: string): string {
    // "20260225" → "2026-02-25"
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
  }
  
  export function parseLinha(linha: string): Cotacao | null {
    if (linha.length < 245) return null
    if (linha.substring(0, 2) !== '01') return null
  
    const tpmerc = linha.substring(24, 27).trim()
    const codbdi = linha.substring(10, 12).trim()
  
    // só mercado à vista (010) e fracionário (020)
    if (tpmerc !== '010' && tpmerc !== '020') return null
  
    return {
      datpre:  parseData(linha.substring(2, 10)),
      codbdi,
      ticker:  linha.substring(12, 24).trim(),
      tpmerc,
      nome:    linha.substring(27, 39).trim(),
      especi:  linha.substring(39, 49).trim(),
      preabe:  parsePreco(linha.substring(56, 69)),
      premax:  parsePreco(linha.substring(69, 82)),
      premin:  parsePreco(linha.substring(82, 95)),
      premed:  parsePreco(linha.substring(95, 108)),
      preult:  parsePreco(linha.substring(108, 121)),
      preofc:  parsePreco(linha.substring(121, 134)),
      preofv:  parsePreco(linha.substring(134, 147)),
      totneg:  parseInt(linha.substring(147, 152).trim(), 10) || 0,
      quatot:  parseInt(linha.substring(152, 170).trim(), 10) || 0,
      voltot:  parsePreco(linha.substring(170, 188)),
    }
  }
  
  export function parseArquivo(conteudo: string): Cotacao[] {
    return conteudo
      .split('\n')
      .map(parseLinha)
      .filter((c): c is Cotacao => c !== null)
  }