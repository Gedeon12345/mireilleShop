import { Footprints, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/90 px-4 py-3 backdrop-blur pt-[calc(0.75rem+env(safe-area-inset-top))] lg:px-10">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white"><Footprints size={17} /></span>
        <span className="font-display font-bold">Mireille Shop</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-ink-soft sm:block">{user.name}</span>
        <button aria-label="Se déconnecter" title="Se déconnecter" onClick={logout} className="rounded-lg p-2 text-ink-soft hover:bg-canvas hover:text-danger"><LogOut size={19} /></button>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-white">{user.name[0]}</span>
      </div>
    </header>
  )
}
