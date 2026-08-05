'use client'

import { useTranslation } from 'react-i18next'
import { Wrench } from 'lucide-react'

export default function SidebarHeader({ open, role }: { open: boolean; role: string }) {
  const { t } = useTranslation()

  return (
    <div
      className={`px-5 pt-5 pb-5 bg-[var(--accent)] text-white ${
        open ? 'max-lg:block' : 'max-lg:hidden'
      } lg:block`}
    >
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Wrench size={19} />
        </span>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-base leading-tight text-white">{t('app.name')}</h1>
          <p className="text-[11px] text-white/80 capitalize">{t(`role.${role}`)}</p>
        </div>
      </div>
      <div className="mt-5 h-px bg-white/20" />
      <p className="mt-3 text-[10px] uppercase tracking-widest text-white/70">{t('app.name')}</p>
    </div>
  )
}
