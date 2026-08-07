'use client'

import { useTranslation } from 'react-i18next'
import { Wrench } from 'lucide-react'

export default function SidebarHeader({ open, role }: { open: boolean; role: string }) {
  const { t } = useTranslation()

  return (
    <div
      className={`px-5 pt-6 pb-5 border-b border-[var(--border)] ${
        open ? 'max-lg:block' : 'max-lg:hidden'
      } lg:block`}
    >
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0 shadow-[var(--shadow-primary)]">
          <Wrench size={19} className="text-[var(--on-primary)]" />
        </span>
        <div className="min-w-0">
          <h1 className="font-display font-extrabold text-base leading-tight" style={{ color: 'var(--text)' }}>
            {t('app.name')}
          </h1>
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--primary-active)' }}
          >
            {t(`role.${role}`)}
          </p>
        </div>
      </div>
    </div>
  )
}
