import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CotacaoRow } from '@/db/schema'
import { formatBRL, calcVariacao } from '@/lib/formatters'
import { VariacaoBadge } from './variacao-badge'

interface CotacaoCardProps {
  cotacao: CotacaoRow
}

export function CotacaoCard({ cotacao }: CotacaoCardProps) {
  const preult = parseFloat(cotacao.preult)
  const preabe = parseFloat(cotacao.preabe)
  const variacao = calcVariacao(preult, preabe)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight">{cotacao.ticker}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
              {cotacao.nome} · {cotacao.especi}
            </p>
          </div>
          <VariacaoBadge value={variacao} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-0.5">
            Fechamento
          </p>
          <p className="text-3xl font-bold tabular-nums tracking-tight">
            {formatBRL(preult)}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Abertura', value: parseFloat(cotacao.preabe) },
            { label: 'Máxima',   value: parseFloat(cotacao.premax) },
            { label: 'Mínima',   value: parseFloat(cotacao.premin) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                {label}
              </p>
              <p className="text-sm font-medium tabular-nums">{formatBRL(value)}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {cotacao.totneg.toLocaleString('pt-BR')} negócios no dia
        </p>
      </CardContent>
    </Card>
  )
}