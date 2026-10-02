import api, { USE_MOCK } from './api'
import { getThreshold } from '../utils/format'
import { wait } from './delay'

export const settingsService = {
  get: async () => {
    const t = USE_MOCK ? getThreshold() : (await api.get('/settings')).lowStockThreshold
    localStorage.setItem('threshold', String(t))
    return { lowStockThreshold: t }
  },
  update: async (t) => {
    if (USE_MOCK) await wait(null, 250); else await api.put('/settings', { lowStockThreshold: t })
    localStorage.setItem('threshold', String(t))
    return { lowStockThreshold: t }
  },
}
