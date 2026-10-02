import api, { USE_MOCK } from './api'
import { mockProducts, mockSales } from './mockData'
import { totalStock } from '../utils/format'
import { wait } from './delay'

const THRESHOLD = 3
const build = () => {
  const active = mockProducts.filter((p) => p.isActive)
  const refs = active.flatMap((p) => p.sizes.map((s) => s.quantity))
  const by = {}
  active.forEach((p) => (by[p.category.name] = (by[p.category.name] || 0) + totalStock(p)))
  const today = new Date().toDateString()
  return {
    totalStock: active.reduce((a, p) => a + totalStock(p), 0),
    productCount: active.length,
    soldToday: mockSales.filter((s) => new Date(s.createdAt).toDateString() === today).reduce((a, s) => a + s.quantity, 0),
    lowStock: refs.filter((q) => q > 0 && q <= THRESHOLD).length,
    outOfStock: refs.filter((q) => q === 0).length,
    byCategory: Object.entries(by).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity),
    latestSales: mockSales.slice(0, 5),
  }
}
export const dashboardService = { get: () => (USE_MOCK ? wait(build(), 450) : api.get('/dashboard')) }
