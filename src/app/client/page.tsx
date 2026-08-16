'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Plus, MessageSquare, ClipboardList } from 'lucide-react'
import { orderAPI, workshopAPI } from '@/lib/api'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import Modal from '@/components/crm/Modal'
import CreateOrderForm from '@/components/crm/CreateOrderForm'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/StatusBadge'
import { formatMoney, formatDate } from '@/lib/utils'

export default function ClientPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await orderAPI.list({ page_size: 50 })
      setOrders(res.data.results || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    workshopAPI.public().then((res) => setServices(res.data.services || [])).catch(() => setServices([]))
  }, [load])

  const onCreated = (order: any) => {
    setModalOpen(false)
    setSuccess(t('crm.client_order_success', { n: order.queue_number }))
    load()
    setTimeout(() => setSuccess(''), 5000)
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('crm.client_my_orders')}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('crm.client_create_subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-1.5 inline" /> {t('crm.client_create_order')}
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium" style={{ background: 'var(--success)', color: 'var(--success-text)' }}>
          {success}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card rounded-2xl">
          <EmptyState
            icon={<ClipboardList size={24} />}
            title={t('crm.client_no_orders')}
            description={t('crm.client_no_orders_desc')}
            action={
              <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                <Plus size={16} className="mr-1.5 inline" /> {t('crm.client_create_order')}
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((o) => (
            <div key={o.id} className="card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}
                >
                  #{o.queue_number}
                </span>
                <StatusBadge status={o.status} />
              </div>
              <p className="font-semibold" style={{ color: 'var(--text)' }}>{o.service_type}</p>
              {o.description && (
                <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {o.description}
                </p>
              )}
              <p className="text-xs mt-2" style={{ color: 'var(--text-light)' }}>
                {o.scheduled_at ? formatDate(o.scheduled_at) : formatDate(o.created_at)}
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  {formatMoney(o.price)} so'm
                </span>
                <div className="flex items-center gap-2">
                  {o.conversation_id && (
                    <Link href={`/chat/${o.conversation_id}`} className="btn !py-1.5 !h-auto text-sm" style={{ borderColor: 'var(--border)' }}>
                      <MessageSquare size={14} className="mr-1 inline" /> {t('crm.client_chat')}
                    </Link>
                  )}
                  <Link href={`/client/my-order/${o.id}`} className="btn btn-primary !py-1.5 !h-auto text-sm">
                    {t('crm.details')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t('crm.client_create_order')} maxWidth="max-w-lg">
        <CreateOrderForm services={services} onCreated={onCreated} />
      </Modal>
    </div>
  )
}
