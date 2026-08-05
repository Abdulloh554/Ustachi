'use client'

import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'

export default function LandingFooter() {
  const { t } = useTranslation()

  return (
    <footer className="py-8 px-6 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-1 text-center">
        <p className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>{t('app.name')}</p>
        <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-light)' }}>
          <CheckCircle2 size={12} /> &copy; 2026 {t('app.name')}. {t('landing.footer')}
        </p>
      </div>
    </footer>
  )
}
