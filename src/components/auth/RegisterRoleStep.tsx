'use client'

import { useTranslation } from 'react-i18next'
import { User, Wrench, Store } from 'lucide-react'

interface RegisterRoleStepProps {
  onSelect: (role: 'client' | 'master' | 'seller') => void
}

export default function RegisterRoleStep({ onSelect }: RegisterRoleStepProps) {
  const { t } = useTranslation()

  const roleCard = (
    role: 'client' | 'master' | 'seller',
    Icon: typeof User,
    titleKey: string,
    descKey: string
  ) => (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className="group p-5 rounded-xl text-center border-2 bg-[var(--surface)] border-[var(--border)] transition-all duration-200 hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
    >
      <div className="w-11 h-11 rounded-xl mx-auto mb-2.5 flex items-center justify-center bg-[var(--primary-light)] text-[var(--primary-active)] transition-all duration-200 group-hover:bg-[var(--primary)] group-hover:text-[var(--on-primary)] group-hover:shadow-[var(--shadow-primary)]">
        <Icon size={22} />
      </div>
      <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{t(titleKey)}</div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
        {t(descKey)}
      </div>
    </button>
  )

  return (
    <div className="card rounded-xl p-8">
      <label className="block text-sm font-semibold mb-3">{t('role.choose')}</label>
      <div className="grid gap-4 sm:grid-cols-3">
        {roleCard('client', User, 'role.client', 'role.client_desc')}
        {roleCard('master', Wrench, 'role.master', 'role.master_desc')}
        {roleCard('seller', Store, 'role.seller', 'role.seller_desc')}
      </div>
    </div>
  )
}
