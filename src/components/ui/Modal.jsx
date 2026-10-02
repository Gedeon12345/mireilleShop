import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/50 sm:items-center" onClick={onClose}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}
        className="max-h-[88vh] w-full max-w-md overflow-auto rounded-t-3xl bg-surface p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button aria-label="Fermer" onClick={onClose} className="rounded-lg p-1.5 hover:bg-canvas"><X size={20} /></button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}
