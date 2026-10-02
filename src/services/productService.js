import api, { USE_MOCK } from './api'
import { mockProducts, mockCategories } from './mockData'
import { wait } from './delay'

const clean = (d) => ({
  ...d, price: Number(d.price),
  sizes: d.sizes.map((s) => ({ size: Number(s.size), quantity: Number(s.quantity) })),
})

export const productService = {
  list: (params) => (USE_MOCK ? wait(mockProducts.filter((p) => p.isActive)) : api.get('/products', { params })),
  get: (id) => (USE_MOCK ? wait(mockProducts.find((p) => p._id === id)) : api.get(`/products/${id}`)),
  create: (d) => {
    if (!USE_MOCK) return api.post('/products', clean(d))
    const p = { ...clean(d), _id: String(Date.now()), isActive: true, category: mockCategories.find((c) => c._id === d.category) }
    mockProducts.unshift(p)
    return wait(p)
  },
  update: (id, d) => {
    if (!USE_MOCK) return api.put(`/products/${id}`, clean(d))
    const i = mockProducts.findIndex((p) => p._id === id)
    mockProducts[i] = { ...mockProducts[i], ...clean(d), category: mockCategories.find((c) => c._id === d.category) }
    return wait(mockProducts[i])
  },
  archive: (id) => {
    if (!USE_MOCK) return api.patch(`/products/${id}/archive`)
    mockProducts.find((p) => p._id === id).isActive = false
    return wait({ ok: true })
  },
}
