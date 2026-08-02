'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Wrench, Shield, Star, MapPin, ClipboardCheck, Sparkles, CheckCircle2 } from 'lucide-react'

const features = [
  { icon: ClipboardCheck, titleKey: 'landing.feature_1_title', descKey: 'landing.feature_1_desc' },
  { icon: Star, titleKey: 'landing.feature_2_title', descKey: 'landing.feature_2_desc' },
  { icon: MapPin, titleKey: 'landing.feature_3_title', descKey: 'landing.feature_3_desc' },
  { icon: Shield, titleKey: 'landing.feature_4_title', descKey: 'landing.feature_4_desc' },
]

const howItWorks = [
  { step: '1', titleKey: 'landing.how_1_title', descKey: 'landing.how_1_desc' },
  { step: '2', titleKey: 'landing.how_2_title', descKey: 'landing.how_2_desc' },
  { step: '3', titleKey: 'landing.how_3_title', descKey: 'landing.how_3_desc' },
  { step: '4', titleKey: 'landing.how_4_title', descKey: 'landing.how_4_desc' },
]

export default function LandingPage() {
  const { user, isLoading } = useAuthStore()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[var(--border)] backdrop-blur-xl"
        style={{ background: 'rgba(var(--bg-rgb), 0.78)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <Wrench size={18} className="text-white" />
            </span>
            <span className="font-display font-extrabold text-lg tracking-tight">{t('app.name')}</span>
          </Link>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="skeleton h-9 w-32 rounded-full" />
            ) : user ? (
              <Link
                href={user.role === 'client' ? '/client' : user.role === 'master' ? '/master' : '/admin'}
                className="btn btn-primary px-4 py-2 text-sm"
              >
                {t('nav.go_to_panel')} <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost px-4 py-2 text-sm">
                  {t('nav.login')}
                </Link>
                <Link href="/auth/register" className="btn btn-primary px-4 py-2 text-sm">
                  {t('nav.start')} <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
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

      {/* Features */}
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

      {/* How it works */}
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white"
            style={{ background: 'var(--accent)' }}>
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">{t('landing.cta_title')}</h2>
              <p className="text-base mb-8 opacity-90 max-w-md mx-auto">{t('landing.cta_desc')}</p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold"
                style={{ background: 'var(--bg)', color: 'var(--accent)' }}
              >
                {t('landing.cta_btn')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-1 text-center">
          <p className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>{t('app.name')}</p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-light)' }}>
            <CheckCircle2 size={12} /> &copy; 2026 {t('app.name')}. {t('landing.footer')}
          </p>
        </div>
      </footer>
    </div>
  )
}
