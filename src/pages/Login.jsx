import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Footprints, Mail, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import Field, { inputCls } from '../components/ui/Field'
import Button from '../components/ui/Button'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const nav = useNavigate()
  const from = useLocation().state?.from || '/'
  const [f, setF] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  if (isAuthenticated) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault()
    if (!f.email || !f.password) return setErr('Renseignez votre email et votre mot de passe.')
    setBusy(true); setErr('')
    try { await login(f.email, f.password); toast.success('Connexion réussie'); nav(from, { replace: true }) }
    catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-white lg:flex">
        <span className="flex items-center gap-3 font-display text-xl font-bold"><Footprints /> Stock Boutique</span>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-tight">Votre inventaire à jour, sans recompter.</h1>
          <p className="mt-4 max-w-sm text-violet-100">Chaque vente met le stock à jour automatiquement.</p>
        </div>
        <span className="text-sm text-violet-200">Gestion interne · FCFA</span>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5" noValidate>
          <div>
            <h2 className="text-2xl font-bold">Connexion</h2>
            <p className="mt-1 text-sm text-ink-soft">Espace réservé à la propriétaire.</p>
          </div>
          <Field label="Email">
            <div className="relative"><Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input className={`${inputCls(err)} pl-10`} type="email" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          </Field>
          <Field label="Mot de passe" error={err}>
            <div className="relative"><Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input className={`${inputCls(err)} pl-10`} type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
          </Field>
          <Button type="submit" className="w-full" disabled={busy} icon={busy ? Loader2 : undefined}>{busy ? 'Connexion…' : 'Se connecter'}</Button>
          {import.meta.env.VITE_USE_MOCK !== 'false' && <p className="rounded-xl bg-primary-soft p-3 text-xs text-primary">Mode démo : admin@boutique.cm / admin123</p>}
        </form>
      </div>
    </div>
  )
}
