const cat = (id, name) => ({ _id: id, name, description: '', isActive: true })
export const mockCategories = [
  cat('c1', 'Sneakers'), cat('c2', 'Baskets'), cat('c3', 'Sandales'), cat('c4', 'Talons'), cat('c5', 'Mocassins'),
  cat('c6', 'Bottes'), cat('c7', 'Claquettes'), cat('c8', 'Chaussures enfants'), cat('c9', 'Autres'),
]
const C = (id) => mockCategories.find((c) => c._id === id)
// variantes : [pointure, couleur, quantité]
const P = (_id, name, c, gender, price, v) => ({
  _id, name, category: C(c), gender, price, description: '', isActive: true,
  sizes: v.map(([size, color, quantity]) => ({ size, color, quantity })),
})
export const mockProducts = [
  P('1', 'Nike Air Max', 'c1', 'Femme', 25000, [[39, 'Blanc', 3], [40, 'Blanc', 5], [41, 'Blanc', 7], [40, 'Noir', 4], [41, 'Noir', 2], [42, 'Noir', 4]]),
  P('2', 'Adidas Stan Smith', 'c2', 'Mixte', 22000, [[38, 'Blanc', 6], [40, 'Blanc', 8], [42, 'Blanc', 5], [40, 'Vert', 3], [44, 'Vert', 3]]),
  P('3', 'Sandale Cuir Camel', 'c3', 'Femme', 12000, [[37, 'Camel', 2], [38, 'Camel', 3], [39, 'Camel', 6], [39, 'Noir', 4], [40, 'Noir', 1]]),
  P('4', 'Escarpin Noir 9 cm', 'c4', 'Femme', 18500, [[36, 'Noir', 0], [37, 'Noir', 4], [38, 'Noir', 5], [37, 'Rouge', 2], [38, 'Rouge', 3]]),
  P('5', 'Mocassin Oxford', 'c5', 'Homme', 20000, [[41, 'Marron', 5], [42, 'Marron', 6], [43, 'Marron', 4], [42, 'Noir', 4], [44, 'Noir', 4]]),
  P('6', 'Claquette Confort', 'c7', 'Mixte', 5000, [[40, 'Noir', 0], [41, 'Noir', 0], [42, 'Bleu', 0]]),
  P('7', 'Botte Chelsea', 'c6', 'Homme', 32000, [[41, 'Marron', 3], [42, 'Marron', 4], [43, 'Marron', 5]]),
  P('8', 'Baskets Junior Éclair', 'c8', 'Enfant', 9500, [[28, 'Bleu', 5], [30, 'Bleu', 6], [32, 'Rose', 4], [34, 'Rose', 7]]),
]
const ago = (ms) => new Date(Date.now() - ms).toISOString()
const S = (n, product, productName, size, color, quantity, unitPrice, ms) => ({
  _id: `s${n}`, reference: `VT-${String(n).padStart(4, '0')}`,
  items: [{ product, productName, size, color, quantity, unitPrice, total: quantity * unitPrice }],
  totalAmount: quantity * unitPrice, status: 'completed', createdBy: 'Administrateur', createdAt: ago(ms),
})
export const mockSales = [
  S(5, '1', 'Nike Air Max', 41, 'Blanc', 2, 25000, 0),
  S(4, '4', 'Escarpin Noir 9 cm', 38, 'Noir', 1, 18500, 3.2e6),
  S(3, '6', 'Claquette Confort', 40, 'Noir', 3, 5000, 6e6),
  S(2, '5', 'Mocassin Oxford', 42, 'Marron', 1, 20000, 9e7),
  S(1, '2', 'Adidas Stan Smith', 40, 'Blanc', 2, 22000, 9.4e7),
]
