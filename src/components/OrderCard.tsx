'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import StatusBadge from './StatusBadge'
import { formatDate } from '@/lib/utils'
import { MapPin, Clock } from 'lucide-react'

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

const AVATAR_COLORS: [string, string][] = [
  ['#EFF6FF', '#1D4ED8'],
  ['#FEF3E2', '#B45309'],
  ['#F0FDF4', '#15803D'],
  ['#FEF2F2', '#B91C1C'],
  ['#F5F3FF', '#6D28D9'],
  ['#ECFEFF', '#0E7490'],
]

function pickAvatarColor(name: string): [string, string] {
  let sum = 0
  for (const ch of name) sum += ch.charCodeAt(0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

export default function OrderCard({
  order,
  onAccept,
  onStatusChange,
  showActions,
  acceptPrice,
  acceptDisabled,
}: {
  order: Order
  onAccept?: () => void
  onStatusChange?: (status: string) => void
  showActions?: boolean
  acceptPrice?: number | null
  acceptDisabled?: boolean
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = descRef.current
    if (el) setIsClamped(el.scrollHeight > el.clientHeight + 1)
  }, [expanded])

  const clientName = order.client_details?.first_name || order.client_details?.phone || '?'
  const [avatarBg, avatarFg] = pickAvatarColor(clientName)

  return (
    <div className="order-card">
      <div className="flex flex-col items-end gap-3 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
        <div className="min-w-0">
          <h3 className="text-[18px] font-medium leading-snug">{order.title}</h3>
          <div className="flex items-center gap-2.5 mt-2">
            <span
              className="avatar w-9 h-9 rounded-full text-sm shrink-0"
              style={{ background: avatarBg, color: avatarFg }}
            >
              {clientName[0].toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium truncate">{clientName}</span>
              <span className="block text-xs truncate" style={{ color: 'var(--text-light)' }}>
                {order.client_details?.phone || t('role.client')}
              </span>
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {order.description && (
        <div className="mt-4">
          <p
            ref={descRef}
            className={`text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {order.description}
          </p>
          {isClamped && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium"
              style={{ color: 'var(--accent)' }}
            >
              {expanded ? t('order.show_less') : t('order.show_more')}
            </button>
          )}
        </div>
      )}

      {order.address && (
        <div
          className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium max-w-full"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderRadius: 6 }}
        >
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">{order.address}</span>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
        <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-light)' }}>
          <Clock size={13} /> {formatDate(order.created_at)}
        </span>
        {order.price && (
          <span className="text-[20px] font-medium leading-none" style={{ color: 'var(--text)' }}>
            {order.price}
            <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-light)' }}>
              {t('order.price_label')}
            </span>
          </span>
        )}
      </div>

      {showActions && order.status === 'new' && onAccept && (
        <button
          onClick={onAccept}
          disabled={acceptDisabled}
          className="btn btn-primary mt-4 w-full py-2.5 font-bold"
        >
          {t('order.accept')}
          {acceptPrice != null && (
            <span className="ml-2 opacity-90">- {acceptPrice.toLocaleString('ru-RU')} {t('order.price_label')}</span>
          )}
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
