import api, { USE_MOCK } from './api'
import { wait } from './delay'

export const authService = {
  login: async (email, password) => {
    if (!USE_MOCK) return api.post('/auth/login', { email, password })
    await wait(null, 500)
    if (email === 'admin@boutique.cm' && password === 'admin123')
      return { token: 'mock-token', user: { name: 'Administrateur', email } }
    throw new Error('Email ou mot de passe incorrect.')
  },
}
