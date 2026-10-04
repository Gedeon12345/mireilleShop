import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, PackageSearch, Footprints, X, History, Archive, PackagePlus } from 'lucide-react'
import { toast } from 'sonner'
import Modal from '../components/ui/Modal'
import StockAdjustModal from '../components/StockAdjustModal'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'
import { formatFCFA, totalStock, productStatus, stockStatus, colorsOf, groupByColor } from '../utils/format'

const FILTERS = [['all', 'Tous'], ['avail', 'Disponible'], ['low', 'Stock faible'], ['out', 'Rupture']]
const inputCls = 'w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function Inventory({ lowOnly = false }) {
  const { data, loading, error, reload } = useFetch(productService.list)
  const [q, setQ] = useState('')
  const [sp] = useSearchParams()
  const [cat, setCat] = useState(sp.get('categorie') || 'all')
  const [gender, setGender] = useState('all')
  const [archiving, setArchiving] = useState(false)
  const [adjusting, setAdjusting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(lowOnly ? 'low' : 'all')
  const [open, setOpen] = useState(null)

  const categories = useMemo(() => [...new Set((data || []).map((p) => p.category.name))], [data])
  const list = useMemo(() => (data || []).filter((p) =>
    (cat === 'all' || p.category.name === cat) &&
    (gender === 'all' || p.gender === gender) &&
    (status === 'all' || (status === 'avail' ? totalStock(p) > 0 : productStatus(p) === status)) &&
    `${p.name} ${p.category.name} ${colorsOf(p).join(' ')}`.toLowerCase().includes(q.toLowerCase())), [data, q, cat, gender, status])

  return (
    <>
      <PageHeader title={lowOnly ? 'Stock faible' : 'Inventaire'} subtitle={data ? `${list.length} produit${list.length > 1 ? 's' : ''} sur ${data.length}` : ' '}
        action={<Link to="/inventaire/nouveau"><Button icon={Plus} className="hidden sm:inline-flex">Ajouter un produit</Button></Link>} />

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px_160px]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input className={`${inputCls} pl-10`} type="search" placeholder="Rechercher un nom, un modèle…" aria-label="Rechercher" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className={inputCls} aria-label="Catégorie" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={inputCls} aria-label="Genre" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="all">Tous les genres</option>
          {['Homme', 'Femme', 'Enfant', 'Mixte'].map((g) => <option key={g}>{g}</option>)}
        </select>
        <div className="flex gap-2 overflow-x-auto lg:col-span-3">
          {FILTERS.map(([k, l]) => (
            <button key={k} onClick={() => setStatus(k)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${status === k ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-ink-soft hover:text-ink'}`}>{l}</button>
          ))}
        </div>
      </div>

      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={PackageSearch} title="Aucun produit trouvé" text="Modifiez la recherche ou les filtres." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <motion.button key={p._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.03 }}
              onClick={() => setOpen(p)} className="flex gap-4 rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-colors hover:border-primary">
              {p.image
                ? <img src={p.image} alt={p.name} loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                : <span className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Footprints size={30} /></span>}
              <span className="min-w-0">
                <span className="block truncate font-display font-semibold">{p.name}</span>
                <span className="block text-xs text-ink-soft">{p.category.name} · {p.gender}</span>
                <span className="mt-0.5 block text-sm font-semibold">{formatFCFA(p.price)}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-2"><StatusBadge status={productStatus(p)} /><span className="text-xs text-ink-soft">{totalStock(p)} paires · {colorsOf(p).length} couleur{colorsOf(p).length > 1 ? 's' : ''}</span></span>
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/50 sm:items-center" onClick={() => setOpen(null)}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-md overflow-auto rounded-t-3xl bg-surface p-6 sm:rounded-3xl" role="dialog" aria-label={open.name}>
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-xl font-bold">{open.name}</h2><p className="text-sm text-ink-soft">{open.category.name} · {open.gender}</p></div>
              <button aria-label="Fermer" onClick={() => setOpen(null)} className="rounded-lg p-1.5 hover:bg-canvas"><X size={20} /></button>
            </div>
            {open.image && <img src={open.image} alt={open.name} className="mt-4 h-52 w-full rounded-2xl object-cover" />}
            <p className="mt-3 text-xl font-semibold">{formatFCFA(open.price)}</p>
            <h3 className="mt-5 text-sm font-semibold">Répartition du stock</h3>
            {groupByColor(open).map((g) => (
              <div key={g.color} className="mt-3">
                <p className="mb-1.5 flex items-baseline gap-2 text-sm font-medium">{g.color}<span className="text-xs font-normal text-ink-soft">{g.total} paires</span></p>
                <div className="grid grid-cols-5 gap-2">
                  {g.sizes.map((s) => {
                    const st = stockStatus(s.quantity)
                    const c = st === 'out' ? 'border-red-300 bg-red-50 text-red-800' : st === 'low' ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-line'
                    return <div key={s.size} className={`rounded-xl border py-2 text-center ${c}`}><span className="block text-xs">{s.size}</span><b className="text-lg">{s.quantity}</b></div>
                  })}
                </div>
              </div>
            ))}
            <p className="mt-4 font-semibold">Total : {totalStock(open)} paires</p>
            <div className="mt-5 flex gap-2">
              <Link to={`/ventes/nouvelle?produit=${open._id}`} className="flex-1"><Button className="w-full">Enregistrer une vente</Button></Link>
              <Link to={`/inventaire/${open._id}/modifier`} className="flex-1"><Button variant="ghost" className="w-full">Modifier</Button></Link>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="ghost" icon={PackagePlus} className="w-full" onClick={() => setAdjusting(true)}>Ajuster le stock</Button>
              <Link to={`/inventaire/${open._id}/mouvements`}><Button variant="ghost" icon={History} className="w-full">Mouvements</Button></Link>
            </div>
            <Button variant="ghost" icon={Archive} className="mt-2 w-full !text-danger" onClick={() => setArchiving(true)}>Archiver</Button>
          </motion.div>
        </div>
      )}
      {adjusting && open && <StockAdjustModal product={open} onClose={() => setAdjusting(false)} onDone={() => { setAdjusting(false); setOpen(null); reload() }} />}

      {archiving && open && (
        <Modal title="Archiver ce produit ?" onClose={() => !busy && setArchiving(false)}>
          <p className="text-sm text-ink-soft">« {open.name} » ne pourra plus être vendu ni modifié. Son historique de ventes est conservé.</p>
          <div className="mt-5 flex gap-2">
            <Button variant="ghost" className="flex-1" disabled={busy} onClick={() => setArchiving(false)}>Annuler</Button>
            <Button className="flex-1 !bg-danger hover:!bg-red-700" disabled={busy} onClick={async () => {
              setBusy(true)
              try { await productService.archive(open._id); toast.success('Produit archivé'); setArchiving(false); setOpen(null); reload() }
              catch (e) { toast.error(e.message) } finally { setBusy(false) }
            }}>Archiver</Button>
          </div>
        </Modal>
      )}
    </>
  )
}
