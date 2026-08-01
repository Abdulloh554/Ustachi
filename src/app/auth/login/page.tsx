'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Wrench, ShieldCheck, Star, Phone } from 'lucide-react'

const brandPoints = [
  { icon: ShieldCheck, textKey: 'landing.feature_4_title' },
  { icon: Star, textKey: 'landing.feature_2_title' },
]

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const { t } = useTranslation()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(phone, password)
      const routes: Record<string, string> = {
        client: '/client',
        master: '/master',
        admin: '/admin',
      }
      router.push(routes[user.role] || '/client')
    } catch (err: any) {
      const data = err.response?.data
      if (typeof data === 'string') {
        setError(data)
      } else if (data?.detail) {
        setError(data.detail)
      } else {
        setError('Telefon yoki parol notog\'ri')
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12 text-white"
        style={{ background: 'linear-gradient(160deg, var(--accent), var(--accent-active))' }}>
        <div className="pointer-events-none absolute inset-0 opacity-25"
          style={{ background: 'radial-gradient(500px 300px at 85% 10%, #fff, transparent 55%), radial-gradient(450px 320px at 5% 95%, #000, transparent 55%)' }} />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full border-[40px] border-white/10" />
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full border-[32px] border-white/10" />

        <div className="relative flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Wrench size={22} />
          </span>
          <span className="font-display font-extrabold text-xl">{t('app.name')}</span>
        </div>

        <div className="relative max-w-sm">
          <h2 className="font-display font-extrabold text-3xl leading-tight mb-4">
            {t('landing.hero_title_1')} {t('landing.hero_title_2')}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-8">{t('landing.hero_desc')}</p>
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
        </div>

        <p className="relative text-white/60 text-xs">&copy; 2026 {t('app.name')}</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-accent">
              <Wrench size={19} className="text-white" />
            </span>
            <span className="font-display font-extrabold text-lg">{t('app.name')}</span>
          </div>

          <h1 className="font-display text-2xl font-extrabold mb-1.5">{t('auth.login_title')}</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            {t('auth.welcome_back')}
          </p>

          <div className="card rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('auth.phone')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                    <Phone size={15} />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    className="input pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('auth.password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn btn-primary w-full py-2.5 font-bold">
                {t('auth.login_btn')}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
              {t('auth.no_account')}{' '}
              <Link href="/auth/register" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
                {t('auth.register_link')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
