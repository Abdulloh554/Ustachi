'use client'

import { useEffect, useState } from 'react'
import { masterAPI, orderAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import OrderCard from '@/components/OrderCard'
import { useTranslation } from 'react-i18next'

export default function MasterOrdersPage() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [availableOrders, setAvailableOrders] = useState<any[]>([])
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [tab, setTab] = useState<'available' | 'my'>('available')

  useEffect(() => {
    loadAvailable()
    loadMyOrders()
  }, [])

  const loadAvailable = async () => {
    const res = await masterAPI.availableOrders()
    setAvailableOrders(res.data.results || res.data)
  }

  const loadMyOrders = async () => {
    const res = await orderAPI.list()
    const all = res.data.results || res.data
    setMyOrders(all.filter((o: any) => o.master === user?.id))
  }

  const handleAccept = async (id: number) => {
    await orderAPI.accept(id)
    loadAvailable()
    loadMyOrders()
  }

  const handleStatusChange = async (id: number, status: string) => {
    await orderAPI.updateStatus(id, status)
    loadMyOrders()
    loadAvailable()
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{t('sidebar.listings')}</h1>

      <div className="flex gap-6 mb-6 border-b border-[var(--border)]">
        <button
          onClick={() => setTab('available')}
          className={`tab ${tab === 'available' ? 'active' : ''}`}
        >
          {t('master.available')} ({availableOrders.length})
        </button>
        <button
          onClick={() => setTab('my')}
          className={`tab ${tab === 'my' ? 'active' : ''}`}
        >
          {t('master.my_orders_tab')} ({myOrders.length})
        </button>
      </div>

      {tab === 'available' && (
        <div className="space-y-4">
          {availableOrders.length === 0 && (
            <p className="text-text-secondary text-center py-12">{t('order.no_new')}</p>
          )}
          {availableOrders.map((order: any) => (
            <OrderCard
              key={order.id}
              order={order}
              showActions
              onAccept={() => handleAccept(order.id)}
            />
          ))}
        </div>
      )}

      {tab === 'my' && (
        <div className="space-y-4">
          {myOrders.length === 0 && (
            <p className="text-text-secondary text-center py-12">{t('order.no_active')}</p>
          )}
          {myOrders.map((order: any) => (
            <OrderCard
              key={order.id}
              order={order}
              showActions
              onStatusChange={(status) => handleStatusChange(order.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
