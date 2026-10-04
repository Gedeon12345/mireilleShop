import { useState } from 'react'
import { UserPlus, KeyRound, UserX, UserCheck, Users, Loader2 } from 'lucide-react'
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
import { userService } from '../services/userService'

export default function Team() {
  const { data, loading, error, reload } = useFetch(userService.list)
  const [modal, setModal] = useState(null) // {type:'create'} | {type:'reset', user}
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const open = (m) => { setF({ name: '', email: '', password: '' }); setErr(''); setModal(m) }
  const run = async (fn, ok) => {
    setBusy(true)
    try { await fn(); toast.success(ok); setModal(null); reload() } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  const create = (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setErr('Le nom est obligatoire.')
    if (!/\S+@\S+\.\S+/.test(f.email)) return setErr('Email invalide.')
    if (f.password.length < 8) return setErr('Le mot de passe doit contenir au moins 8 caractères.')
    run(() => userService.create({ name: f.name.trim(), email: f.email.trim(), password: f.password }), 'Compte créé')
  }
  const reset = (e) => {
    e.preventDefault()
    if (f.password.length < 8) return setErr('Le mot de passe doit contenir au moins 8 caractères.')
    run(() => userService.resetPassword(modal.user._id, f.password), 'Mot de passe réinitialisé')
  }
  const toggle = async (u) => {
    try { await userService.update(u._id, { isActive: !u.isActive }); toast.success(u.isActive ? 'Compte désactivé' : 'Compte réactivé'); reload() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <PageHeader title="Équipe" subtitle="Les vendeurs peuvent enregistrer des ventes et consulter le stock."
        action={<Button icon={UserPlus} onClick={() => open({ type: 'create' })}>Ajouter</Button>} />
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : data.length === 0 ? (
        <EmptyState icon={Users} title="Aucun employé" text="Créez un compte pour qu’une vendeuse puisse enregistrer les ventes depuis son téléphone." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((u) => (
            <Card key={u._id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">{u.name}</p>
                  <p className="truncate text-sm text-ink-soft">{u.email}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{u.isActive ? 'Actif' : 'Désactivé'}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="ghost" icon={KeyRound} onClick={() => open({ type: 'reset', user: u })}>Mot de passe</Button>
                <Button variant="ghost" icon={u.isActive ? UserX : UserCheck} className={u.isActive ? '!text-danger' : ''} onClick={() => toggle(u)}>{u.isActive ? 'Désactiver' : 'Réactiver'}</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal?.type === 'create' && (
        <Modal title="Nouvel employé" onClose={() => !busy && setModal(null)}>
          <form onSubmit={create} className="space-y-4" noValidate>
            <Field label="Nom"><input className={inputCls()} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="Email (pour se connecter)"><input className={inputCls()} type="email" autoCapitalize="none" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
            <Field label="Mot de passe provisoire" hint="8 caractères minimum. Transmettez-le à l’employé, qui pourra le changer dans Paramètres." error={err}>
              <input className={inputCls(err)} type="text" autoComplete="off" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            </Field>
            <Button type="submit" className="w-full" disabled={busy} icon={busy ? Loader2 : undefined}>Créer le compte</Button>
          </form>
        </Modal>
      )}
      {modal?.type === 'reset' && (
        <Modal title={`Mot de passe de ${modal.user.name}`} onClose={() => !busy && setModal(null)}>
          <form onSubmit={reset} className="space-y-4" noValidate>
            <Field label="Nouveau mot de passe" hint="8 caractères minimum." error={err}>
              <input className={inputCls(err)} type="text" autoComplete="off" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            </Field>
            <Button type="submit" className="w-full" disabled={busy} icon={busy ? Loader2 : undefined}>Enregistrer</Button>
          </form>
        </Modal>
      )}
    </>
  )
}
