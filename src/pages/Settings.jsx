import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Field, { inputCls } from '../components/ui/Field'
import StatusBadge from '../components/ui/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { settingsService } from '../services/settingsService'
import useFetch from '../hooks/useFetch'
import { getThreshold } from '../utils/format'

function useSubmit(fn, ok) {
  const [busy, setBusy] = useState(false)
  return [busy, async (e) => {
    e.preventDefault(); setBusy(true)
    try { await fn(); toast.success(ok) } catch (x) { toast.error(x.message) } finally { setBusy(false) }
  }]
}
const Save = ({ busy, children = 'Enregistrer' }) => <Button type="submit" disabled={busy} icon={busy ? Loader2 : undefined}>{children}</Button>

export default function Settings() {
  const { user, updateUser, logout, isAdmin } = useAuth()
  const [p, setP] = useState({ name: user.name, email: user.email })
  const [pw, setPw] = useState({ cur: '', next: '', conf: '' })
  const [th, setTh] = useState(getThreshold())
  const [pwErr, setPwErr] = useState('')
  const thErr = !Number.isInteger(Number(th)) || Number(th) < 1 ? 'Entrez un nombre entier supérieur ou égal à 1.' : ''

  const [b1, s1] = useSubmit(async () => {
    if (!p.name.trim() || !/\S+@\S+\.\S+/.test(p.email)) throw new Error('Nom ou email invalide.')
    updateUser(await authService.updateProfile(p))
  }, 'Compte mis à jour')
  const [b2, s2] = useSubmit(async () => {
    if (pw.next.length < 8) throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.')
    if (pw.next !== pw.conf) throw new Error('La confirmation ne correspond pas.')
    await authService.changePassword(pw.cur, pw.next); setPw({ cur: '', next: '', conf: '' })
  }, 'Mot de passe modifié')
  const [b3, s3] = useSubmit(async () => { if (thErr) throw new Error(thErr); await settingsService.update(Number(th)) }, 'Seuil enregistré')

  return (
    <>
      <PageHeader title="Paramètres" subtitle="Compte, sécurité et alertes de stock." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><form onSubmit={s1} className="space-y-4" noValidate>
          <h2 className="font-semibold">Mon compte <span className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">{isAdmin ? 'Propriétaire' : 'Vendeur'}</span></h2>
          <Field label="Nom"><input className={inputCls()} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls()} type="email" value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} /></Field>
          <Save busy={b1} />
        </form></Card>
        <Card><form onSubmit={s2} className="space-y-4" noValidate>
          <h2 className="font-semibold">Mot de passe</h2>
          <Field label="Mot de passe actuel"><input className={inputCls()} type="password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nouveau (8 caractères min.)"><input className={inputCls(pwErr)} type="password" autoComplete="new-password" value={pw.next} onChange={(e) => { setPw({ ...pw, next: e.target.value }); setPwErr('') }} /></Field>
            <Field label="Confirmation"><input className={inputCls(pwErr)} type="password" autoComplete="new-password" value={pw.conf} onChange={(e) => setPw({ ...pw, conf: e.target.value })} /></Field>
          </div>
          <Save busy={b2}>Modifier le mot de passe</Save>
        </form></Card>
        <Card><form onSubmit={s3} className="space-y-4" noValidate>
          <h2 className="font-semibold">Seuil de stock</h2>
          <Field label="Seuil de stock faible (paires par pointure et couleur)" error={thErr}><input className={inputCls(thErr)} type="number" inputMode="numeric" min="1" value={th} disabled={!isAdmin} onChange={(e) => setTh(e.target.value)} /></Field>
          <div className="flex flex-wrap gap-2 text-xs"><StatusBadge status="ok" /><span className="self-center text-ink-soft">plus de {th || '…'}</span><StatusBadge status="low" /><span className="self-center text-ink-soft">de 1 à {th || '…'}</span><StatusBadge status="out" /><span className="self-center text-ink-soft">0</span></div>
          {isAdmin ? <Save busy={b3} /> : <p className="text-xs text-ink-soft">Seule la propriétaire peut modifier le seuil.</p>}
        </form></Card>
        {isAdmin && <ShopCard />}
        <Card className="space-y-4">
          <h2 className="font-semibold">Application</h2>
          <div className="flex justify-between text-sm"><span className="text-ink-soft">Devise</span><b>FCFA (XAF)</b></div>
          <Button variant="ghost" icon={LogOut} className="w-full !text-danger" onClick={logout}>Se déconnecter</Button>
        </Card>
      </div>
    </>
  )
}

function ShopCard() {
  const { data, loading, error } = useFetch(settingsService.getAll)
  return (
    <Card className="lg:col-span-2">
      <h2 className="font-semibold">Boutique en ligne</h2>
      <p className="mb-4 mt-1 text-sm text-ink-soft">Ces informations s’affichent sur le site pour les clientes.</p>
      {error ? <p className="text-sm text-danger">{error}</p> : loading ? <p className="text-sm text-ink-soft">Chargement…</p> : <ShopForm initial={data} />}
    </Card>
  )
}

function ShopForm({ initial }) {
  const [f, setF] = useState({ shopName: initial.shopName || '', whatsappNumber: initial.whatsappNumber || '', shopAddress: initial.shopAddress || '', deliveryInfo: initial.deliveryInfo || '' })
  const [busy, submit] = useSubmit(async () => { await settingsService.updateShop(f) }, 'Informations enregistrées')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <Field label="Nom de la boutique"><input className={inputCls()} value={f.shopName} onChange={set('shopName')} /></Field>
      <Field label="Numéro WhatsApp des commandes" hint="Avec l’indicatif du pays, sans + ni espaces. Exemple : 237690000000">
        <input className={inputCls()} inputMode="numeric" value={f.whatsappNumber} onChange={set('whatsappNumber')} />
      </Field>
      <Field label="Adresse de la boutique (retrait)"><input className={inputCls()} value={f.shopAddress} onChange={set('shopAddress')} /></Field>
      <Field label="Livraison : zones, frais, délais"><textarea className={inputCls()} rows={3} value={f.deliveryInfo} onChange={set('deliveryInfo')} /></Field>
      <div className="sm:col-span-2"><Save busy={busy} /></div>
    </form>
  )
}
