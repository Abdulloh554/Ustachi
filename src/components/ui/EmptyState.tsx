import type { ReactNode } from 'react'

export default function EmptyState({
  icon,
  title,
  action,
}: {
  icon: ReactNode
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in-up">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'var(--bg-secondary)', color: 'var(--text-light)' }}
      >
        {icon}
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
