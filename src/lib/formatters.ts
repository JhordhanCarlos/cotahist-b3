export function formatBRL(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    })
  }
   
  export function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }
   
  export function calcVariacao(preult: number, preabe: number) {
    if (preabe === 0) return 0
    return ((preult - preabe) / preabe) * 100
  }
   