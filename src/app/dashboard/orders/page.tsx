'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { orderAPI, workshopAPI } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'
import OrderActions from '@/components/crm/OrderActions'
import { SkeletonTableRows } from '@/components/ui/Skeleton'
import { formatMoney, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const STATUSES = ['', 'queued', 'assigned', 'in_progress', 'completed', 'no_show', 'cancelled']

export default function OrdersPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const isOwner = user?.role === 'owner'

  const [orders, setOrders] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [staffList, setStaffList] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page_size: 100 }
      if (status) params.status = status
      const res = await orderAPI.list(params)
      setOrders(res.data.results || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!isOwner) return
    Promise.all([
      workshopAPI.staffList().catch(() => ({ data: [] })),
      workshopAPI.inventoryList().catch(() => ({ data: [] })),
    ]).then(([s, p]) => {
      setStaffList(s.data)
      setProducts(p.data)
    })
  }, [isOwner])

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight mb-2">{t('sidebar.orders_alt')}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('crm.filter_status')}:</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              status === s
                ? 'text-white bg-[var(--primary)]'
                : 'border border-[var(--border)] hover:border-[var(--primary)]'
            }`}
            style={status === s ? {} : { color: 'var(--text-secondary)' }}
          >
            {s === '' ? t('crm.all_statuses') : t(`status.${s}`)}
          </button>
        ))}
      </div>

      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('crm.client')}</th>
                <th>{t('crm.service_name')}</th>
                <th>{t('crm.staff')}</th>
                <th>{t('crm.price')}</th>
                <th>{t('crm.scheduled_at')}</th>
                <th>{t('crm.status')}</th>
                <th>{t('crm.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonTableRows rows={6} cols={8} />}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: 'var(--text-light)' }}>
                    {t('crm.no_active')}
                  </td>
                </tr>
              )}
              {!loading &&
                orders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="font-bold" style={{ color: 'var(--primary-active)' }}>#{o.queue_number}</td>
                    <td>
                      <p className="font-medium" style={{ color: 'var(--text)' }}>{o.client_name || '—'}</p>
                      <p className="text-xs" style={{ color: 'var(--text-light)' }}>{o.client_phone}</p>
                    </td>
                    <td>{o.service_type}</td>
                    <td>{o.assigned_staff_details?.first_name || '—'}</td>
                    <td>{formatMoney(o.price)} so'm</td>
                    <td className="text-sm whitespace-nowrap">{o.scheduled_at ? formatDate(o.scheduled_at) : '—'}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <OrderActions order={o} staffList={staffList} products={products} onChanged={load} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
