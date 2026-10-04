import api, { USE_MOCK } from './api'
import { wait } from './delay'

const mockPw = () => localStorage.getItem('mock_pw') || 'admin123'

export const authService = {
  login: async (email, password) => {
    if (!USE_MOCK) return api.post('/auth/login', { email, password })
    await wait(null, 500)
    if (email === 'admin@boutique.cm' && password === mockPw()) return { token: 'mock-token', user: { name: 'Administrateur', email, role: 'admin' } }
    throw new Error('Email ou mot de passe incorrect.')
  },
  updateProfile: async (d) => (USE_MOCK ? wait(d, 300) : api.put('/auth/profile', d)),
  changePassword: async (currentPassword, newPassword) => {
    if (!USE_MOCK) return api.put('/auth/profile', { currentPassword, newPassword })
    await wait(null, 350)
    if (currentPassword !== mockPw()) throw new Error('Mot de passe actuel incorrect.')
    localStorage.setItem('mock_pw', newPassword)
    return { ok: true }
  },
}
