'use client'

import { useEffect, useState } from 'react'
import { masterAPI, orderAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import OrdersSection from '@/components/master/OrdersSection'
import BalanceBadge from '@/components/master/BalanceBadge'
import { useTranslation } from 'react-i18next'
import { Inbox, ClipboardList } from 'lucide-react'

const ACCEPT_PRICE = 4999

export default function MasterOrdersPage() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [availableOrders, setAvailableOrders] = useState<any[]>([])
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'available' | 'my'>('available')
  const [balance, setBalance] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAvailable()
    loadMyOrders()
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await masterAPI.myProfile()
      setBalance(Number(res.data.balance))
    } catch {
      setBalance(null)
    }
  }

  const loadAvailable = async () => {
    const res = await masterAPI.availableOrders()
    setAvailableOrders(res.data.results || res.data)
    setLoading(false)
  }

  const loadMyOrders = async () => {
    const res = await orderAPI.list()
    const all = res.data.results || res.data
    setMyOrders(all.filter((o: any) => o.master === user?.id))
  }

  const handleAccept = async (id: number) => {
    setError('')
    try {
      await orderAPI.accept(id)
      await loadProfile()
      loadAvailable()
      loadMyOrders()
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.error || t('master.insufficient_balance'))
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await orderAPI.updateStatus(id, status)
      loadMyOrders()
      loadAvailable()
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.error || t('auth.error_occurred'))
    }
  }

  const handleCancel = async (id: number) => {
    setError('')
    try {
      await orderAPI.cancel(id)
      loadMyOrders()
      loadAvailable()
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.error || t('auth.error_occurred'))
    }
  }

  const canAccept = balance != null && balance >= ACCEPT_PRICE

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold">{t('sidebar.listings')}</h1>
        <BalanceBadge balance={balance} />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'color-mix(in srgb, var(--danger) 12%, transparent)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

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
        <OrdersSection
          orders={availableOrders}
          loading={loading}
          emptyIcon={Inbox}
          emptyTitle={t('order.no_new')}
          acceptPrice={ACCEPT_PRICE}
          acceptDisabled={!canAccept}
          onAccept={handleAccept}
        />
      )}

      {tab === 'my' && (
        <OrdersSection
          orders={myOrders}
          loading={loading}
          emptyIcon={ClipboardList}
          emptyTitle={t('order.no_active')}
          onStatusChange={handleStatusChange}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
