import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Archive, Tags, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Field, { inputCls } from '../components/ui/Field'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import useFetch from '../hooks/useFetch'
import { categoryService } from '../services/categoryService'

export default function Categories() {
  const { data, loading, error, reload } = useFetch(categoryService.list)
  const [modal, setModal] = useState(null) // {type:'form'|'archive', cat?}
  const [f, setF] = useState({ name: '', description: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const openForm = (cat) => { setF({ name: cat?.name || '', description: cat?.description || '' }); setErr(''); setModal({ type: 'form', cat }) }
  const run = async (fn, msg) => {
    setBusy(true)
    try { await fn(); toast.success(msg); setModal(null); reload() } catch (x) { toast.error(x.message) } finally { setBusy(false) }
  }
  const save = (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setErr('Le nom est obligatoire.')
    const dup = data.some((c) => c.name.toLowerCase() === f.name.trim().toLowerCase() && c._id !== modal.cat?._id)
    if (dup) return setErr('Cette catégorie existe déjà.')
    const d = { name: f.name.trim(), description: f.description }
    run(() => (modal.cat ? categoryService.update(modal.cat._id, d) : categoryService.create(d)), modal.cat ? 'Catégorie modifiée' : 'Catégorie ajoutée')
  }

  return (
    <>
      <PageHeader title="Catégories" subtitle="Stockées en base, jamais codées en dur." action={<Button icon={Plus} onClick={() => openForm()}>Nouvelle catégorie</Button>} />
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : data.length === 0 ? <EmptyState icon={Tags} title="Aucune catégorie" text="Créez votre première catégorie." /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c) => (
            <Card key={c._id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/inventaire?categorie=${encodeURIComponent(c.name)}`} className="block truncate font-display font-semibold hover:text-primary">{c.name}</Link>
                <p className="text-sm text-ink-soft">{c.productCount} produit{c.productCount > 1 ? 's' : ''}</p>
              </div>
              <div className="flex gap-1">
                <button aria-label={`Modifier ${c.name}`} onClick={() => openForm(c)} className="rounded-lg p-2 text-ink-soft hover:bg-canvas hover:text-primary"><Pencil size={18} /></button>
                <button aria-label={`Archiver ${c.name}`} onClick={() => setModal({ type: 'archive', cat: c })} className="rounded-lg p-2 text-ink-soft hover:bg-canvas hover:text-danger"><Archive size={18} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {modal?.type === 'form' && (
        <Modal title={modal.cat ? 'Modifier la catégorie' : 'Nouvelle catégorie'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4" noValidate>
            <Field label="Nom *" error={err}><input autoFocus className={inputCls(err)} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="Description"><textarea className={inputCls()} rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <Button type="submit" className="w-full" disabled={busy} icon={busy ? Loader2 : undefined}>Enregistrer</Button>
          </form>
        </Modal>
      )}
      {modal?.type === 'archive' && (
        <Modal title="Archiver la catégorie ?" onClose={() => setModal(null)}>
          <p className="text-sm text-ink-soft">« {modal.cat.name} » ne sera plus proposée. Ses {modal.cat.productCount} produit(s) et leur historique sont conservés.</p>
          <div className="mt-5 flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setModal(null)}>Annuler</Button>
            <Button className="flex-1 !bg-danger hover:!bg-red-700" disabled={busy} onClick={() => run(() => categoryService.archive(modal.cat._id), 'Catégorie archivée')}>Archiver</Button>
          </div>
        </Modal>
      )}
    </>
  )
}
