'use client'

import { useEffect, useState } from 'react'
import { masterAPI, orderAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import OrderCard from '@/components/OrderCard'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonCardList } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { Wallet, Inbox, ClipboardList } from 'lucide-react'

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

  const canAccept = balance != null && balance >= ACCEPT_PRICE

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">{t('sidebar.listings')}</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <Wallet size={16} />
          <span>{balance != null ? balance.toLocaleString('ru-RU') : '...'}</span>
          <span className="font-medium opacity-80">{t('order.price_label')}</span>
        </div>
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
        <div className="space-y-4">
          {loading ? (
            <SkeletonCardList count={3} />
          ) : (
            <>
              {availableOrders.length === 0 && (
                <EmptyState
                  icon={<Inbox size={24} />}
                  title={t('order.no_new')}
                />
              )}
              {availableOrders.map((order: any, index) => (
                <div key={order.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                  <OrderCard
                    order={order}
                    showActions
                    acceptPrice={ACCEPT_PRICE}
                    acceptDisabled={!canAccept}
                    onAccept={() => handleAccept(order.id)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab === 'my' && (
        <div className="space-y-4">
          {loading ? (
            <SkeletonCardList count={3} />
          ) : (
            <>
              {myOrders.length === 0 && (
                <EmptyState
                  icon={<ClipboardList size={24} />}
                  title={t('order.no_active')}
                />
              )}
              {myOrders.map((order: any, index) => (
                <div key={order.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                  <OrderCard
                    order={order}
                    showActions
                    onStatusChange={(status) => handleStatusChange(order.id, status)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
