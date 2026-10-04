import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Field, { inputCls } from './ui/Field'
import { inventoryService } from '../services/inventoryService'
import { groupByColor, variantKey } from '../utils/format'

const MODES = [['in', 'Réception de paires'], ['fix', 'Corriger le stock']]

export default function StockAdjustModal({ product, onClose, onDone }) {
  const [vk, setVk] = useState('')
  const [mode, setMode] = useState('in')
  const [n, setN] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const v = product.sizes.find((s) => variantKey(s) === vk)
  const num = Number(n)
  const valid = n !== '' && Number.isInteger(num) && (mode === 'in' ? num >= 1 : num >= 0)
  const reasonOk = reason.trim() === '' || reason.trim().length >= 3
  const next = v && valid ? (mode === 'in' ? v.quantity + num : num) : null

  const submit = async () => {
    setBusy(true)
    try {
      await inventoryService.adjust({
        product: product._id, size: v.size, color: v.color, newQuantity: next,
        reason: reason.trim() || (mode === 'in' ? 'Réapprovisionnement' : 'Correction d’inventaire'),
      })
      toast.success('Stock mis à jour')
      onDone()
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }

  return (
    <Modal title="Ajuster le stock" onClose={() => !busy && onClose()}>
      <p className="mb-4 text-sm text-ink-soft">{product.name}. Pour une nouvelle pointure ou couleur, utilisez « Modifier ».</p>
      <div className="space-y-4">
        <Field label="Pointure et couleur">
          <select className={inputCls()} value={vk} onChange={(e) => setVk(e.target.value)}>
            <option value="">Choisir…</option>
            {groupByColor(product).map((g) => (
              <optgroup key={g.color} label={g.color}>
                {g.sizes.map((s) => <option key={variantKey(s)} value={variantKey(s)}>Pointure {s.size} · {s.quantity} en stock</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
        <div className="flex gap-2">
          {MODES.map(([k, l]) => (
            <button key={k} type="button" onClick={() => setMode(k)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${mode === k ? 'border-primary bg-primary-soft text-primary' : 'border-line text-ink-soft'}`}>{l}</button>
          ))}
        </div>
        <Field label={mode === 'in' ? 'Nombre de paires reçues' : 'Quantité réelle en stock'}
          error={n !== '' && !valid ? (mode === 'in' ? 'Entrez un nombre entier d’au moins 1.' : 'Entrez un nombre entier, 0 ou plus.') : ''}>
          <input className={inputCls(n !== '' && !valid)} type="number" inputMode="numeric" min="0" value={n} onChange={(e) => setN(e.target.value)} />
        </Field>
        <Field label="Motif (facultatif)" error={reasonOk ? '' : '3 caractères minimum.'}>
          <input className={inputCls(!reasonOk)} placeholder={mode === 'in' ? 'Réapprovisionnement' : 'Correction d’inventaire'} value={reason} onChange={(e) => setReason(e.target.value)} />
        </Field>
        {next !== null && (
          <p className="flex items-center justify-center gap-2 rounded-xl bg-primary-soft py-2.5 font-display text-lg font-bold text-primary">
            {v.quantity} <ArrowRight size={18} /> {next} paires
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" disabled={busy} onClick={onClose}>Annuler</Button>
          <Button className="flex-1" disabled={busy || !v || !valid || !reasonOk} icon={busy ? Loader2 : undefined} onClick={submit}>Enregistrer</Button>
        </div>
      </div>
    </Modal>
  )
}
