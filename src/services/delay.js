export const wait = (d, ms = 350) => new Promise((r) => setTimeout(() => r(d), ms))
