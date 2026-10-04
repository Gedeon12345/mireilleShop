import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Plus, ShoppingBag, Menu, Tags, AlertTriangle, History, Settings, Users, Archive, LogOut, ChevronRight } from 'lucide-react'
import Modal from '../ui/Modal'
import { useAuth } from '../../context/AuthContext'

const tab = (active) =>
  `flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium ${active ? 'text-primary' : 'text-ink-soft'}`

const ADMIN_MENU = [
  { to: '/inventaire/categories', label: 'Catégories', icon: Tags },
  { to: '/inventaire/stock-faible', label: 'Stock faible', icon: AlertTriangle },
  { to: '/inventaire/archives', label: 'Produits archivés', icon: Archive },
  { to: '/ventes', label: 'Historique des ventes', icon: History },
  { to: '/equipe', label: 'Équipe', icon: Users },
  { to: '/parametres', label: 'Paramètres', icon: Settings },
]
const EMPLOYEE_MENU = [
  { to: '/inventaire/stock-faible', label: 'Stock faible', icon: AlertTriangle },
  { to: '/parametres', label: 'Mon compte', icon: Settings },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { logout, isAdmin } = useAuth()
  const MENU = isAdmin ? ADMIN_MENU : EMPLOYEE_MENU
  const moreActive = MENU.some((m) => (m.to === '/ventes' ? pathname === '/ventes' : pathname.startsWith(m.to)))
  // Bouton central : la propriétaire ajoute un produit, l'employé enregistre une vente
  const center = isAdmin ? { to: '/inventaire/nouveau', label: 'Ajouter', icon: Plus } : { to: '/ventes/nouvelle', label: 'Vendre', icon: ShoppingBag }
  const CIcon = center.icon

  return (
    <>
      <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-20 flex items-end border-t border-line bg-surface/95 px-1 pt-1.5 backdrop-blur pb-[calc(0.375rem+env(safe-area-inset-bottom))] lg:hidden">
        <NavLink to="/" end className={({ isActive }) => tab(isActive)}><LayoutDashboard size={22} />Accueil</NavLink>
        <NavLink to="/inventaire" end className={({ isActive }) => tab(isActive)}><Package size={22} />Inventaire</NavLink>
        <Link to={center.to} aria-label={center.label} className="flex flex-1 flex-col items-center gap-0.5 pb-1.5 text-[11px] font-semibold text-primary">
          <span className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-lg ring-4 ring-canvas"><CIcon size={28} /></span>
          {center.label}
        </Link>
        {isAdmin
          ? <NavLink to="/ventes/nouvelle" className={({ isActive }) => tab(isActive)}><ShoppingBag size={22} />Vente</NavLink>
          : <NavLink to="/ventes" end className={({ isActive }) => tab(isActive)}><History size={22} />Mes ventes</NavLink>}
        <button type="button" onClick={() => setOpen(true)} className={tab(moreActive)}><Menu size={22} />Menu</button>
      </nav>

      {open && (
        <Modal title="Menu" onClose={() => setOpen(false)}>
          <div className="-mx-2 space-y-1">
            {MENU.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-canvas">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><Icon size={18} /></span>
                <span className="flex-1">{label}</span>
                <ChevronRight size={18} className="text-ink-soft" />
              </Link>
            ))}
            <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-danger hover:bg-canvas">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-50"><LogOut size={18} /></span>
              Se déconnecter
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
