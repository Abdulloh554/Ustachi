'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import {
  ClipboardList, Timer, PlayCircle, CheckCircle2, Banknote, Users, AlertTriangle,
} from 'lucide-react'
import { workshopAPI } from '@/lib/api'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import StatCard from '@/components/crm/StatCard'
import OrderActions from '@/components/crm/OrderActions'
import StatusBadge from '@/components/StatusBadge'
import { formatMoney, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export default function OwnerDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const isOwner = user?.role === 'owner'
  const [data, setData] = useState<any>(null)
  const [staffList, setStaffList] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    const [dash, staff, inv] = await Promise.all([
      workshopAPI.dashboard(),
      isOwner ? workshopAPI.staffList().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      workshopAPI.inventoryList().catch(() => ({ data: [] })),
    ])
    setData(dash.data)
    setStaffList(staff.data)
    setProducts(inv.data)
  }, [isOwner])

  useEffect(() => {
    load().catch(() => setData(null))
  }, [load])

  useEffect(() => {
    if (!data) return
    const id = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [data])

  if (!data) return <DashboardSkeleton />

  const today = data.today
  const active = (today.queued || 0) + (today.assigned || 0) + (today.in_progress || 0)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('crm.today')}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {data.workshop?.name} · {t('crm.today_subtitle')}
          </p>
        </div>
        <button className="btn" style={{ borderColor: 'var(--border)' }} onClick={() => load()}>
          {t('crm.refresh')}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('crm.total_orders')} value={today.total_orders} icon={ClipboardList} />
        <StatCard label={t('crm.in_progress')} value={active} icon={Timer} accent="warning" />
        <StatCard label={t('crm.completed_today')} value={today.completed} icon={CheckCircle2} accent="success" />
        <StatCard label={t('crm.revenue_today')} value={`${formatMoney(today.revenue)} so'm`} icon={Banknote} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">{t('crm.queue_title')}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>{t('crm.queue_subtitle')}</p>
            </div>
            <Link href="/dashboard/orders" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              {t('crm.details')} →
            </Link>
          </div>

          {data.queue.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--text-light)' }}>{t('crm.no_queue')}</p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {data.queue.map((order: any, i: number) => (
                <li key={order.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}>
                      #{order.queue_number}
                    </span>
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {order.client_name || order.client_details?.first_name || '—'}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-light)' }}>
                        {order.service_type} · {order.scheduled_at ? formatDate(order.scheduled_at) : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.assigned_staff_details && (
                        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                          {order.assigned_staff_details.first_name}
                        </span>
                      )}
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="mt-2 pl-12">
                    <OrderActions order={order} staffList={staffList} products={products} onChanged={load} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="card rounded-2xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Users size={17} style={{ color: 'var(--primary-active)' }} /> {t('crm.staff_overview')}
            </h2>
            {staffList.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.no_staff')}</p>
            ) : (
              <ul className="space-y-3">
                {staffList.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{s.staff_name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                        {t('crm.in_progress')}: {s.active_orders} · {t('crm.completed_today')}: {s.completed_today}
                      </p>
                    </div>
                    <span className={`badge ${s.is_available ? 'badge-completed' : 'badge-cancelled'}`}>
                      {s.is_available ? t('crm.available') : t('crm.busy')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card rounded-2xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={17} style={{ color: 'var(--warning-text)' }} /> {t('crm.low_stock')}
            </h2>
            {data.low_stock.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.low_stock_empty')}</p>
            ) : (
              <ul className="space-y-2">
                {data.low_stock.map((p: any) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--text)' }}>{p.name}</span>
                    <span className="font-semibold" style={{ color: 'var(--warning-text)' }}>
                      {p.quantity} {p.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
