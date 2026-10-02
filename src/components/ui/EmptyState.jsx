export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-14 text-center">
      {Icon && <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary"><Icon size={22} /></span>}
      <h3 className="text-base font-semibold">{title}</h3>
      {text && <p className="max-w-xs text-sm text-ink-soft">{text}</p>}
      {action}
    </div>
  )
}
