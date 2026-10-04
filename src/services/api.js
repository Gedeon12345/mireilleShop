import axios from 'axios'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// Tolère une URL sans "/api" final ou avec "/" en trop (erreur fréquente sur Vercel)
const raw = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '')
const baseURL = /^https?:\/\//.test(raw) && !/\/api$/.test(raw) ? `${raw}/api` : raw

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(
  (r) => r.data,
  (err) => {
    // Session expirée : retour à la connexion (sauf pour la tentative de connexion elle-même)
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/connexion') window.location.assign('/connexion')
    }
    return Promise.reject(new Error(err.response?.data?.message || 'Erreur réseau'))
  }
)
export default api
