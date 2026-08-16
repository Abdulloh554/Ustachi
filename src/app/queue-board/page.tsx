'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MonitorPlay, RefreshCw } from 'lucide-react'
import { workshopAPI } from '@/lib/api'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { formatMoney, formatDate } from '@/lib/utils'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function QueueBoardPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const now = useClock()

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await workshopAPI.dashboard()
        if (alive) {
          setData(res.data)
          setUpdatedAt(new Date())
          setError('')
        }
      } catch {
        if (alive) setError(t('crm.error'))
      }
    }
    load()
    const id = setInterval(load, 15000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [t])

  if (!data) {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <MonitorPlay size={40} style={{ color: 'var(--text-light)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>{t('crm.refresh')}</button>
        </div>
      )
    }
    return <DashboardSkeleton />
  }

  const queue = data.queue || []
  const active = (data.today?.queued || 0) + (data.today?.assigned || 0) + (data.today?.in_progress || 0)
  const serving = queue.find((o: any) => o.status === 'in_progress') || null
  const nextUp = queue.find((o: any) => o.status === 'queued' || o.status === 'assigned') || null
  const clock = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const today = now.toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('crm.queue_board_title')}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {data.workshop?.name} · {active} {t('crm.queue_waiting').toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'var(--primary-bg)', color: 'var(--primary-active)' }}>
            <RefreshCw size={12} className={updatedAt ? '' : 'animate-spin'} />
            {updatedAt ? formatDate(updatedAt.toISOString()) : t('crm.updated')}
          </span>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>{clock}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--text-light)' }}>{today}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'var(--primary-bg)' }} />
          <div className="relative">
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--primary-active)' }}>
              {t('crm.now_serving')}
            </p>
            {serving ? (
              <>
                <p className="text-6xl font-bold" style={{ color: 'var(--primary-active)' }}>#{serving.queue_number}</p>
                <p className="mt-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>{serving.service_type}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {serving.client_name || serving.client_details?.first_name || '—'}
                </p>
                {serving.assigned_staff_details?.first_name && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>
                    {serving.assigned_staff_details.first_name} {serving.assigned_staff_details.last_name || ''}
                  </p>
                )}
              </>
            ) : (
              <p className="text-5xl font-bold py-6" style={{ color: 'var(--text-light)' }}>—</p>
            )}
          </div>
        </div>

        <div className="card rounded-2xl p-6">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{t('crm.next_up')}</p>
          {nextUp ? (
            <>
              <p className="text-5xl font-bold" style={{ color: 'var(--text)' }}>#{nextUp.queue_number}</p>
              <p className="mt-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>{nextUp.service_type}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {nextUp.client_name || nextUp.client_details?.first_name || '—'}
              </p>
              {nextUp.scheduled_at && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>
                  {t('crm.client_scheduled')}: {formatDate(nextUp.scheduled_at)}
                </p>
              )}
            </>
          ) : (
            <p className="text-5xl font-bold py-6" style={{ color: 'var(--text-light)' }}>—</p>
          )}
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="card rounded-2xl py-20 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>{t('crm.no_queue')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {queue.map((o: any) => {
            const isServing = o.id === serving?.id
            return (
              <div
                key={o.id}
                className={`card rounded-2xl p-5 ${isServing ? 'ring-2 ring-[var(--primary)]' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl font-bold tabular-nums" style={{ color: isServing ? 'var(--primary-active)' : 'var(--text)' }}>
                    #{o.queue_number}
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={
                      o.status === 'in_progress'
                        ? { background: 'var(--primary-light)', color: 'var(--primary-active)' }
                        : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }
                    }
                  >
                    {t(`status.${o.status}`)}
                  </span>
                </div>
                <p className="font-semibold leading-snug" style={{ color: 'var(--text)' }}>{o.service_type}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {o.client_name || o.client_details?.first_name || '—'}
                </p>
                {o.price ? (
                  <p className="text-xs mt-2 font-medium" style={{ color: 'var(--text-light)' }}>{formatMoney(o.price)} so'm</p>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <p className="text-center text-xs mt-6" style={{ color: 'var(--text-light)' }}>
        {t('crm.queue_board_hint')}
      </p>
    </div>
  )
}
