import { AlertTriangle } from 'lucide-react'
import Button from './Button'
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
      <AlertTriangle className="text-danger" />
      <p className="text-sm text-red-800">{message || 'Une erreur est survenue.'}</p>
      {onRetry && <Button variant="ghost" onClick={onRetry}>Réessayer</Button>}
    </div>
  )
}
