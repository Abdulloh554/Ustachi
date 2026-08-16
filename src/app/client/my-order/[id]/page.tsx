'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, MessageSquare, MapPin, CalendarClock, Loader2 } from 'lucide-react'
import { orderAPI } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'
import StatusTimeline from '@/components/crm/StatusTimeline'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { formatMoney, formatDate } from '@/lib/utils'

export default function ClientOrderDetailPage() {
  const { t } = useTranslation()
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    orderAPI.detail(params.id)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
    orderAPI.logs(params.id)
      .then((res) => setLogs(res.data))
      .catch(() => setLogs([]))
  }, [params.id])

  const cancel = async () => {
    if (!confirm(t('crm.confirm_cancel'))) return
    setBusy(true)
    try {
      const res = await orderAPI.cancel(params.id)
      setOrder(res.data)
    } finally {
      setBusy(false)
    }
  }

  if (!order) return <DashboardSkeleton />

  const canCancel = order.status === 'queued' || order.status === 'assigned'

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-semibold mb-4"
        style={{ color: 'var(--text-light)' }}
      >
        <ArrowLeft size={16} /> {t('crm.back')}
      </button>

      <div className="card rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}
            >
              #{order.queue_number}
            </span>
            <div>
              <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--text)' }}>{order.service_type}</h1>
              <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                {t('crm.order_detail')} · {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            {order.description && (
              <p style={{ color: 'var(--text-secondary)' }}>{order.description}</p>
            )}
            <p className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <CalendarClock size={15} /> {order.scheduled_at ? formatDate(order.scheduled_at) : t('crm.scheduled_at') + ': —'}
            </p>
            {order.address && (
              <p className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={15} /> {order.address}
              </p>
            )}
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.price')}</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{formatMoney(order.price)} so'm</p>
            {order.cancelled_reason && (
              <p className="text-xs" style={{ color: 'var(--danger-text)' }}>
                {t('crm.cancelled_reason')}: {order.cancelled_reason}
              </p>
            )}
          </div>
        </div>

        {canCancel && (
          <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center gap-3">
            <button className="btn btn-danger" onClick={cancel} disabled={busy}>
              {busy && <Loader2 size={16} className="inline animate-spin mr-2" />}
              {t('crm.cancel')}
            </button>
            {order.conversation_id && (
              <Link href={`/chat/${order.conversation_id}`} className="btn" style={{ borderColor: 'var(--border)' }}>
                <MessageSquare size={16} className="mr-1.5 inline" /> {t('crm.client_chat')}
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="card rounded-2xl p-6">
        <h2 className="font-semibold mb-4">{t('crm.client_status_timeline')}</h2>
        <StatusTimeline logs={logs} />
        <p className="text-xs mt-4" style={{ color: 'var(--text-light)' }}>{t('crm.no_show_note')}</p>
      </div>
    </div>
  )
}
