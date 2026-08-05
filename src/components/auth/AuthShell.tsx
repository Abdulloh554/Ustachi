'use client'

import { useTranslation } from 'react-i18next'
import { Wrench, LucideIcon } from 'lucide-react'

interface BrandPoint {
  icon: LucideIcon
  textKey: string
}

interface AuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
  brandPoints?: BrandPoint[]
  maxWidth?: string
}

export default function AuthShell({
  title,
  subtitle,
  children,
  brandPoints,
  maxWidth = 'max-w-sm',
}: AuthShellProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12 text-white"
        style={{ background: 'var(--accent)' }}
      >
        <div className="relative flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Wrench size={22} />
          </span>
          <span className="font-display font-bold text-xl">{t('app.name')}</span>
        </div>

        <div className="relative max-w-sm">
          <h2 className="font-display font-bold text-3xl leading-tight mb-4">
            {t('landing.hero_title_1')} {t('landing.hero_title_2')}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-8">{t('landing.hero_desc')}</p>
          {brandPoints && (
            <div className="space-y-3">
              {brandPoints.map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.textKey} className="flex items-center gap-3 text-sm font-medium">
                    <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </span>
                    {t(p.textKey)}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="relative text-white/60 text-xs">&copy; 2026 {t('app.name')}</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className={`w-full ${maxWidth} animate-fade-in`}>
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <span className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <Wrench size={19} className="text-white" />
            </span>
            <span className="font-display font-bold text-lg">{t('app.name')}</span>
          </div>

          <h1 className="font-display text-2xl font-bold mb-1.5">{title}</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>

          {children}
        </div>
      </div>
    </div>
  )
}
