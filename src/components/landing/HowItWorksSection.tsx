'use client'

import { useTranslation } from 'react-i18next'

const howItWorks = [
  { step: '1', titleKey: 'landing.how_1_title', descKey: 'landing.how_1_desc' },
  { step: '2', titleKey: 'landing.how_2_title', descKey: 'landing.how_2_desc' },
  { step: '3', titleKey: 'landing.how_3_title', descKey: 'landing.how_3_desc' },
  { step: '4', titleKey: 'landing.how_4_title', descKey: 'landing.how_4_desc' },
]

export default function HowItWorksSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            {t('landing.how_title')}
          </p>
          <h2 className="text-3xl font-bold tracking-tight">{t('landing.how_title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-5 left-[12%] right-[12%] h-px bg-[var(--border)]" />
          {howItWorks.map((item) => (
            <div key={item.step} className="text-center relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 text-white font-display relative z-10 bg-[var(--accent)]">
                {item.step}
              </div>
              <h3 className="font-display font-bold text-base mb-1.5">{t(item.titleKey)}</h3>
              <p className="text-sm leading-relaxed px-2" style={{ color: 'var(--text-secondary)' }}>{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
