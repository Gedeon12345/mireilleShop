import api, { USE_MOCK } from './api'
import { mockProducts, mockCategories } from './mockData'
import { wait } from './delay'

const clean = (d) => ({
  ...d, price: Number(d.price),
  sizes: d.sizes.map((s) => ({ size: Number(s.size), color: s.color.trim(), quantity: Number(s.quantity) })),
})

// Envoi multipart (champs + fichier "image") pour l'API réelle
const toFormData = (d, photo) => {
  const c = clean(d)
  const fd = new FormData()
  ;['name', 'category', 'gender', 'price', 'description'].forEach((k) => fd.append(k, c[k] ?? ''))
  fd.append('showOnline', String(d.showOnline !== false))
  fd.append('sizes', JSON.stringify(c.sizes))
  if (d.updatedAt) fd.append('updatedAt', d.updatedAt) // détecte une fiche devenue périmée
  if (photo?.file) fd.append('image', photo.file, 'photo.jpg')
  if (photo?.removed) fd.append('removeImage', 'true')
  return fd
}

export const productService = {
  list: (params) => (USE_MOCK ? wait(mockProducts.filter((p) => p.isActive)) : api.get('/products', { params })),
  get: (id) => (USE_MOCK ? wait(mockProducts.find((p) => p._id === id)) : api.get(`/products/${id}`)),
  create: (d, photo) => {
    if (!USE_MOCK) return api.post('/products', toFormData(d, photo))
    const p = { ...clean(d), image: photo?.file ? photo.preview : '', _id: String(Date.now()), isActive: true, category: mockCategories.find((c) => c._id === d.category) }
    mockProducts.unshift(p)
    return wait(p)
  },
  update: (id, d, photo) => {
    if (!USE_MOCK) return api.put(`/products/${id}`, toFormData(d, photo))
    const i = mockProducts.findIndex((p) => p._id === id)
    const image = photo?.removed ? '' : photo?.file ? photo.preview : mockProducts[i].image
    mockProducts[i] = { ...mockProducts[i], ...clean(d), image, category: mockCategories.find((c) => c._id === d.category) }
    return wait(mockProducts[i])
  },
  archive: (id) => {
    if (!USE_MOCK) return api.patch(`/products/${id}/archive`)
    mockProducts.find((p) => p._id === id).isActive = false
    return wait({ ok: true })
  },
  listArchived: () => (USE_MOCK ? wait(mockProducts.filter((p) => !p.isActive)) : api.get('/products', { params: { archived: 'true' } })),
  restore: (id) => {
    if (!USE_MOCK) return api.patch(`/products/${id}/restore`)
    mockProducts.find((p) => p._id === id).isActive = true
    return wait({ ok: true })
  },
  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/products/${id}`)
    mockProducts.splice(mockProducts.findIndex((p) => p._id === id), 1)
    return wait({ ok: true })
  },
}
