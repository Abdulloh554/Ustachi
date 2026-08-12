'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { storeAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Trash2, Store, CheckCircle2, Loader2 } from 'lucide-react'
import { formatMoney } from '@/lib/utils'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    category: string
    price: string
    quantity: number
    store_name: string
  }
}

export default function ClientCartPage() {
  const { t } = useTranslation()
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState('0')
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    storeAPI.cart()
      .then((res) => {
        setItems(res.data.items || [])
        setTotal(res.data.total || '0')
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (id: string) => {
    await storeAPI.removeFromCart(id)
    load()
  }

  const checkout = async () => {
    setCheckingOut(true)
    setError('')
    try {
      const res = await storeAPI.checkout()
      setDone(true)
      setTotal(res.data.total || '0')
    } catch (err: any) {
      const msg = err.response?.data
      if (typeof msg === 'string') setError(msg)
      else if (msg?.error) setError(msg.error)
      else setError(t('auth.error_occurred'))
      load()
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card rounded-2xl">
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'color-mix(in srgb, var(--success) 15%, transparent)', color: 'var(--success)' }}
            >
              <CheckCircle2 size={32} />
            </div>
            <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{t('store.checkout_success')}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('store.total')}: <span className="font-bold" style={{ color: 'var(--text)' }}>{formatMoney(total)} so'm</span>
            </p>
            <Link href="/client/store" className="btn btn-primary mt-6">
              <Store size={16} className="mr-1.5" /> {t('store.back_to_store')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold leading-tight">{t('store.cart_title')}</h1>
        <p className="caption mt-1">{t('store.cart_subtitle')}</p>
      </div>

      {items.length === 0 ? (
        <div className="card rounded-2xl">
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-[var(--border)]"
              style={{ background: 'var(--surface)', color: 'var(--text-light)' }}
            >
              <ShoppingCart size={24} />
            </div>
            <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>{t('store.cart_empty')}</p>
            <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
              {t('store.cart_empty_desc')}
            </p>
            <Link href="/client/store" className="btn btn-primary mt-5">
              <Store size={16} className="mr-1.5" /> {t('store.back_to_store')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card rounded-2xl p-5 animate-fade-in-up">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{item.product.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                      {item.product.store_name} {item.product.category ? `· ${item.product.category}` : ''}
                    </p>
                  </div>
                  <button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] shrink-0" aria-label="Remove">
                    <Trash2 size={16} style={{ color: 'var(--error)' }} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {t('store.quantity')}: <b style={{ color: 'var(--text)' }}>{item.quantity}</b>
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    {formatMoney(Number(item.product.price) * item.quantity)} so'm
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="card rounded-2xl p-6 h-fit lg:sticky lg:top-8">
            <h2 className="font-semibold text-sm mb-4">{t('store.cart_title')}</h2>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('store.total')}</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{formatMoney(total)} so'm</span>
            </div>
            {error && <p className="error mt-3">{error}</p>}
            <button className="btn btn-primary w-full mt-4" onClick={checkout} disabled={checkingOut}>
              {checkingOut && <Loader2 size={16} className="inline animate-spin mr-2" />}
              {t('store.checkout')}
            </button>
            <Link
              href="/client/store"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold mt-4 hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              <Store size={13} /> {t('store.back_to_store')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
