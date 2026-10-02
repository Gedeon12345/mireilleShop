import { NavLink } from 'react-router-dom'
import { mobileTabs } from './navigation'

export default function MobileNav() {
  return (
    <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface/95 px-1 pt-1.5 backdrop-blur pb-[calc(0.375rem+env(safe-area-inset-bottom))] lg:hidden">
      {mobileTabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end}
          className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium ${isActive ? 'text-primary' : 'text-ink-soft'}`}>
          <Icon size={22} />{label}
        </NavLink>
      ))}
    </nav>
  )
}
