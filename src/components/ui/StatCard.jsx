import { motion } from 'framer-motion'
import Card from './Card'

const tones = { default: 'text-ink', warning: 'text-warning', danger: 'text-danger' }

export default function StatCard({ label, value, hint, icon: Icon, tone = 'default', hero = false, index = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.25 }}
      className={hero ? 'col-span-2 lg:col-span-1' : ''}>
      <Card className={`h-full ${hero ? '!border-primary !bg-primary text-white' : ''}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${hero ? 'text-violet-100' : 'text-ink-soft'}`}>{label}</span>
          {Icon && <Icon size={18} className={hero ? 'text-violet-200' : 'text-ink-soft'} />}
        </div>
        <p className={`mt-2 font-display text-3xl font-bold ${hero ? '' : tones[tone]} ${hero ? 'sm:text-4xl' : ''}`}>{value}</p>
        {hint && <p className={`mt-1 text-xs ${hero ? 'text-violet-100' : 'text-ink-soft'}`}>{hint}</p>}
      </Card>
    </motion.div>
  )
}
