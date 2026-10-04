import { useState } from 'react'
import { ArchiveRestore, Trash2, Footprints, Archive, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Field, { inputCls } from '../components/ui/Field'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'
import { formatFCFA, totalStock } from '../utils/format'

export default function ArchivedProducts() {
  const { data, loading, error, reload } = useFetch(productService.listArchived)
  const [del, setDel] = useState(null)
  const [word, setWord] = useState('')
  const [busy, setBusy] = useState(false)

  const restore = async (p) => {
    try { await productService.restore(p._id); toast.success(`« ${p.name} » est de nouveau disponible`); reload() }
    catch (e) { toast.error(e.message) }
  }
  const remove = async () => {
    setBusy(true)
    try { await productService.remove(del._id); toast.success('Produit supprimé définitivement'); setDel(null); reload() }
    catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }

  return (
    <>
      <PageHeader title="Produits archivés" subtitle={data ? `${data.length} produit${data.length > 1 ? 's' : ''}` : ' '} />
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
        <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : data.length === 0 ? (
        <EmptyState icon={Archive} title="Aucun produit archivé" text="Les produits que vous archivez apparaissent ici : vous pouvez les restaurer à tout moment." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((p) => (
            <div key={p._id} className="rounded-2xl border border-line bg-surface p-4 shadow-card">
              <div className="flex gap-4">
                {p.image
                  ? <img src={p.image} alt={p.name} loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover opacity-70" />
                  : <span className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-canvas text-ink-soft"><Footprints size={30} /></span>}
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">{p.name}</p>
                  <p className="text-xs text-ink-soft">{p.category?.name} · {p.gender}</p>
                  <p className="mt-0.5 text-sm font-semibold">{formatFCFA(p.price)}</p>
                  <p className="text-xs text-ink-soft">{totalStock(p)} paires en stock</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="ghost" icon={ArchiveRestore} onClick={() => restore(p)}>Restaurer</Button>
                <Button variant="ghost" icon={Trash2} className="!text-danger" onClick={() => { setWord(''); setDel(p) }}>Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {del && (
        <Modal title="Supprimer définitivement ?" onClose={() => !busy && setDel(null)}>
          <p className="text-sm text-ink-soft">« {del.name} » sera effacé pour toujours, avec son historique de stock. Cette action est impossible à annuler.</p>
          <p className="mt-2 text-sm text-ink-soft">Si ce produit a déjà été vendu, la suppression sera refusée et il restera archivé.</p>
          <div className="mt-4">
            <Field label="Tapez SUPPRIMER pour confirmer">
              <input className={inputCls()} value={word} autoCapitalize="characters" onChange={(e) => setWord(e.target.value)} />
            </Field>
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="ghost" className="flex-1" disabled={busy} onClick={() => setDel(null)}>Annuler</Button>
            <Button className="flex-1 !bg-danger hover:!bg-red-700" disabled={busy || word.trim().toUpperCase() !== 'SUPPRIMER'} icon={busy ? Loader2 : undefined} onClick={remove}>Supprimer</Button>
          </div>
        </Modal>
      )}
    </>
  )
}
