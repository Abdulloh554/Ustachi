'use client'

import { useTranslation } from 'react-i18next'
import StatusBadge from './StatusBadge'
import { formatDate } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface Order {
  id: number
  title: string
  description: string
  status: string
  price: string | null
  address: string
  created_at: string
  client_details?: { phone: string; first_name: string }
  master_details?: { phone: string; first_name: string }
}

export default function OrderCard({
  order,
  onAccept,
  onStatusChange,
  showActions,
}: {
  order: Order
  onAccept?: () => void
  onStatusChange?: (status: string) => void
  showActions?: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className="card card-hover rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-display font-bold text-lg leading-snug">{order.title}</h3>
          <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <span className="avatar w-6 h-6 rounded-full text-[10px]">
              {(order.client_details?.first_name?.[0] || order.client_details?.phone?.[0] || '?').toUpperCase()}
            </span>
            {order.client_details?.first_name || order.client_details?.phone}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-light)' }}>
            {t('order.status')}
          </span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {order.description}
      </p>

      {order.address && (
        <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--text-light)' }}>
          <MapPin size={12} /> {order.address}
        </p>
      )}

      <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--border)]"
        style={{ color: 'var(--text-light)' }}>
        <span>{formatDate(order.created_at)}</span>
        {order.price && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold"
            style={{ background: 'color-mix(in srgb, var(--success) 12%, transparent)', color: 'var(--success)' }}>
            {order.price} {t('order.price_label')}
          </span>
        )}
      </div>

      {showActions && order.status === 'new' && onAccept && (
        <button
          onClick={onAccept}
          className="btn btn-primary mt-4 w-full py-2.5 font-bold"
        >
          {t('order.accept')}
        </button>
      )}

      {showActions && onStatusChange && (
        <div className="mt-4 flex gap-2">
          {order.status === 'accepted' && (
            <button onClick={() => onStatusChange('coming')} className="btn btn-primary flex-1 py-2.5 font-bold">
              {t('order.coming')}
            </button>
          )}
          {order.status === 'coming' && (
            <button onClick={() => onStatusChange('in_progress')} className="btn btn-primary flex-1 py-2.5 font-bold">
              {t('order.in_progress')}
            </button>
          )}
          {order.status === 'in_progress' && (
            <>
              <button onClick={() => onStatusChange('completed')} className="btn btn-primary flex-1 py-2.5 font-bold">
                {t('order.completed')}
              </button>
              <button onClick={() => onStatusChange('failed')} className="btn btn-danger flex-1 py-2.5 font-bold">
                {t('order.failed')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
