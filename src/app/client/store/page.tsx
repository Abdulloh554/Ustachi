'use client'

import { useCallback, useEffect, useState } from 'react'
import { storeAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { Package, Heart, ShoppingCart, Store, Search, Check } from 'lucide-react'
import { formatMoney } from '@/lib/utils'

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: string
  quantity: number
  store: number
  store_name: string
}

export default function ClientStorePage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'all' | 'saved'>('all')
  const [added, setAdded] = useState<Set<number>>(new Set())

  const loadProducts = useCallback(() => {
    storeAPI.products()
      .then((res) => setProducts(res.data.results || res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const loadFavorites = useCallback(() => {
    storeAPI.favorites()
      .then((res) => {
        const list = res.data.results || res.data
        setSavedIds(new Set((list as any[]).map((f) => f.product?.id).filter(Boolean)))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadProducts()
    loadFavorites()
  }, [loadProducts, loadFavorites])

  const toggleFavorite = async (id: number) => {
    const res = await storeAPI.toggleFavorite(id)
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (res.data.favorited) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const addToCart = async (id: number) => {
    try {
      await storeAPI.addToCart(id, 1)
      setAdded((prev) => new Set(prev).add(id))
      setTimeout(() => setAdded((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      }), 1500)
    } catch {}
  }

  const filtered = products.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase())
    const matchesTab = tab === 'saved' ? savedIds.has(p.id) : true
    return matchesQuery && matchesTab
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 space-y-3">
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold leading-tight">{t('store.title')}</h1>
        <p className="caption mt-1">{t('store.subtitle')}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
            <Search size={15} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('store.search')}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('all')}
            className={`pill text-sm ${tab === 'all' ? 'active' : ''}`}
          >
            {t('store.all_tab')}
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`pill text-sm ${tab === 'saved' ? 'active' : ''}`}
          >
            {t('store.saved_tab')} ({savedIds.size})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card rounded-2xl">
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-[var(--border)]"
              style={{ background: 'var(--surface)', color: 'var(--text-light)' }}
            >
              <Package size={24} />
            </div>
            <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>
              {tab === 'saved' ? t('store.saved_empty') : t('store.store_empty')}
            </p>
            <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
              {tab === 'saved' ? t('store.saved_empty_desc') : ''}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, index) => {
            const isSaved = savedIds.has(p.id)
            const inCart = added.has(p.id)
            return (
              <div
                key={p.id}
                className="card rounded-2xl p-5 animate-fade-in-up flex flex-col gap-3"
                style={{ animationDelay: `${(index % 6) * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[var(--primary-light)] text-[var(--primary-active)] flex items-center justify-center shrink-0">
                      <Package size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{p.name}</p>
                      <p className="text-xs mt-0.5 flex items-center gap-1 truncate" style={{ color: 'var(--text-light)' }}>
                        <Store size={12} /> {p.store_name || '—'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] shrink-0"
                    aria-label="Save"
                  >
                    <Heart
                      size={18}
                      className="transition-colors"
                      fill={isSaved ? 'var(--primary)' : 'transparent'}
                      style={{ color: isSaved ? 'var(--primary)' : 'var(--text-light)' }}
                    />
                  </button>
                </div>

                {p.category && (
                  <span className="pill text-xs self-start" style={{ color: 'var(--text-secondary)' }}>
                    {p.category}
                  </span>
                )}

                <div className="flex items-center justify-between pt-1 mt-auto">
                  <div>
                    <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{formatMoney(p.price)} so'm</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                      {p.quantity > 0 ? `${t('store.in_stock')}: ${p.quantity}` : t('store.no_stock')}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(p.id)}
                    disabled={p.quantity === 0}
                    className={`btn btn-sm ${inCart ? 'btn-success' : 'btn-primary'}`}
                  >
                    {inCart ? <Check size={15} className="mr-1" /> : <ShoppingCart size={15} className="mr-1" />}
                    {inCart ? t('store.added_to_cart') : t('store.add_to_cart')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
