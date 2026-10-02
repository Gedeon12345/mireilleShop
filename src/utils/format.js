export const formatFCFA = (n) =>
  `${Number(n || 0).toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ')} FCFA`

export const totalStock = (p) => p.sizes.reduce((a, s) => a + s.quantity, 0)

export const stockStatus = (qty, threshold = 3) =>
  qty === 0 ? 'out' : qty <= threshold ? 'low' : 'ok'

export const productStatus = (p, threshold = 3) => {
  if (totalStock(p) === 0) return 'out'
  return p.sizes.some((s) => s.quantity <= threshold) ? 'low' : 'ok'
}
