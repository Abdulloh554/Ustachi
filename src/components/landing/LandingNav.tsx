'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Wrench } from 'lucide-react'

export default function LandingNav() {
  const { user, isLoading } = useAuthStore()
  const { t } = useTranslation()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-[var(--border)] backdrop-blur-xl shadow-sm"
      style={{ background: 'rgba(var(--bg-rgb), 0.8)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow-primary)]">
            <Wrench size={18} className="text-[var(--on-primary)]" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
            {t('app.name')}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="skeleton h-9 w-32 rounded-full" />
          ) : user ? (
            <Link
              href={
                user.role === 'client' ? '/client' :
                user.role === 'master' ? '/master' :
                user.role === 'seller' ? '/seller' : '/admin'
              }
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
  )
}
