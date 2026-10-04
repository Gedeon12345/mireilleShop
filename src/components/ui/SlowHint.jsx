import { useEffect, useState } from 'react'

// Render (offre gratuite) met le serveur en veille : la 1re requête peut prendre ~1 minute
export default function SlowHint({ delay = 6000 }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t) }, [delay])
  return show ? <p role="status" className="mt-3 text-center text-sm text-ink-soft">Le serveur se réveille, cela peut prendre jusqu’à une minute…</p> : null
}
