import api, { USE_MOCK } from './api'
import { wait } from './delay'

const mock = [{ _id: 'u1', name: 'Vendeuse démo', email: 'vendeuse@boutique.cm', role: 'employee', isActive: true }]

export const userService = {
  list: () => (USE_MOCK ? wait([...mock]) : api.get('/users')),
  create: (d) => {
    if (!USE_MOCK) return api.post('/users', d)
    if (mock.some((u) => u.email === d.email.toLowerCase())) return Promise.reject(new Error('Cet email est déjà utilisé.'))
    const u = { _id: String(Date.now()), name: d.name, email: d.email.toLowerCase(), role: 'employee', isActive: true }
    mock.push(u)
    return wait(u)
  },
  update: (id, d) => {
    if (!USE_MOCK) return api.patch(`/users/${id}`, d)
    Object.assign(mock.find((u) => u._id === id), d)
    return wait({ ok: true })
  },
  resetPassword: (id, newPassword) => (USE_MOCK ? wait({ ok: true }) : api.post(`/users/${id}/reset-password`, { newPassword })),
}
