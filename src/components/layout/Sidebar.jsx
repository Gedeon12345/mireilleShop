import { NavLink } from 'react-router-dom'
import { Footprints } from 'lucide-react'
import { navGroups } from './navigation'
import { useAuth } from '../../context/AuthContext'

const link = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary-soft text-primary font-semibold' : 'text-ink-soft hover:bg-canvas hover:text-ink'}`

export default function Sidebar() {
  const { isAdmin } = useAuth()
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col gap-1 overflow-y-auto border-r border-line bg-surface px-4 py-5 lg:flex">
      <div className="mb-5 flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white"><Footprints size={20} /></span>
        <span className="font-display text-lg font-bold">Mireille Shop</span>
      </div>
      {navGroups.map((g, i) => {
        const items = g.items.filter((it) => isAdmin || !it.adminOnly)
        if (!items.length) return null
        return (
          <nav key={i} className="mb-2" aria-label={g.title || 'Principal'}>
            {g.title && <p className="px-3 pb-1 pt-3 text-xs font-semibold text-ink-soft">{g.title}</p>}
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={link}><Icon size={18} />{label}</NavLink>
            ))}
          </nav>
        )
      })}
    </aside>
  )
}
