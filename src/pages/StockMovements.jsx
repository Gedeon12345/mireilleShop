import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, History } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'
import { inventoryService } from '../services/inventoryService'
import { formatDateTime } from '../utils/format'

const TYPES = {
  initial: ['Stock initial', 'bg-blue-50 text-blue-700'],
  sale: ['Vente', 'bg-violet-50 text-violet-700'],
  sale_cancel: ['Annulation', 'bg-gray-100 text-gray-700'],
  adjustment: ['Ajustement', 'bg-amber-50 text-amber-700'],
}

export default function StockMovements() {
  const { id } = useParams()
  const prod = useFetch(() => productService.get(id), [id])
  const mov = useFetch(() => inventoryService.movements(id), [id])
  const error = prod.error || mov.error

  return (
    <>
      <PageHeader title="Mouvements de stock" subtitle={prod.data?.name || ' '}
        action={<Link to="/inventaire"><Button variant="ghost" icon={ArrowLeft}>Retour</Button></Link>} />
      {error ? <ErrorState message={error} onRetry={() => { prod.reload(); mov.reload() }} /> : mov.loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : mov.data.length === 0 ? (
        <EmptyState icon={History} title="Aucun mouvement" text="Les ventes et modifications de stock de ce produit apparaîtront ici." />
      ) : (
        <div className="space-y-2.5">
          {mov.data.map((m) => {
            const [label, cls] = TYPES[m.type] || [m.type, 'bg-gray-100 text-gray-700']
            return (
              <div key={m._id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
                    <b>Pointure {m.size} · {m.color}</b>
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">{formatDateTime(m.createdAt)}{m.reason && ` · ${m.reason}`}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`font-display text-lg font-bold ${m.quantity < 0 ? 'text-danger' : 'text-success'}`}>{m.quantity > 0 ? '+' : ''}{m.quantity}</p>
                  {m.previousQuantity != null && <p className="flex items-center justify-end gap-1 text-xs text-ink-soft">{m.previousQuantity}<ArrowRight size={12} />{m.newQuantity}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
