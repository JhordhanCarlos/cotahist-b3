import { Badge } from '@/components/ui/badge'
import { CotacoesList } from '@/app/components/cotacoes/cotacoes-list'
import { getCotacoes } from '@/db/queries'
import { formatDate } from '@/lib/formatters'

function isWeekend() {
  const day = new Date().getDay()
  return day === 0 || day === 6
}

export default async function Home() {
  const weekend = isWeekend()
  const cotacoes = weekend ? [] : await getCotacoes()
  const datpre = cotacoes[0]?.datpre ?? null

  return (
    <main className="min-h-screen bg-muted/40">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Cotações B3</h1>
            <p className="text-sm text-muted-foreground">
              {datpre ? `Pregão de ${formatDate(datpre)}` : 'Nenhum dado disponível'}
            </p>
          </div>
          {/* <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
            HOMOLOG
          </Badge> */}
        </div>
      </header>

      {weekend ? (
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center gap-3 text-center">
          <p className="text-4xl">🏖️</p>
          <h2 className="text-lg font-semibold">Mercado fechado</h2>
          <p className="text-sm text-muted-foreground">
            A B3 não opera aos finais de semana. <br />
            As cotações voltam na segunda-feira.
          </p>
        </div>
      ) : (
        <section className="max-w-5xl mx-auto px-6 py-8">
          <CotacoesList cotacoes={cotacoes} />
        </section>
      )}
    </main>
  )
}