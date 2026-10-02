import api, { USE_MOCK } from './api'
import { mockProducts, mockSales } from './mockData'
import { wait } from './delay'

const findVariant = (it) => {
  const p = mockProducts.find((x) => x._id === it.product)
  return { p, v: p?.sizes.find((s) => s.size === it.size && s.color === it.color) }
}

export const salesService = {
  list: (params) => (USE_MOCK ? wait([...mockSales]) : api.get('/sales', { params })),

  create: async ({ items }) => {
    if (!USE_MOCK) return api.post('/sales', { items })
    await wait(null, 400)
    // 1) tout valider, 2) puis déduire : une seule déduction, jamais de vente partielle
    const lines = items.map((it) => {
      const { p, v } = findVariant(it)
      if (!p || !p.isActive) throw new Error('Produit introuvable ou désactivé.')
      if (!v) throw new Error('Pointure ou couleur introuvable.')
      if (!Number.isInteger(it.quantity) || it.quantity < 1) throw new Error('Quantité invalide.')
      if (it.quantity > v.quantity) throw new Error(`Stock insuffisant : ${v.quantity} paire(s) disponible(s).`)
      return { p, v, it }
    })
    lines.forEach(({ v, it }) => { v.quantity -= it.quantity })
    const n = Math.max(0, ...mockSales.map((s) => Number(s.reference.slice(3)))) + 1
    const sale = {
      _id: `s${n}`, reference: `VT-${String(n).padStart(4, '0')}`,
      items: lines.map(({ p, it }) => ({ product: p._id, productName: p.name, size: it.size, color: it.color, quantity: it.quantity, unitPrice: p.price, total: it.quantity * p.price })),
      status: 'completed', createdBy: 'Administrateur', createdAt: new Date().toISOString(),
    }
    sale.totalAmount = sale.items.reduce((a, i) => a + i.total, 0)
    mockSales.unshift(sale)
    return sale
  },

  cancel: async (id) => {
    if (!USE_MOCK) return api.post(`/sales/${id}/cancel`)
    await wait(null, 400)
    const sale = mockSales.find((s) => s._id === id)
    if (!sale || sale.status !== 'completed') throw new Error('Cette vente ne peut pas être annulée.')
    sale.items.forEach((it) => { const { v } = findVariant(it); if (v) v.quantity += it.quantity })
    sale.status = 'cancelled'
    sale.cancelledAt = new Date().toISOString()
    return sale
  },
}
