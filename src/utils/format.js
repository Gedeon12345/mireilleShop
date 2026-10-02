export const formatFCFA = (n) =>
  `${Number(n || 0).toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ')} FCFA`

export const formatDateTime = (d) =>
  new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// Seuil configurable (mis en cache localement ; source de vérité = API en phase 4)
export const getThreshold = () => Math.max(1, Number(localStorage.getItem('threshold')) || 3)

export const totalStock = (p) => p.sizes.reduce((a, s) => a + s.quantity, 0)

export const stockStatus = (qty, threshold = getThreshold()) =>
  qty === 0 ? 'out' : qty <= threshold ? 'low' : 'ok'

export const productStatus = (p, threshold = getThreshold()) => {
  if (totalStock(p) === 0) return 'out'
  return p.sizes.some((s) => s.quantity <= threshold) ? 'low' : 'ok'
}

// Une ligne de stock = pointure + couleur
export const variantKey = (s) => `${s.size}|${s.color}`
export const colorsOf = (p) => [...new Set(p.sizes.map((s) => s.color))]
export const groupByColor = (p) =>
  colorsOf(p).map((color) => {
    const sizes = p.sizes.filter((s) => s.color === color).sort((a, b) => a.size - b.size)
    return { color, sizes, total: sizes.reduce((a, s) => a + s.quantity, 0) }
  })
