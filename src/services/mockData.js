const cat = (id, name) => ({ _id: id, name, description: '', isActive: true })
export const mockCategories = [
  cat('c1', 'Sneakers'), cat('c2', 'Baskets'), cat('c3', 'Sandales'), cat('c4', 'Talons'), cat('c5', 'Mocassins'),
  cat('c6', 'Bottes'), cat('c7', 'Claquettes'), cat('c8', 'Chaussures enfants'), cat('c9', 'Autres'),
]
const C = (id) => mockCategories.find((c) => c._id === id)
const sz = (o) => Object.entries(o).map(([size, quantity]) => ({ size: +size, quantity }))
const P = (_id, name, c, gender, price, sizes) => ({ _id, name, category: C(c), gender, price, color: '', description: '', isActive: true, sizes: sz(sizes) })
export const mockProducts = [
  P('1', 'Nike Air Max', 'c1', 'Femme', 25000, { 39: 3, 40: 5, 41: 7, 42: 4, 43: 2 }),
  P('2', 'Adidas Stan Smith', 'c2', 'Mixte', 22000, { 38: 6, 40: 8, 42: 5, 44: 3 }),
  P('3', 'Sandale Cuir Camel', 'c3', 'Femme', 12000, { 37: 2, 38: 3, 39: 6, 40: 1 }),
  P('4', 'Escarpin Noir 9 cm', 'c4', 'Femme', 18500, { 36: 0, 37: 4, 38: 5, 39: 3 }),
  P('5', 'Mocassin Oxford', 'c5', 'Homme', 20000, { 41: 5, 42: 6, 43: 4, 44: 4 }),
  P('6', 'Claquette Confort', 'c7', 'Mixte', 5000, { 40: 0, 41: 0, 42: 0 }),
  P('7', 'Botte Chelsea', 'c6', 'Homme', 32000, { 41: 3, 42: 4, 43: 5 }),
  P('8', 'Baskets Junior Éclair', 'c8', 'Enfant', 9500, { 28: 5, 30: 6, 32: 4, 34: 7 }),
]
const ago = (ms) => new Date(Date.now() - ms).toISOString()
export const mockSales = [
  { _id: 's1', productName: 'Nike Air Max', size: 41, quantity: 2, total: 50000, createdAt: ago(0) },
  { _id: 's2', productName: 'Escarpin Noir 9 cm', size: 38, quantity: 1, total: 18500, createdAt: ago(3.2e6) },
  { _id: 's3', productName: 'Claquette Confort', size: 40, quantity: 3, total: 15000, createdAt: ago(6e6) },
  { _id: 's4', productName: 'Mocassin Oxford', size: 42, quantity: 1, total: 20000, createdAt: ago(9e7) },
  { _id: 's5', productName: 'Adidas Stan Smith', size: 40, quantity: 2, total: 44000, createdAt: ago(9.4e7) },
]
