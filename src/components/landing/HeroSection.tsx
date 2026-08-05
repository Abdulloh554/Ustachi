'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative pt-40 pb-24 px-6">
      <div className="relative max-w-3xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-7 border border-[var(--border)]"
          style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}>
          <Sparkles size={13} style={{ color: 'var(--accent)' }} />
          {t('landing.hero_badge')}
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
          {t('landing.hero_title_1')}<br />
          <span style={{ color: 'var(--accent)' }}>
            {t('landing.hero_title_2')}
          </span>
        </h1>

        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
          {t('landing.hero_desc')}
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/auth/register" className="btn btn-primary px-7 py-3 text-base">
            {t('landing.cta_btn')} <ArrowRight size={17} />
          </Link>
          <Link href="/client/masters" className="btn btn-ghost px-7 py-3 text-base">
            {t('nav.view_masters')}
          </Link>
        </div>
      </div>
    </section>
  )
}
