import { LayoutDashboard, Package, PlusCircle, Tags, AlertTriangle, ShoppingBag, History, Settings, Users } from 'lucide-react'

// adminOnly : visible seulement pour la propriétaire
export const navGroups = [
  { items: [{ to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true }] },
  { title: 'Inventaire', items: [
    { to: '/inventaire', label: 'Tous les produits', icon: Package, end: true },
    { to: '/inventaire/nouveau', label: 'Ajouter un produit', icon: PlusCircle, adminOnly: true },
    { to: '/inventaire/categories', label: 'Catégories', icon: Tags, adminOnly: true },
    { to: '/inventaire/stock-faible', label: 'Stock faible', icon: AlertTriangle },
  ] },
  { title: 'Ventes', items: [
    { to: '/ventes/nouvelle', label: 'Nouvelle vente', icon: ShoppingBag },
    { to: '/ventes', label: 'Historique des ventes', icon: History, end: true },
  ] },
  { title: 'Paramètres', items: [
    { to: '/equipe', label: 'Équipe', icon: Users, adminOnly: true },
    { to: '/parametres', label: 'Mon compte et seuil', icon: Settings },
  ] },
]
