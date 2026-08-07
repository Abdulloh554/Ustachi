'use client'

import { useTranslation } from 'react-i18next'
import { Star, Wallet } from 'lucide-react'

export default function ProfileHeader({ profile }: { profile: any }) {
  const { t } = useTranslation()
  const name = profile.user?.first_name || t('role.unnamed')
  const initial = (profile.user?.first_name?.[0] || profile.user?.phone?.[0] || '?').toUpperCase()
  const professions = profile.professions || []

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
      <div className="flex items-center gap-5 min-w-0">
        <div className="avatar w-20 h-20 rounded-2xl text-3xl shrink-0">{initial}</div>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold leading-tight truncate">{name}</h2>
          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-sm">
              <Star size={15} fill="currentColor" style={{ color: 'var(--primary)' }} />
              <span className="font-bold" style={{ color: 'var(--text)' }}>{Number(profile.rating || 0).toFixed(1)}</span>
              <span className="caption">({profile.rating_count || 0})</span>
            </span>
            {profile.experience_years > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {profile.experience_years} {t('master.experience_label')}
                </span>
              </>
            )}
          </div>
          {professions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {professions.map((p: any) => (
                <span key={p.id} className="pill text-xs py-1 cursor-default">{p.icon} {p.name_uz}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 lg:ml-auto shrink-0">
        <div className="rounded-xl border border-[var(--primary)]/40 bg-[var(--primary-light)] px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1" style={{ color: 'var(--primary-active)' }}>
            <Wallet size={13} /> {t('master.balance')}
          </span>
          <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--primary-active)' }}>
            {Number(profile.balance || 0).toLocaleString('ru-RU')}
            <span className="text-xs font-medium ml-1">{t('order.price_label')}</span>
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg"
          style={{
            color: profile.is_available ? 'var(--success)' : 'var(--text-light)',
            background: profile.is_available ? '#F0FDF4' : 'var(--bg-secondary)',
          }}
        >
          <span
            className={`w-2 h-2 rounded-full ${profile.is_available ? '' : 'opacity-40'}`}
            style={{ background: profile.is_available ? 'var(--success)' : 'var(--text-light)' }}
          />
          {profile.is_available ? t('status.available') : t('status.busy')}
        </div>
      </div>
    </div>
  )
}
