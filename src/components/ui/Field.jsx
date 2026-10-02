export const inputCls = (err) =>
  `w-full rounded-xl border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 ${err ? 'border-danger focus:ring-danger/20' : 'border-line focus:border-primary focus:ring-primary/20'}`

export default function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  )
}
