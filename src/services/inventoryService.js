import api, { USE_MOCK } from './api'
import { mockProducts, mockSales } from './mockData'
import { wait } from './delay'

const mockMoves = []

export const inventoryService = {
  movements: (productId) => USE_MOCK
    ? wait([
        ...mockMoves.filter((m) => m.product === productId),
        ...mockSales.flatMap((s) => s.items.filter((i) => i.product === productId).map((i) => ({
          _id: `${s._id}-${i.size}-${i.color}`, type: s.status === 'cancelled' ? 'sale_cancel' : 'sale', size: i.size, color: i.color,
          quantity: -i.quantity, previousQuantity: null, newQuantity: null, reason: s.reference, createdAt: s.createdAt,
        }))),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    : api.get('/inventory/movements', { params: { product: productId } }),

  // Ajustement manuel : toujours tracé dans les mouvements de stock
  adjust: (d) => {
    if (!USE_MOCK) return api.post('/inventory/adjustment', d)
    const v = mockProducts.find((p) => p._id === d.product).sizes.find((s) => s.size === d.size && s.color === d.color)
    const prev = v.quantity
    v.quantity = d.newQuantity
    mockMoves.unshift({ _id: `m${Date.now()}`, product: d.product, type: 'adjustment', size: d.size, color: d.color, quantity: d.newQuantity - prev, previousQuantity: prev, newQuantity: d.newQuantity, reason: d.reason, createdAt: new Date().toISOString() })
    return wait({ ok: true })
  },
}
