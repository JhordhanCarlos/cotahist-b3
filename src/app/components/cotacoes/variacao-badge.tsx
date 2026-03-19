import { Badge } from '@/components/ui/badge'

interface VariacaoBadgeProps {
  value: number
}

export function VariacaoBadge({ value }: VariacaoBadgeProps) {
  const isPositive = value >= 0
  return (
    <Badge
      variant="secondary"
      className={
        isPositive
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
          : 'bg-red-100 text-red-800 hover:bg-red-100'
      }
    >
      {isPositive ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </Badge>
  )
}