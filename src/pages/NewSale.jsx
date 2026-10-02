import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Minus, Plus, CheckCircle2, Loader2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Field, { inputCls } from '../components/ui/Field'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'
import { salesService } from '../services/salesService'
import { formatFCFA, totalStock, groupByColor, variantKey } from '../utils/format'

const Line = ({ label, value }) => (
  <div className="flex justify-between gap-3 py-1.5 text-sm"><span className="text-ink-soft">{label}</span><span className="text-right font-medium">{value}</span></div>
)

export default function NewSale() {
  const [params] = useSearchParams()
  const { data, loading, error, reload } = useFetch(productService.list)
  const [pid, setPid] = useState(params.get('produit') || '')
  const [vk, setVk] = useState('')
  const [qty, setQty] = useState(1)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)

  const sellable = useMemo(() => (data || []).filter((p) => totalStock(p) > 0), [data])
  const product = sellable.find((p) => p._id === pid)
  const variant = product?.sizes.find((s) => variantKey(s) === vk)
  const stock = variant?.quantity || 0
  const q = Number(qty)
  const qErr = !variant ? '' : !Number.isInteger(q) || q < 1 ? 'La quantité doit être d’au moins 1.' : q > stock ? `Stock insuffisant : ${stock} paire(s) disponible(s).` : ''
  const ready = !!variant && !qErr
  const total = ready ? q * product.price : 0

  const submit = async () => {
    setBusy(true)
    try {
      const sale = await salesService.create({ items: [{ product: pid, size: variant.size, color: variant.color, quantity: q }] })
      toast.success('Vente enregistrée')
      setDone({ ref: sale.reference, name: product.name, size: variant.size, color: variant.color, left: stock - q })
      setVk(''); setQty(1); reload()
    } catch (e) { toast.error(e.message) } finally { setBusy(false); setConfirm(false) }
  }

  if (error) return <ErrorState message={error} onRetry={reload} />
  return (
    <>
      <PageHeader title="Nouvelle vente" subtitle="Le stock est mis à jour automatiquement après validation." />
      {done && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900" role="status">
          <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={20} />
          <div className="flex-1">
            <p className="font-semibold">Vente {done.ref} enregistrée</p>
            <p>{done.name}, pointure {done.size} {done.color} : il reste {done.left} paire{done.left > 1 ? 's' : ''}.</p>
            <Link to="/ventes" className="mt-1 inline-block font-semibold text-primary underline">Voir l’historique</Link>
          </div>
        </div>
      )}
      {loading ? <Skeleton className="h-80" /> : sellable.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Aucun produit en stock" text="Ajoutez des produits ou du stock pour enregistrer une vente." />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_340px]">
          <Card className="space-y-4">
            <Field label="Produit">
              <select className={inputCls()} value={pid} onChange={(e) => { setPid(e.target.value); setVk(''); setQty(1) }}>
                <option value="">Choisir un produit…</option>
                {sellable.map((p) => <option key={p._id} value={p._id}>{p.name} · {formatFCFA(p.price)}</option>)}
              </select>
            </Field>
            {product && (
              <Field label="Pointure et couleur">
                <select className={inputCls()} value={vk} onChange={(e) => { setVk(e.target.value); setQty(1) }}>
                  <option value="">Choisir…</option>
                  {groupByColor(product).map((g) => (
                    <optgroup key={g.color} label={g.color}>
                      {g.sizes.map((s) => (
                        <option key={variantKey(s)} value={variantKey(s)} disabled={s.quantity === 0}>
                          Pointure {s.size} · {s.quantity === 0 ? 'rupture' : `${s.quantity} en stock`}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
            )}
            {variant && (
              <Field label="Quantité vendue" error={qErr}>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Diminuer" onClick={() => setQty(Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-xl border border-line hover:bg-canvas"><Minus size={18} /></button>
                  <input className={`${inputCls(qErr)} text-center`} type="number" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
                  <button type="button" aria-label="Augmenter" onClick={() => setQty(Math.min(stock, q + 1))} className="grid h-11 w-11 place-items-center rounded-xl border border-line hover:bg-canvas"><Plus size={18} /></button>
                </div>
              </Field>
            )}
          </Card>
          <Card className="lg:sticky lg:top-24">
            <h2 className="mb-2 font-semibold">Récapitulatif</h2>
            {product ? (
              <>
                <Line label="Produit" value={product.name} />
                <Line label="Pointure" value={variant ? variant.size : '—'} />
                <Line label="Couleur" value={variant ? variant.color : '—'} />
                <Line label="Quantité" value={ready ? q : '—'} />
                <Line label="Prix unitaire" value={formatFCFA(product.price)} />
                <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3"><span className="font-semibold">Total</span><span className="font-display text-2xl font-bold text-primary">{formatFCFA(total)}</span></div>
              </>
            ) : <p className="text-sm text-ink-soft">Sélectionnez un produit pour voir le détail.</p>}
            <Button className="mt-4 w-full" disabled={!ready} onClick={() => setConfirm(true)}>Valider la vente</Button>
          </Card>
        </div>
      )}
      {confirm && ready && (
        <Modal title="Confirmer la vente ?" onClose={() => !busy && setConfirm(false)}>
          <Line label="Produit" value={product.name} />
          <Line label="Pointure / couleur" value={`${variant.size} · ${variant.color}`} />
          <Line label="Quantité" value={q} />
          <div className="flex justify-between border-t border-line pt-3 font-semibold"><span>Total</span><span>{formatFCFA(total)}</span></div>
          <div className="mt-5 flex gap-2">
            <Button variant="ghost" className="flex-1" disabled={busy} onClick={() => setConfirm(false)}>Retour</Button>
            <Button className="flex-1" disabled={busy} icon={busy ? Loader2 : undefined} onClick={submit}>Confirmer</Button>
          </div>
        </Modal>
      )}
    </>
  )
}
