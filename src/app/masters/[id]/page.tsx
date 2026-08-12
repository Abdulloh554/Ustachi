'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { masterAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Wrench, Star, MapPin, Calendar } from 'lucide-react'

export default function MasterDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [master, setMaster] = useState<any>(null)
  const [works, setWorks] = useState<any[]>([])
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      masterAPI.detail(String(id)),
      masterAPI.works(String(id)),
    ])
      .then(([mRes, wRes]) => {
        setMaster(mRes.data)
        setWorks(wRes.data.results || wRes.data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="skeleton h-8 w-32 rounded-lg" />
          <div className="skeleton h-44 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (notFound || !master) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-5xl font-extrabold mb-3" style={{ color: 'var(--primary)' }}>404</p>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{t('order.not_found')}</p>
        <Link href="/client/masters" className="btn btn-primary px-5 py-2.5 text-sm">
          <ArrowLeft size={16} /> {t('client.all_masters')}
        </Link>
      </div>
    )
  }

  const name = master.user?.first_name || master.user?.phone || '?'

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] backdrop-blur-xl"
        style={{ background: 'rgba(var(--bg-rgb), 0.78)' }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Wrench size={16} className="text-white" />
            </span>
            <span className="font-display font-extrabold">{t('app.name')}</span>
          </Link>
          <Link href="/client/masters" className="btn btn-ghost px-3 py-1.5 text-sm">
            <ArrowLeft size={15} /> {t('client.all_masters')}
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
        <div className="card rounded-2xl p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="avatar w-16 h-16 rounded-2xl text-2xl shrink-0">{name[0].toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-extrabold text-xl truncate">{name}</h1>
                <span className={`w-2.5 h-2.5 rounded-full ${master.is_available ? '' : 'opacity-40'}`}
                  style={{ background: master.is_available ? 'var(--success)' : 'var(--text-light)', boxShadow: master.is_available ? '0 0 0 4px color-mix(in srgb, var(--success) 20%, transparent)' : 'none' }} />
              </div>
              <div className="flex items-center gap-3 text-sm mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--text)' }}>
                  <Star size={14} fill="currentColor" style={{ color: 'var(--primary)' }} />
                  {master.rating.toFixed(1)} ({master.rating_count})
                </span>
                <span className="text-xs" style={{ color: master.is_available ? 'var(--success)' : 'var(--danger)' }}>
                  {master.is_available ? t('status.available') : t('master.not_available')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {master.professions?.map((p: any) => (
                  <span key={p.id} className="pill text-xs py-1 px-2.5 cursor-default">{p.icon} {p.name_uz}</span>
                ))}
              </div>
            </div>
          </div>

          {master.experience_years > 0 && (
            <p className="text-xs mt-4 flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-light)' }}>
              <Calendar size={12} /> {master.experience_years} {t('master.experience_label')}
            </p>
          )}
          {master.bio && (
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{master.bio}</p>
          )}
        </div>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">{t('master.works')}</h2>
          <div className="space-y-3">
            {works.length === 0 && (
              <p className="text-sm py-10 text-center" style={{ color: 'var(--text-light)' }}>{t('master.works_empty')}</p>
            )}
            {works.map((work: any) => (
              <div key={work.id} className="card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold">{work.title}</h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-light)' }}>
                      {t('order.status')}
                    </span>
                    <StatusBadge status={work.status} />
                  </div>
                </div>
                {work.rating != null && (
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={15}
                        fill={n <= work.rating ? 'currentColor' : 'none'}
                        style={{ color: n <= work.rating ? 'var(--primary)' : 'var(--text-light)' }}
                      />
                    ))}
                  </div>
                )}
                {work.description && (
                  <p className="text-sm line-clamp-2 mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {work.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: 'var(--text-light)' }}>
                  {work.address && (
                    <span className="flex items-center gap-1"><MapPin size={12} /> {work.address}</span>
                  )}
                  <span>{formatDate(work.created_at)}</span>
                  {work.price && (
                    <span className="font-bold" style={{ color: 'var(--success)' }}>{work.price} {t('order.price_label')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
