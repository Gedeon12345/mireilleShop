import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import Login from './pages/Login.jsx'
import ProductForm from './pages/ProductForm.jsx'
import Categories from './pages/Categories.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="connexion" element={<Login />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="inventaire" element={<Inventory />} />
        <Route path="inventaire/stock-faible" element={<Inventory lowOnly />} />
        <Route path="inventaire/nouveau" element={<ProductForm />} />
        <Route path="inventaire/:id/modifier" element={<ProductForm />} />
        <Route path="inventaire/categories" element={<Categories />} />
        <Route path="ventes/nouvelle" element={<ComingSoon title="Nouvelle vente" />} />
        <Route path="ventes" element={<ComingSoon title="Historique des ventes" />} />
        <Route path="parametres" element={<ComingSoon title="Paramètres" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      </Route>
    </Routes>
  )
}
