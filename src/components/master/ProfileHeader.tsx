'use client'

import { useTranslation } from 'react-i18next'

export default function ProfileHeader({ profile }: { profile: any }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="avatar w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ color: 'var(--accent)' }}>
        {(profile.user?.first_name?.[0] || profile.user?.phone?.[0] || '?').toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-lg">{profile.user?.first_name || t('role.unnamed')}</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('master.rating')}: {profile.rating.toFixed(1)} ({profile.rating_count})</p>
      </div>
      <div className="flex flex-col items-end gap-1 px-4 py-2 rounded-xl font-bold"
        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
        <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{t('master.balance')}</span>
        <span className="text-lg">
          {Number(profile.balance || 0).toLocaleString('ru-RU')} <span className="text-xs font-medium opacity-80">{t('order.price_label')}</span>
        </span>
      </div>
    </div>
  )
}
