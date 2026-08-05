'use client'

import { useTranslation } from 'react-i18next'
import { ClipboardCheck, Star, MapPin, Shield } from 'lucide-react'

const features = [
  { icon: ClipboardCheck, titleKey: 'landing.feature_1_title', descKey: 'landing.feature_1_desc' },
  { icon: Star, titleKey: 'landing.feature_2_title', descKey: 'landing.feature_2_desc' },
  { icon: MapPin, titleKey: 'landing.feature_3_title', descKey: 'landing.feature_3_desc' },
  { icon: Shield, titleKey: 'landing.feature_4_title', descKey: 'landing.feature_4_desc' },
]

export default function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            {t('app.name')}
          </p>
          <h2 className="text-3xl font-bold tracking-tight mb-3">{t('landing.feature_title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.titleKey} className="card card-hover p-6 rounded-2xl">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[var(--accent)]">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-base mb-1.5">{t(f.titleKey)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t(f.descKey)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
