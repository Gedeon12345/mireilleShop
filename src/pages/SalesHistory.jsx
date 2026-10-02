import { useMemo, useState } from 'react'
import { Search, History, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { inputCls } from '../components/ui/Field'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import useFetch from '../hooks/useFetch'
import { salesService } from '../services/salesService'
import { formatFCFA, formatDateTime } from '../utils/format'

const Badge = ({ status }) => status === 'cancelled'
  ? <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">Annulée</span>
  : <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">Validée</span>

export default function SalesHistory() {
  const { data, loading, error, reload } = useFetch(salesService.list)
  const [q, setQ] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [sel, setSel] = useState(null)
  const [asking, setAsking] = useState(false)
  const [busy, setBusy] = useState(false)

  const list = useMemo(() => (data || []).filter((s) => {
    const t = new Date(s.createdAt)
    return (!from || t >= new Date(`${from}T00:00:00`)) && (!to || t <= new Date(`${to}T23:59:59`)) &&
      `${s.reference} ${s.items.map((i) => `${i.productName} ${i.color}`).join(' ')}`.toLowerCase().includes(q.toLowerCase())
  }), [data, q, from, to])
  const valid = list.filter((s) => s.status === 'completed')
  const pairs = valid.reduce((a, s) => a + s.items.reduce((x, i) => x + i.quantity, 0), 0)
  const amount = valid.reduce((a, s) => a + s.totalAmount, 0)

  const close = () => { setSel(null); setAsking(false) }
  const cancel = async () => {
    setBusy(true)
    try { await salesService.cancel(sel._id); toast.success('Vente annulée, stock restauré'); close(); reload() }
    catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }

  return (
    <>
      <PageHeader title="Historique des ventes" subtitle={data ? `${list.length} transaction${list.length > 1 ? 's' : ''}` : ' '} />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_150px_150px]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input className={`${inputCls()} pl-10`} type="search" placeholder="Référence, produit, couleur…" aria-label="Rechercher" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <input className={inputCls()} type="date" aria-label="Du" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className={inputCls()} type="date" aria-label="Au" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[['Ventes', valid.length], ['Paires', pairs], ['Montant', formatFCFA(amount)]].map(([l, v]) => (
              <Card key={l} className="!p-4"><p className="text-xs text-ink-soft">{l} sur la période</p><p className="mt-1 font-display text-lg font-bold sm:text-2xl">{v}</p></Card>
            ))}
          </div>
          {list.length === 0 ? <EmptyState icon={History} title="Aucune vente trouvée" text="Modifiez la recherche ou la période." /> : (
            <div className="space-y-2.5">
              {list.map((s) => (
                <button key={s._id} onClick={() => setSel(s)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card hover:border-primary">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm"><b>{s.reference}</b><Badge status={s.status} /></p>
                    <p className="mt-0.5 truncate font-medium">{s.items[0].productName}{s.items.length > 1 && ` +${s.items.length - 1}`}</p>
                    <p className="text-xs text-ink-soft">Pointure {s.items[0].size} · {s.items[0].color} · {s.items[0].quantity} paire{s.items[0].quantity > 1 ? 's' : ''} · {formatDateTime(s.createdAt)}</p>
                  </div>
                  <b className={`shrink-0 ${s.status === 'cancelled' ? 'text-ink-soft line-through' : ''}`}>{formatFCFA(s.totalAmount)}</b>
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {sel && (
        <Modal title={sel.reference} onClose={() => !busy && close()}>
          <div className="mb-3 flex items-center justify-between text-sm"><Badge status={sel.status} /><span className="text-ink-soft">{formatDateTime(sel.createdAt)}</span></div>
          {sel.items.map((i, k) => (
            <div key={k} className="rounded-xl bg-canvas p-3 text-sm">
              <p className="font-semibold">{i.productName}</p>
              <p className="text-ink-soft">Pointure {i.size} · {i.color} · {i.quantity} × {formatFCFA(i.unitPrice)}</p>
              <p className="mt-1 text-right font-semibold">{formatFCFA(i.total)}</p>
            </div>
          ))}
          <div className="mt-3 flex justify-between font-semibold"><span>Total</span><span>{formatFCFA(sel.totalAmount)}</span></div>
          <p className="mt-1 text-xs text-ink-soft">Enregistrée par {sel.createdBy}{sel.cancelledAt && ` · annulée le ${formatDateTime(sel.cancelledAt)}`}</p>
          {sel.status === 'completed' && (asking ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              <p>Le stock sera restauré. La vente restera visible comme « annulée ».</p>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" className="flex-1" disabled={busy} onClick={() => setAsking(false)}>Retour</Button>
                <Button className="flex-1 !bg-danger hover:!bg-red-700" disabled={busy} icon={busy ? Loader2 : undefined} onClick={cancel}>Annuler la vente</Button>
              </div>
            </div>
          ) : <Button variant="ghost" className="mt-4 w-full !text-danger" onClick={() => setAsking(true)}>Annuler cette vente</Button>)}
        </Modal>
      )}
    </>
  )
}
