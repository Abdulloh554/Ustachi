'use client'

import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock, PlayCircle, UserX, XCircle, CircleDot, ChevronRight } from 'lucide-react'
import { getStatusLabel } from '@/lib/utils'

const statusMeta: Record<string, { icon: any; tone: string }> = {
  queued: { icon: CircleDot, tone: 'var(--text-light)' },
  assigned: { icon: Clock, tone: 'var(--primary-active)' },
  in_progress: { icon: PlayCircle, tone: 'var(--primary-active)' },
  completed: { icon: CheckCircle2, tone: 'var(--success-text)' },
  cancelled: { icon: XCircle, tone: 'var(--danger-text)' },
  no_show: { icon: UserX, tone: 'var(--warning-text)' },
}

export default function StatusTimeline({ logs }: { logs: any[] }) {
  const { t } = useTranslation()

  if (!logs || logs.length === 0) {
    return <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.no_logs')}</p>
  }

  return (
    <ol className="space-y-0">
      {[...logs].reverse().map((log, i) => {
        const meta = statusMeta[log.to_status] || { icon: ChevronRight, tone: 'var(--text-light)' }
        const Icon = meta.icon
        const isLast = i === 0
        return (
          <li key={log.id || i} className="relative pl-7 pb-5 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[11px] top-6 bottom-0 w-px"
                style={{ background: 'var(--border)' }}
              />
            )}
            <span
              className="absolute left-0 top-0.5 w-[23px] h-[23px] rounded-full flex items-center justify-center"
              style={{
                background: 'var(--bg-secondary)',
                color: meta.tone,
                border: `1px solid var(--border)`,
              }}
            >
              <Icon size={13} />
            </span>
            <p className="text-sm font-medium capitalize" style={{ color: 'var(--text)' }}>
              {getStatusLabel(log.to_status)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
              {new Date(log.created_at).toLocaleString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              {log.changed_by_name ? ` · ${log.changed_by_name}` : ''}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
