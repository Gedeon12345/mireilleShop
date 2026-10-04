import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import ProductForm from './pages/ProductForm.jsx'
import Categories from './pages/Categories.jsx'
import NewSale from './pages/NewSale.jsx'
import SalesHistory from './pages/SalesHistory.jsx'
import Settings from './pages/Settings.jsx'
import StockMovements from './pages/StockMovements.jsx'
import Team from './pages/Team.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="connexion" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventaire" element={<Inventory />} />
          <Route path="inventaire/stock-faible" element={<Inventory lowOnly />} />
          <Route path="ventes/nouvelle" element={<NewSale />} />
          <Route path="ventes" element={<SalesHistory />} />
          <Route path="parametres" element={<Settings />} />
          <Route element={<AdminRoute />}>
            <Route path="inventaire/nouveau" element={<ProductForm />} />
            <Route path="inventaire/:id/modifier" element={<ProductForm />} />
            <Route path="inventaire/:id/mouvements" element={<StockMovements />} />
            <Route path="inventaire/categories" element={<Categories />} />
            <Route path="equipe" element={<Team />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
