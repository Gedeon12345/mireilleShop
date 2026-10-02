const map = {
  ok: ['En stock', 'bg-green-50 text-green-700 ring-green-600/20'],
  low: ['Stock faible', 'bg-amber-50 text-amber-700 ring-amber-500/30'],
  out: ['Rupture', 'bg-red-50 text-red-700 ring-red-600/20'],
}
export default function StatusBadge({ status }) {
  const [label, cls] = map[status]
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>{label}</span>
}
