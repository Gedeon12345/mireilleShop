import { useRef, useState } from 'react'
import { ImagePlus, RefreshCw, Trash2, Loader2 } from 'lucide-react'
import { compressImage } from '../../utils/image'

export default function ImagePicker({ value, onChange }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setErr('')
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setErr('Format accepté : JPG, PNG ou WebP.')
    if (file.size > 10 * 1024 * 1024) return setErr('Image trop lourde (10 Mo maximum).')
    setBusy(true)
    try { onChange(await compressImage(file)) } catch { setErr('Impossible de lire cette image.') } finally { setBusy(false) }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">Photo <span className="font-normal text-ink-soft">(facultative)</span></span>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pick} />
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-line">
          <img src={value} alt="Aperçu du produit" className="h-48 w-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button type="button" onClick={() => ref.current.click()} className="flex items-center gap-1.5 rounded-lg bg-surface/95 px-3 py-1.5 text-xs font-semibold shadow"><RefreshCw size={14} />Changer</button>
            <button type="button" onClick={() => onChange(null)} className="flex items-center gap-1.5 rounded-lg bg-surface/95 px-3 py-1.5 text-xs font-semibold text-danger shadow"><Trash2 size={14} />Retirer</button>
          </div>
        </div>
      ) : (
        <button type="button" disabled={busy} onClick={() => ref.current.click()}
          className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed border-line bg-canvas py-6 text-sm text-ink-soft hover:border-primary hover:text-primary">
          {busy ? <Loader2 className="animate-spin" size={22} /> : <ImagePlus size={22} />}
          <span className="font-medium">{busy ? 'Traitement…' : 'Ajouter une photo'}</span>
          <span className="text-xs">JPG, PNG ou WebP · sans photo, le produit reste valide</span>
        </button>
      )}
      {err && <p className="mt-1 text-xs text-danger">{err}</p>}
    </div>
  )
}
