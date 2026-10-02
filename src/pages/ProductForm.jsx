import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Field, { inputCls } from '../components/ui/Field'
import ImagePicker from '../components/ui/ImagePicker'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import { totalStock } from '../utils/format'

const COLORS = ['Noir', 'Blanc', 'Marron', 'Beige', 'Rouge', 'Rose', 'Bleu', 'Vert', 'Gris', 'Camel', 'Doré', 'Argenté']
const GENDERS = ['Homme', 'Femme', 'Enfant', 'Mixte']
const EMPTY = { name: '', category: '', gender: 'Mixte', price: '', description: '', sizes: [{ size: '', color: '', quantity: '' }] }

export default function ProductForm() {
  const { id } = useParams()
  const edit = !!id
  const nav = useNavigate()
  const cats = useFetch(categoryService.list)
  const prod = useFetch(() => (edit ? productService.get(id) : Promise.resolve(null)), [id])
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [photo, setPhoto] = useState({ file: null, preview: '', removed: false })

  useEffect(() => {
    if (prod.data) setPhoto({ file: null, preview: prod.data.image || '', removed: false })
    if (prod.data) setF({ ...prod.data, category: prod.data.category._id, sizes: prod.data.sizes.map((s) => ({ ...s })) })
  }, [prod.data])

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const setSize = (i, k, v) => set('sizes', f.sizes.map((s, j) => (j === i ? { ...s, [k]: v } : s)))

  const validate = () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Le nom est obligatoire.'
    if (!f.category) e.category = 'Choisissez une catégorie.'
    if (!(Number(f.price) > 0)) e.price = 'Le prix doit être supérieur à 0.'
    const seen = new Set()
    const rows = f.sizes.map((s) => {
      if (!(Number(s.size) > 0)) return 'Pointure invalide.'
      if (!s.color.trim()) return 'Indiquez la couleur.'
      const key = `${Number(s.size)}|${s.color.trim().toLowerCase()}`
      if (seen.has(key)) return 'Cette pointure existe déjà dans cette couleur.'
      seen.add(key)
      if (s.quantity === '' || !Number.isInteger(Number(s.quantity)) || Number(s.quantity) < 0) return 'Quantité : entier ≥ 0.'
      return null
    })
    if (rows.some(Boolean)) e.sizes = rows
    return e
  }
  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return toast.error('Corrigez les champs en rouge.')
    setBusy(true)
    try {
      edit ? await productService.update(id, f, photo) : await productService.create(f, photo)
      toast.success(edit ? 'Produit modifié' : 'Produit ajouté')
      nav('/inventaire')
    } catch (x) { toast.error(x.message) } finally { setBusy(false) }
  }

  if (cats.error || prod.error) return <ErrorState message={cats.error || prod.error} onRetry={() => { cats.reload(); prod.reload() }} />
  if (cats.loading || prod.loading) return <Skeleton className="h-96" />

  const total = totalStock({ sizes: f.sizes.map((s) => ({ quantity: Number(s.quantity) || 0 })) })
  return (
    <form onSubmit={submit} noValidate>
      <PageHeader title={edit ? 'Modifier le produit' : 'Ajouter un produit'} subtitle="Le prix d’achat n’est pas géré en V1."
        action={<Button type="button" variant="ghost" icon={ArrowLeft} onClick={() => nav(-1)}>Retour</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-semibold">Informations</h2>
          <ImagePicker value={photo.preview} onChange={(p) => setPhoto(p ? { file: p.file, preview: p.preview, removed: false } : { file: null, preview: '', removed: true })} />
          <Field label="Nom du modèle *" error={errors.name}><input className={inputCls(errors.name)} value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Catégorie *" error={errors.category}>
              <select className={inputCls(errors.category)} value={f.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Choisir…</option>{cats.data.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Genre *"><select className={inputCls()} value={f.gender} onChange={(e) => set('gender', e.target.value)}>{GENDERS.map((g) => <option key={g}>{g}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix de vente (FCFA) *" error={errors.price}><input className={inputCls(errors.price)} inputMode="numeric" type="number" min="0" value={f.price} onChange={(e) => set('price', e.target.value)} /></Field>
            <Field label="Stock total"><div className={`${inputCls()} bg-canvas font-semibold`}>{total} paires</div></Field>
          </div>
          <Field label="Description"><textarea className={inputCls()} rows={3} value={f.description} onChange={(e) => set('description', e.target.value)} /></Field>
        </Card>
        <Card className="space-y-3">
          <div className="flex items-center justify-between"><h2 className="font-semibold">Pointures, couleurs et quantités *</h2><span className="text-sm font-semibold text-primary">{total} paires</span></div>
          <datalist id="colors">{COLORS.map((c) => <option key={c} value={c} />)}</datalist>
          {f.sizes.map((s, i) => (
            <div key={i} className="rounded-xl border border-line p-2.5">
              <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[80px_1fr_90px_auto]">
                <input className={inputCls(errors.sizes?.[i])} type="number" inputMode="numeric" placeholder="Pointure" aria-label="Pointure" value={s.size} onChange={(e) => setSize(i, 'size', e.target.value)} />
                <input className={inputCls(errors.sizes?.[i])} list="colors" placeholder="Couleur" aria-label="Couleur" value={s.color} onChange={(e) => setSize(i, 'color', e.target.value)} />
                <input className={inputCls(errors.sizes?.[i])} type="number" inputMode="numeric" placeholder="Quantité" aria-label="Quantité" value={s.quantity} onChange={(e) => setSize(i, 'quantity', e.target.value)} />
                <button type="button" aria-label="Supprimer la ligne" disabled={f.sizes.length === 1} onClick={() => set('sizes', f.sizes.filter((_, j) => j !== i))}
                  className="justify-self-end rounded-lg p-2 text-ink-soft hover:bg-canvas hover:text-danger disabled:opacity-30"><Trash2 size={18} /></button>
              </div>
              {errors.sizes?.[i] && <p className="mt-1.5 text-xs text-danger">{errors.sizes[i]}</p>}
            </div>
          ))}
          <Button type="button" variant="ghost" icon={Plus} onClick={() => set('sizes', [...f.sizes, { size: '', color: '', quantity: '' }])}>Ajouter une pointure / couleur</Button>
        </Card>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => nav('/inventaire')}>Annuler</Button>
        <Button type="submit" disabled={busy} icon={busy ? Loader2 : undefined}>{edit ? 'Enregistrer' : 'Créer le produit'}</Button>
      </div>
    </form>
  )
}
