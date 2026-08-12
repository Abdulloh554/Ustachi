'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { MapPin, Clock, MessageSquare, XCircle } from 'lucide-react'
import OrderClientInfo from '@/components/order/OrderClientInfo'
import OrderActions from '@/components/order/OrderActions'

interface Order {
  id: string
  title: string
  description: string
  status: string
  price: string | null
  address: string
  created_at: string
  conversation_id?: string | null
  client_details?: { phone: string; first_name: string }
  master_details?: { phone: string; first_name: string }
}

const CANCELABLE = ['new', 'accepted', 'coming', 'in_progress', 'failed']

export default function OrderCard({
  order,
  onAccept,
  onStatusChange,
  onCancel,
  showActions,
  acceptPrice,
  acceptDisabled,
}: {
  order: Order
  onAccept?: () => void
  onStatusChange?: (status: string) => void
  onCancel?: () => void
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

  const handleCancelClick = () => {
    if (window.confirm(t('order.cancel_confirm'))) {
      onCancel?.()
    }
  }

  const canCancel = CANCELABLE.includes(order.status) && !!onCancel

  return (
    <div className="order-card">
      <OrderClientInfo
        title={order.title}
        name={clientName}
        phone={order.client_details?.phone}
        status={order.status}
      />

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
              style={{ color: 'var(--primary)' }}
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

      <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-col gap-2 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between">
        <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-light)' }}>
          <Clock size={13} /> {formatDate(order.created_at)}
        </span>
        {order.price && (
          <span className="text-[20px] font-medium leading-none min-[640px]:ml-auto" style={{ color: 'var(--text)' }}>
            {order.price}
            <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-light)' }}>
              {t('order.price_label')}
            </span>
          </span>
        )}
      </div>

      {(order.conversation_id || canCancel) && (
        <div className="mt-4 flex gap-2">
          {order.conversation_id && (
            <Link
              href={`/chat/${order.conversation_id}`}
              className="btn btn-secondary flex-1 py-2.5 justify-center gap-2"
            >
              <MessageSquare size={16} /> {t('order.chat')}
            </Link>
          )}
          {canCancel && (
            <button
              onClick={handleCancelClick}
              className="btn btn-ghost-danger flex-1 py-2.5 justify-center gap-2"
            >
              <XCircle size={16} /> {t('order.cancel')}
            </button>
          )}
        </div>
      )}

      {showActions && (
        <OrderActions
          status={order.status}
          onAccept={onAccept}
          onStatusChange={onStatusChange}
          acceptPrice={acceptPrice}
          acceptDisabled={acceptDisabled}
        />
      )}
    </div>
  )
}
