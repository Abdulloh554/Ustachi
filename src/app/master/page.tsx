'use client'

import { useEffect, useState } from 'react'
import { masterAPI, orderAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import OrdersSection from '@/components/master/OrdersSection'
import BalanceBadge from '@/components/master/BalanceBadge'
import { useTranslation } from 'react-i18next'
import { Inbox, ClipboardList, RefreshCw } from 'lucide-react'

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
    setMyOrders(all.filter((o: any) => String(o.master?.id || o.master) === String(user?.id)))
  }

  const handleRefresh = async () => {
    setLoading(true)
    await Promise.all([loadAvailable(), loadMyOrders(), loadProfile()])
    setLoading(false)
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
  const acceptHint = t('order.accept_hint').replace('{price}', ACCEPT_PRICE.toLocaleString('ru-RU'))

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('sidebar.listings')}</h1>
          <p className="caption mt-1">{t('master.orders_subtitle')}</p>
        </div>
        <BalanceBadge balance={balance} />
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'color-mix(in srgb, var(--danger) 12%, transparent)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <div className="flex items-end gap-6 mb-6 border-b border-[var(--border)]">
        <button
          onClick={() => setTab('available')}
          className={`tab ${tab === 'available' ? 'active' : ''}`}
        >
          {t('master.available')}
          <span className="tab-count">{availableOrders.length}</span>
        </button>
        <button
          onClick={() => setTab('my')}
          className={`tab ${tab === 'my' ? 'active' : ''}`}
        >
          {t('master.my_orders_tab')}
          <span className="tab-count">{myOrders.length}</span>
        </button>
      </div>

      {tab === 'available' && (
        <OrdersSection
          orders={availableOrders}
          loading={loading}
          emptyIcon={Inbox}
          emptyTitle={t('order.no_new')}
          emptyDescription={t('order.no_new_desc')}
          emptyAction={
            <button onClick={handleRefresh} className="btn btn-secondary">
              <RefreshCw size={16} /> {t('order.refresh')}
            </button>
          }
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
          emptyDescription={t('order.no_active_desc')}
          onStatusChange={handleStatusChange}
          onCancel={handleCancel}
        />
      )}

      {tab === 'available' && availableOrders.length > 0 && (
        <p className="caption mt-4 text-center">{acceptHint}</p>
      )}
    </div>
  )
}
