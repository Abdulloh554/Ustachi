'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ClipboardList, CheckCircle2, Banknote, CalendarCheck } from 'lucide-react'
import { staffAPI, workshopAPI } from '@/lib/api'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import StatCard from '@/components/crm/StatCard'
import OrderActions from '@/components/crm/OrderActions'
import StatusBadge from '@/components/StatusBadge'
import { formatMoney, formatDate } from '@/lib/utils'

export default function StaffTodayPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])

  const load = useCallback(async () => {
    const [today, profile, inv] = await Promise.all([
      staffAPI.myToday(),
      staffAPI.me(),
      workshopAPI.inventoryList().catch(() => ({ data: [] })),
    ])
    setData(today.data)
    setMe(profile.data)
    setProducts(inv.data)
  }, [])

  useEffect(() => {
    load().catch(() => setData(null))
  }, [load])

  const toggleAvailable = async () => {
    await staffAPI.updateMe({ is_available: !me.is_available })
    load()
  }

  if (!data) return <DashboardSkeleton />

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('crm.staff_today')}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('crm.staff_today_subtitle')}</p>
        </div>
        {me && (
          <button
            onClick={toggleAvailable}
            className={`btn !py-2 !h-auto text-sm ${me.is_available ? 'btn-success' : 'btn-danger'}`}
          >
            {t('crm.staff_availability')}: {me.is_available ? t('crm.available') : t('crm.busy')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('crm.in_progress')} value={data.active_count} icon={ClipboardList} />
        <StatCard label={t('crm.completed_today')} value={data.completed_today} icon={CheckCircle2} accent="success" />
        <StatCard label={t('crm.no_show')} value={data.no_show_today} icon={CalendarCheck} accent="warning" />
        <StatCard label={t('crm.revenue_today')} value={`${formatMoney(data.revenue_today)} so'm`} icon={Banknote} />
      </div>

      <div className="card rounded-2xl p-6">
        <h2 className="font-semibold mb-4">{t('crm.queue_title')}</h2>
        {data.active_orders.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--text-light)' }}>{t('crm.no_active')}</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {data.active_orders.map((order: any) => (
              <li key={order.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}
                  >
                    #{order.queue_number}
                  </span>
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                      {order.client_name || '—'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-light)' }}>
                      {order.service_type} · {order.scheduled_at ? formatDate(order.scheduled_at) : ''}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-2 pl-12">
                  <OrderActions order={order} products={products} onChanged={load} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
