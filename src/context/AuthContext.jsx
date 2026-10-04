import { createContext, useContext, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)
const read = () => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(read)
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
    isAdmin: user?.role !== 'employee', // l'API applique les vrais droits ; ceci ne sert qu'à l'affichage
    login: async (email, password) => {
      const r = await authService.login(email, password)
      localStorage.setItem('token', r.token)
      localStorage.setItem('user', JSON.stringify(r.user))
      setUser(r.user)
    },
    updateUser: (patch) => { const u = { ...user, ...patch }; localStorage.setItem('user', JSON.stringify(u)); setUser(u) },
    logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null) },
  }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
