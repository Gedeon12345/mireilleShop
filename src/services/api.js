import axios from 'axios'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(
  (r) => r.data,
  (err) => {
    if (err.response?.status === 401) localStorage.removeItem('token')
    return Promise.reject(new Error(err.response?.data?.message || 'Erreur réseau'))
  }
)
export default api
