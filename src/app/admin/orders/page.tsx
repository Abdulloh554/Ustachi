'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export default function AdminOrdersPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const loadOrders = async () => {
    const params: any = {}
    if (statusFilter) params.status = statusFilter
    const res = await adminAPI.orders()
    let data = res.data.results || res.data
    if (statusFilter) data = data.filter((o: any) => o.status === statusFilter)
    setOrders(data)
  }

  const statuses = ['new', 'accepted', 'coming', 'in_progress', 'completed', 'failed']

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{t('admin.orders')}</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`pill text-sm ${!statusFilter ? 'active' : ''}`}
        >
          {t('admin.all')}
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`pill text-sm capitalize ${statusFilter === s ? 'active' : ''}`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>{t('table.order')}</th>
                <th>{t('table.client')}</th>
                <th>{t('table.master')}</th>
                <th>{t('table.status')}</th>
                <th>{t('table.price')}</th>
                <th>{t('table.date')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td className="font-medium">{o.title}</td>
                  <td>{o.client_details?.phone || o.client}</td>
                  <td>{o.master_details?.phone || o.master || '-'}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>{o.price ? `${o.price} ${t('order.price_label')}` : '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>{t('admin.no_orders')}</p>}
      </div>
    </div>
  )
}
