import { Boxes, Footprints, ShoppingBag, TriangleAlert, PackageX } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import useFetch from '../hooks/useFetch'
import { dashboardService } from '../services/dashboardService'
import { formatFCFA } from '../utils/format'

const when = (d) => new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(dashboardService.get)
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <PageHeader title="Tableau de bord" subtitle={today} />
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className={`h-28 ${i === 0 ? 'col-span-2 lg:col-span-1' : ''}`} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <StatCard hero index={0} label="Stock total" value={data.totalStock} hint="paires disponibles" icon={Boxes} />
            <StatCard index={1} label="Modèles" value={data.productCount} hint="fiches actives" icon={Footprints} />
            <StatCard index={2} label="Ventes du jour" value={data.soldToday} hint="paires vendues" icon={ShoppingBag} />
            <StatCard index={3} label="Stock faible" value={data.lowStock} hint="pointures à réapprovisionner" icon={TriangleAlert} tone="warning" />
            <StatCard index={4} label="Ruptures" value={data.outOfStock} hint="pointures épuisées" icon={PackageX} tone="danger" />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-lg font-semibold">Stock par catégorie</h2>
              {data.byCategory.length === 0 ? <EmptyState title="Aucune catégorie" /> : data.byCategory.map((c) => (
                <div key={c.name} className="my-3 grid grid-cols-[110px_1fr_32px] items-center gap-3 text-sm sm:grid-cols-[140px_1fr_32px]">
                  <span className="truncate">{c.name}</span>
                  <span className="h-2 rounded-full bg-line"><span className="block h-2 rounded-full bg-primary" style={{ width: `${(c.quantity / data.byCategory[0].quantity) * 100}%` }} /></span>
                  <b className="text-right">{c.quantity}</b>
                </div>
              ))}
            </Card>
            <Card>
              <h2 className="mb-2 text-lg font-semibold">Dernières ventes</h2>
              {data.latestSales.length === 0 ? <EmptyState title="Aucune vente" text="Les ventes enregistrées apparaîtront ici." /> : data.latestSales.map((s) => (
                <div key={s._id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-0 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{s.productName}</p>
                    <p className="text-xs text-ink-soft">Pointure {s.size} · {s.quantity} paire{s.quantity > 1 ? 's' : ''} · {when(s.createdAt)}</p>
                  </div>
                  <b className="shrink-0">{formatFCFA(s.total)}</b>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </>
  )
}
