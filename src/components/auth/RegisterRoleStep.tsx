'use client'

import { useTranslation } from 'react-i18next'
import { User, Wrench } from 'lucide-react'

interface RegisterRoleStepProps {
  onSelect: (role: 'client' | 'master') => void
}

export default function RegisterRoleStep({ onSelect }: RegisterRoleStepProps) {
  const { t } = useTranslation()

  const roleCard = (
    role: 'client' | 'master',
    Icon: typeof User,
    titleKey: string,
    descKey: string
  ) => (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className="group p-6 rounded-2xl text-center border-2 transition-all"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      <div
        className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors"
        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
      >
        <Icon size={24} />
      </div>
      <div className="font-display font-bold text-sm">{t(titleKey)}</div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
        {t(descKey)}
      </div>
    </button>
  )

  return (
    <div className="card rounded-2xl p-8">
      <label className="block text-sm font-semibold mb-3">{t('role.choose')}</label>
      <div className="grid grid-cols-2 gap-4">
        {roleCard('client', User, 'role.client', 'role.client_desc')}
        {roleCard('master', Wrench, 'role.master', 'role.master_desc')}
      </div>
    </div>
  )
}
