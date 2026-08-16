'use client'

import type { LucideIcon } from 'lucide-react'

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'primary',
  loading,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: 'primary' | 'success' | 'danger' | 'warning'
  loading?: boolean
}) {
  const bg: Record<string, string> = {
    primary: 'var(--primary-light)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    warning: 'var(--warning)',
  }
  const fg: Record<string, string> = {
    primary: 'var(--primary-active)',
    success: 'var(--success-text)',
    danger: 'var(--danger-text)',
    warning: 'var(--warning-text)',
  }

  return (
    <div className="stat rounded-xl">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: bg[accent], color: fg[accent] }}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          {loading ? (
            <div className="skeleton h-5 w-14 rounded-lg mt-1" />
          ) : (
            <p className="text-lg font-semibold leading-tight" style={{ color: 'var(--text)' }}>{value}</p>
          )}
        </div>
      </div>
    </div>
  )
}
