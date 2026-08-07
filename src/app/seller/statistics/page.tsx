'use client'

import { useEffect, useState } from 'react'
import { storeAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp, TrendingDown, Wallet, Package, ShoppingCart, BarChart3, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { formatMoney } from '@/lib/utils'

interface Stat {
  product_id: number
  name: string
  quantity_sold: number
  revenue: string
  units_in_stock: number
}

export default function SellerStatisticsPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    storeAPI.statistics().then((res) => setData(res.data))
  }, [])

  useEffect(() => {
    if (!data) return
    const id = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [data])

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat rounded-xl">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg mt-2" />
            </div>
          ))}
        </div>
        <div className="card p-6 space-y-4">
          <Skeleton className="h-5 w-40 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const noSales = Number(data.sales_count) === 0
  const profit = Number(data.net_profit)

  const cards = [
    { labelKey: 'seller.revenue', value: formatMoney(data.total_revenue), icon: TrendingUp, color: 'var(--success)' },
    { labelKey: 'seller.expense', value: formatMoney(data.total_expense), icon: TrendingDown, color: 'var(--error)' },
    { labelKey: 'seller.net_profit', value: formatMoney(profit), icon: Wallet, color: profit >= 0 ? 'var(--success)' : 'var(--error)' },
    { labelKey: 'seller.units_sold', value: String(data.total_units_sold), icon: Package, color: 'var(--primary)' },
    { labelKey: 'seller.sales_count', value: String(data.sales_count), icon: ShoppingCart, color: 'var(--primary)' },
    { labelKey: 'seller.balance', value: `${formatMoney(data.balance)} so'm`, icon: Wallet, color: 'var(--primary)' },
  ]

  const productTable: Stat[] = data.product_stats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold leading-tight">{t('seller.statistics_title')}</h1>
        <p className="caption mt-1">{t('seller.statistics_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={card.labelKey} className="stat rounded-xl animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
              <div className="flex items-center gap-3">
                <div className="stat-icon" style={{ backgroundColor: card.color }}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{t(card.labelKey)}</p>
                  <p className="text-lg font-semibold truncate">{card.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {noSales ? (
        <div className="card rounded-2xl">
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-[var(--border)]"
              style={{ background: 'var(--surface)', color: 'var(--text-light)' }}
            >
              <BarChart3 size={24} />
            </div>
            <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>{t('seller.no_sales')}</p>
            <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
              {t('seller.no_sales_desc')}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '180ms' }}>
              <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <ArrowUpRight size={18} style={{ color: 'var(--success)' }} /> {t('seller.top_products')}
              </h2>
              <div className="space-y-3">
                {data.top_products.length === 0 && (
                  <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('seller.no_sales')}</p>
                )}
                {data.top_products.map((p: any, i: number) => (
                  <div key={p.product_id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm truncate" style={{ color: 'var(--text)' }}>{p.name}</span>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {p.quantity_sold} {t('seller.units')} · {formatMoney(p.revenue)} so'm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '220ms' }}>
              <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <ArrowDownRight size={18} style={{ color: 'var(--error)' }} /> {t('seller.least_products')}
              </h2>
              <div className="space-y-3">
                {data.least_products.length === 0 && (
                  <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('seller.no_sales')}</p>
                )}
                {data.least_products.map((p: any, i: number) => (
                  <div key={p.product_id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm truncate" style={{ color: 'var(--text)' }}>{p.name}</span>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {p.quantity_sold} {t('seller.units')} · {formatMoney(p.revenue)} so'm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '260ms' }}>
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Package size={18} style={{ color: 'var(--primary)' }} /> {t('seller.product_stats')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest" style={{ color: 'var(--text-light)' }}>
                    <th className="pb-3 font-semibold">{t('seller.product')}</th>
                    <th className="pb-3 font-semibold">{t('seller.sold')}</th>
                    <th className="pb-3 font-semibold text-right">{t('seller.revenue')}</th>
                    <th className="pb-3 font-semibold text-right">{t('seller.in_stock')}</th>
                  </tr>
                </thead>
                <tbody>
                  {productTable.map((p) => (
                    <tr key={p.product_id} className="border-t border-[var(--border)]">
                      <td className="py-3 font-medium" style={{ color: 'var(--text)' }}>{p.name}</td>
                      <td className="py-3">{p.quantity_sold} {t('seller.units')}</td>
                      <td className="py-3 text-right font-semibold">{formatMoney(p.revenue)} so'm</td>
                      <td className="py-3 text-right">{p.units_in_stock} {t('seller.units')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data.recent_sales.length > 0 && (
            <div className="card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <ShoppingCart size={18} style={{ color: 'var(--primary)' }} /> {t('seller.recent_sales')}
              </h2>
              <div className="space-y-3">
                {data.recent_sales.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                        {s.items.map((i: any) => `${i.product_name} ×${i.quantity}`).join(', ')}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                        {new Date(s.created_at).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                    <span className="text-sm font-bold shrink-0">{formatMoney(s.total)} so'm</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
