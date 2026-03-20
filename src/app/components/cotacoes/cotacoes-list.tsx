'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CotacaoCard } from './cotacao-card'
import { CotacaoRow } from '@/db/schema'
import { Search, X } from 'lucide-react'

interface CotacoesListProps {
  cotacoes: CotacaoRow[]
}

export function CotacoesList({ cotacoes }: CotacoesListProps) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const companies = useMemo(() => {
    const unique = new Set(cotacoes.map((c) => c.nome.trim()))
    return Array.from(unique).sort()
  }, [cotacoes])

  const filtered = cotacoes.filter((c) => {
    const term = search.toUpperCase()
    const matchSearch = c.ticker.includes(term) || c.nome.includes(term)
    const matchFilter = activeFilter ? c.nome.trim() === activeFilter : true
    return matchSearch && matchFilter
  })

  function applyFilter(nome: string) {
    setActiveFilter((prev) => (prev === nome ? null : nome))
    setSearch('')
  }

  function clearAll() {
    setSearch('')
    setActiveFilter(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticker ou empresa..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActiveFilter(null)
            }}
            className="pl-9 w-72"
          />
          {(search || activeFilter) && (
            <button
              onClick={clearAll}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-sm text-muted-foreground shrink-0">
          {filtered.length} de {cotacoes.length}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
        {companies.map((nome) => (
          <Badge
            key={nome}
            variant="outline"
            onClick={() => applyFilter(nome)}
            className={`cursor-pointer select-none transition-colors ${
              activeFilter === nome
                ? 'text-amber-700 border-amber-300 bg-amber-50'
                : 'hover:border-amber-300 hover:text-amber-700'
            }`}
          >
            {nome}
          </Badge>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhum resultado encontrado.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CotacaoCard key={c.ticker} cotacao={c} />
          ))}
        </div>
      )}
    </div>
  )
}