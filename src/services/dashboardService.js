import api, { USE_MOCK } from './api'
import { mockProducts, mockSales } from './mockData'
import { totalStock, getThreshold } from '../utils/format'
import { wait } from './delay'

const flat = (s) => {
  const it = s.items[0]
  return {
    _id: s._id, productName: s.items.length > 1 ? `${it.productName} +${s.items.length - 1}` : it.productName,
    size: it.size, color: it.color, quantity: s.items.reduce((a, i) => a + i.quantity, 0), total: s.totalAmount, createdAt: s.createdAt,
  }
}
const build = () => {
  const th = getThreshold()
  const active = mockProducts.filter((p) => p.isActive)
  const refs = active.flatMap((p) => p.sizes.map((s) => s.quantity))
  const by = {}
  active.forEach((p) => (by[p.category.name] = (by[p.category.name] || 0) + totalStock(p)))
  const done = mockSales.filter((s) => s.status === 'completed')
  const today = new Date().toDateString()
  return {
    totalStock: active.reduce((a, p) => a + totalStock(p), 0),
    productCount: active.length,
    soldToday: done.filter((s) => new Date(s.createdAt).toDateString() === today).reduce((a, s) => a + s.items.reduce((x, i) => x + i.quantity, 0), 0),
    lowStock: refs.filter((q) => q > 0 && q <= th).length,
    outOfStock: refs.filter((q) => q === 0).length,
    byCategory: Object.entries(by).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity),
    latestSales: done.slice(0, 5).map(flat),
  }
}
export const dashboardService = { get: () => (USE_MOCK ? wait(build(), 450) : api.get('/dashboard')) }
