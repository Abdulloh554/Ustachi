'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { staffAPI, workshopAPI } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'
import OrderActions from '@/components/crm/OrderActions'
import { SkeletonTableRows } from '@/components/ui/Skeleton'
import { formatMoney, formatDate } from '@/lib/utils'

export default function StaffOrdersPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [res, inv] = await Promise.all([
        staffAPI.myOrders(),
        workshopAPI.inventoryList().catch(() => ({ data: [] })),
      ])
      setOrders(res.data)
      setProducts(inv.data)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight mb-6">{t('crm.my_orders')}</h1>

      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('crm.client')}</th>
                <th>{t('crm.service_name')}</th>
                <th>{t('crm.price')}</th>
                <th>{t('crm.scheduled_at')}</th>
                <th>{t('crm.status')}</th>
                <th>{t('crm.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonTableRows rows={6} cols={7} />}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: 'var(--text-light)' }}>
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
                    <td>{formatMoney(o.price)} so'm</td>
                    <td className="text-sm whitespace-nowrap">{o.scheduled_at ? formatDate(o.scheduled_at) : '—'}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <OrderActions order={o} products={products} onChanged={load} />
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
