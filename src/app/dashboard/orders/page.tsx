'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { orderAPI, workshopAPI } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'
import OrderActions from '@/components/crm/OrderActions'
import { SkeletonTableRows } from '@/components/ui/Skeleton'
import { formatMoney, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const STATUSES = ['', 'queued', 'assigned', 'in_progress', 'completed', 'no_show', 'cancelled']

function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const isOwner = user?.role === 'owner'

  const [orders, setOrders] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [staffList, setStaffList] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page_size: 100 }
      if (status) params.status = status
      if (date) params.date = date
      const res = await orderAPI.list(params)
      setOrders(res.data.results || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [status, date])

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

  const q = search.trim().toLowerCase()
  const filtered = q
    ? orders.filter(
        (o: any) =>
          (o.client_name || '').toLowerCase().includes(q) ||
          (o.client_phone || '').includes(q) ||
          (o.service_type || '').toLowerCase().includes(q)
      )
    : orders

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight mb-2">{t('sidebar.orders_alt')}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-3">
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

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }} />
          <input
            className="input !pl-9"
            placeholder={t('crm.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('crm.filter_date')}:</span>
          <input type="date" className="input !h-auto !py-1.5" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} />
          {date && (
            <button className="btn !py-1.5 !h-auto text-sm" style={{ borderColor: 'var(--border)' }} onClick={() => setDate('')}>
              {t('crm.clear')}
            </button>
          )}
        </div>
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
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: 'var(--text-light)' }}>
                    {q ? t('crm.no_search') : t('crm.no_active')}
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((o: any) => (
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
