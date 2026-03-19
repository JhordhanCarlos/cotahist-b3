import { Badge } from '@/components/ui/badge'
import { CotacaoCard } from '@/app/components/cotacoes/cotacao-card'
import { MOCK_DATA, MOCK_DATE } from '@/lib/mock-data'
import { formatDate } from '@/lib/formatters'

export default function Home() {
  return (
    <main className="min-h-screen bg-muted/40">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Cotações B3</h1>
            <p className="text-sm text-muted-foreground">
              Pregão de {formatDate(MOCK_DATE)}
            </p>
          </div>
          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
            MOCK — dados de exemplo
          </Badge>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_DATA.map((c) => (
          <CotacaoCard key={c.ticker} cotacao={c} />
        ))}
      </section>
    </main>
  )
}