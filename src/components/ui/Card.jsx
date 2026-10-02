export default function Card({ className = '', children, ...p }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 shadow-card ${className}`} {...p}>{children}</div>
}
