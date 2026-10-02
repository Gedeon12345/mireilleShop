import api, { USE_MOCK } from './api'
import { mockCategories, mockProducts } from './mockData'
import { wait } from './delay'

export const categoryService = {
  list: () => USE_MOCK
    ? wait(mockCategories.filter((c) => c.isActive).map((c) => ({ ...c, productCount: mockProducts.filter((p) => p.isActive && p.category._id === c._id).length })))
    : api.get('/categories'),
  create: (d) => {
    if (!USE_MOCK) return api.post('/categories', d)
    const c = { _id: String(Date.now()), name: d.name, description: d.description || '', isActive: true }
    mockCategories.push(c)
    return wait(c)
  },
  update: (id, d) => {
    if (!USE_MOCK) return api.put(`/categories/${id}`, d)
    Object.assign(mockCategories.find((c) => c._id === id), d)
    return wait({ ok: true })
  },
  archive: (id) => {
    if (!USE_MOCK) return api.patch(`/categories/${id}/archive`)
    mockCategories.find((c) => c._id === id).isActive = false
    return wait({ ok: true })
  },
}
