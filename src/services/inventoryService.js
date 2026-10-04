import api, { USE_MOCK } from './api'
import { mockSales } from './mockData'
import { wait } from './delay'

export const inventoryService = {
  movements: (productId) => USE_MOCK
    ? wait(mockSales.flatMap((s) => s.items.filter((i) => i.product === productId).map((i) => ({
        _id: `${s._id}-${i.size}-${i.color}`, type: s.status === 'cancelled' ? 'sale_cancel' : 'sale', size: i.size, color: i.color,
        quantity: -i.quantity, previousQuantity: null, newQuantity: null, reason: s.reference, createdAt: s.createdAt,
      }))))
    : api.get('/inventory/movements', { params: { product: productId } }),
}
