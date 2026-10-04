import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import MobileNav from '../components/layout/MobileNav'
import Skeleton from '../components/ui/Skeleton'
import SlowHint from '../components/ui/SlowHint'
import { settingsService } from '../services/settingsService'

export default function AppLayout() {
  const { pathname } = useLocation()
  const [ready, setReady] = useState(false)

  // Charge le seuil de stock faible depuis le serveur avant d'afficher les écrans
  useEffect(() => { settingsService.get().catch(() => {}).finally(() => setReady(true)) }, [])

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:px-10 lg:pb-12 lg:pt-8">
          {!ready ? <><Skeleton className="h-64" /><SlowHint /></> : (
            <AnimatePresence mode="wait">
              <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <Outlet />
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
