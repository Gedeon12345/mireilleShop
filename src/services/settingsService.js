import api, { USE_MOCK } from './api'
import { getThreshold } from '../utils/format'
import { wait } from './delay'

export const settingsService = {
  // Infos "boutique en ligne" (numéro WhatsApp, adresse, livraison)
  getAll: () => (USE_MOCK ? wait({ lowStockThreshold: getThreshold(), shopName: 'Mireille Shop', whatsappNumber: '', shopAddress: '', deliveryInfo: '' }) : api.get('/settings')),
  updateShop: (d) => (USE_MOCK ? wait(d) : api.put('/settings', d)),
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
