'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import { Users, ClipboardList, Wrench, Activity } from 'lucide-react'

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    adminAPI.dashboard().then((res) => setData(res.data))
  }, [])

  if (!data) return <div className="skeleton h-32" />

  const cards = [
    { labelKey: 'admin.users', value: data.total_users, icon: Users, color: 'blue' },
    { labelKey: 'admin.masters', value: data.total_masters, icon: Wrench, color: 'green' },
    { labelKey: 'admin.clients', value: data.total_clients, icon: Users, color: 'purple' },
    { labelKey: 'admin.orders', value: data.total_orders, icon: ClipboardList, color: 'orange' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.labelKey} className="stat rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`stat-icon stat-icon-${card.color}`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t(card.labelKey)}</p>
                  <p className="text-lg font-semibold">{card.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity size={18} /> {t('admin.orders_status')}</h2>
        <div className="space-y-3">
          {Object.entries(data.orders_by_status).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="progress flex-1">
                  <div
                    className="progress-fill"
                    style={{ width: `${(count as number) / Math.max(...Object.values(data.orders_by_status) as number[]) * 100}%` }}
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
