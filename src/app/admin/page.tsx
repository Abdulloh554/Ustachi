'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import CountUp from '@/components/ui/CountUp'
import { useTranslation } from 'react-i18next'
import { Users, ClipboardList, Wrench, Activity } from 'lucide-react'
import { getStatusLabel } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    adminAPI.dashboard().then((res) => setData(res.data)).catch(() => setData(null))
  }, [])

  useEffect(() => {
    if (!data) return
    const id = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [data])

  if (!data) return <DashboardSkeleton />

  const cards = [
    { labelKey: 'admin.users', value: data.total_users, icon: Users },
    { labelKey: 'admin.masters', value: data.total_masters, icon: Wrench },
    { labelKey: 'admin.clients', value: data.total_clients, icon: Users },
    { labelKey: 'admin.orders', value: data.total_orders, icon: ClipboardList },
  ]

  const statusValues = Object.values(data.orders_by_status) as number[]
  const max = Math.max(...statusValues)

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight mb-8 animate-fade-in-up">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.labelKey}
              className="stat rounded-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="stat-icon">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t(card.labelKey)}</p>
                  <CountUp value={card.value} className="text-lg font-semibold" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity size={18} /> {t('admin.orders_status')}</h2>
        <div className="space-y-3">
          {Object.entries(data.orders_by_status).map(([status, count], index) => (
            <div
              key={status}
              className="flex items-center justify-between animate-fade-in-up"
              style={{ animationDelay: `${200 + index * 40}ms` }}
            >
              <span className="text-sm capitalize">{getStatusLabel(status)}</span>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="progress flex-1">
                  <div
                    className="progress-fill"
                    style={{ transform: `scaleX(${loaded ? (count as number) / max : 0})` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">{count as number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
