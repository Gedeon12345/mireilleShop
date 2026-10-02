const styles = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  ghost: 'bg-surface text-ink border border-line hover:bg-canvas',
}
export default function Button({ variant = 'primary', icon: Icon, children, className = '', ...p }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...p}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  )
}
