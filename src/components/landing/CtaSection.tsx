'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white"
          style={{ background: 'var(--primary)' }}>
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">{t('landing.cta_title')}</h2>
            <p className="text-base mb-8 opacity-90 max-w-md mx-auto">{t('landing.cta_desc')}</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold"
              style={{ background: 'var(--bg)', color: 'var(--primary)' }}
            >
              {t('landing.cta_btn')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
