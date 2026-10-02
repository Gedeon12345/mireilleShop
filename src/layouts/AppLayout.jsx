import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import MobileNav from '../components/layout/MobileNav'

export default function AppLayout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:px-10 lg:pb-12 lg:pt-8">
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
