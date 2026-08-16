'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Banknote, Wallet, PiggyBank, CheckCircle2 } from 'lucide-react'
import { workshopAPI } from '@/lib/api'
import StatCard from '@/components/crm/StatCard'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { formatMoney } from '@/lib/utils'

function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export default function ReportsPage() {
  const { t } = useTranslation()
  const [from, setFrom] = useState(todayStr())
  const [to, setTo] = useState(todayStr())
  const [data, setData] = useState<any>(null)

  const load = useCallback(async (fromD: string, toD: string) => {
    try {
      const res = await workshopAPI.reports({ from: fromD, to: toD })
      setData(res.data)
    } catch {
      setData(null)
    }
  }, [])

  useEffect(() => {
    load(from, to)
  }, [from, to, load])

  if (!data) return <DashboardSkeleton />

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight mb-2">{t('crm.reports_title')}</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{t('crm.reports_subtitle')}</p>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.from')}</label>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.to')}</label>
          <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('crm.revenue')} value={`${formatMoney(data.revenue)} so'm`} icon={Banknote} accent="success" />
        <StatCard label={t('crm.expense')} value={`${formatMoney(data.expense)} so'm`} icon={Wallet} accent="danger" />
        <StatCard label={t('crm.net_profit')} value={`${formatMoney(data.net_profit)} so'm`} icon={PiggyBank} />
        <StatCard label={t('crm.orders_completed')} value={data.orders_completed} icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">{t('crm.by_status')}</h2>
          {(() => {
            const entries = Object.entries(data.by_status || {})
            const max = Math.max(1, ...entries.map(([, c]) => c as number))
            return (
              <ul className="space-y-3">
                {entries.map(([status, count]) => (
                  <li key={status}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize" style={{ color: 'var(--text)' }}>{t(`status.${status}`)}</span>
                      <span className="font-semibold tabular-nums">{count as number}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${((count as number) / max) * 100}%`, background: 'var(--primary)' }}
                      />
                    </div>
                  </li>
                ))}
                {entries.length === 0 ? (
                  <li className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.no_active')}</li>
                ) : null}
              </ul>
            )
          })()}
        </div>

        <div className="card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">{t('crm.by_service')}</h2>
          <ul className="space-y-2">
            {data.by_service.map((s: any) => (
              <li key={s.service_id} className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text)' }}>{s.name}</span>
                <span className="font-semibold">
                  {s.count} · {formatMoney(s.revenue)} so'm
                </span>
              </li>
            ))}
            {data.by_service.length === 0 ? (
              <li className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.no_active')}</li>
            ) : null}
          </ul>
        </div>

        <div className="card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">{t('crm.by_staff')}</h2>
          <ul className="space-y-2">
            {data.by_staff.map((s: any) => (
              <li key={s.staff_id} className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text)' }}>{s.staff_name}</span>
                <span className="font-semibold">
                  {s.completed} · {formatMoney(s.revenue)} so'm
                </span>
              </li>
            ))}
            {data.by_staff.length === 0 ? (
              <li className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.no_active')}</li>
            ) : null}
          </ul>
        </div>

        <div className="card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">{t('crm.daily')}</h2>
          {data.daily.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('crm.no_active')}</p>
          ) : (
            <div className="flex items-end gap-3 h-44">
              {(() => {
                const max = Math.max(1, ...data.daily.map((d: any) => d.revenue))
                return data.daily.map((d: any) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full">
                    <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-light)' }}>{formatMoney(d.revenue)}</span>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      title={`${d.date}: ${d.orders} · ${formatMoney(d.revenue)}`}
                      style={{
                        height: `${Math.max(5, (d.revenue / max) * 100)}%`,
                        background: 'var(--primary)',
                        minHeight: 5,
                      }}
                    />
                    <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{d.date}</span>
                  </div>
                ))
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
