import type { ReactNode } from 'react'

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in-up">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-[var(--border)]"
        style={{ background: 'var(--surface)', color: 'var(--text-light)' }}
      >
        {icon}
      </div>
      <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
      {description && (
        <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
