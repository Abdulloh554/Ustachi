'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { professionAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Wrench, User, ArrowLeft, Phone, Check } from 'lucide-react'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    phone: '',
    password: '',
    username: '',
    first_name: '',
    last_name: '',
    role: 'client',
    profession_ids: [] as number[],
    bio: '',
    experience_years: 0,
  })
  const [professions, setProfessions] = useState<any[]>([])
  const [error, setError] = useState('')
  const { register } = useAuthStore()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    professionAPI.list().then((res) => setProfessions(res.data.results || res.data))
  }, [])

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleProfession = (id: number) => {
    setForm((prev) => ({
      ...prev,
      profession_ids: prev.profession_ids.includes(id)
        ? prev.profession_ids.filter((p) => p !== id)
        : [...prev.profession_ids, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const user = await register({
        phone: form.phone,
        password: form.password,
        username: form.phone,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
      })
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
      } else if (data) {
        const msgs = Object.values(data).flat().join('. ')
        setError(msgs || t('auth.error_occurred'))
      } else {
        setError(t('auth.error_occurred'))
      }
    }
  }

  const isMaster = form.role === 'master'

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12 text-white"
        style={{ background: 'linear-gradient(160deg, var(--accent), var(--accent-active))' }}>
        <div className="pointer-events-none absolute inset-0 opacity-25"
          style={{ background: 'radial-gradient(500px 300px at 85% 10%, #fff, transparent 55%), radial-gradient(450px 320px at 5% 95%, #000, transparent 55%)' }} />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full border-[40px] border-white/10" />
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full border-[32px] border-white/10" />

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
            {['landing.feature_1_title', 'landing.feature_2_title', 'landing.feature_3_title'].map((k) => (
              <div key={k} className="flex items-center gap-3 text-sm font-medium">
                <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Check size={16} />
                </span>
                {t(k)}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/60 text-xs">&copy; 2026 {t('app.name')}</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-accent">
              <Wrench size={19} className="text-white" />
            </span>
            <span className="font-display font-extrabold text-lg">{t('app.name')}</span>
          </div>

          <h1 className="font-display text-2xl font-extrabold mb-1.5">{t('auth.register_title')}</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>{t('auth.register_subtitle')}</p>

          {step === 1 && (
            <div className="card rounded-2xl p-8">
              <label className="block text-sm font-semibold mb-3">{t('role.choose')}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setForm((prev) => ({ ...prev, role: 'client' })); setStep(2) }}
                  className="group p-6 rounded-2xl text-center border-2 transition-all"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <User size={24} />
                  </div>
                  <div className="font-display font-bold text-sm">{t('role.client')}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('role.client_desc')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => { setForm((prev) => ({ ...prev, role: 'master' })); setStep(2) }}
                  className="group p-6 rounded-2xl text-center border-2 transition-all"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <Wrench size={24} />
                  </div>
                  <div className="font-display font-bold text-sm">{t('role.master')}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('role.master_desc')}</div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold mb-1"
                  style={{ color: 'var(--text-light)' }}
                >
                  <ArrowLeft size={14} /> {t('auth.back')}
                </button>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('auth.phone')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                      <Phone size={15} />
                    </span>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+998901234567"
                      className="input pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t('auth.first_name')}</label>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t('auth.last_name')}</label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('auth.password')}</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="input"
                    required
                    minLength={6}
                  />
                </div>

                {isMaster && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t('auth.choose_profession')}</label>
                      <div className="flex flex-wrap gap-2">
                        {professions.map((prof) => (
                          <button
                            key={prof.id}
                            type="button"
                            onClick={() => toggleProfession(prof.id)}
                            className={`pill text-sm ${form.profession_ids.includes(prof.id) ? 'active' : ''}`}
                          >
                            {prof.icon} {prof.name_uz}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">{t('auth.about_self')}</label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        rows={3}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">{t('auth.experience_years')}</label>
                      <input
                        type="number"
                        value={form.experience_years}
                        onChange={(e) => handleChange('experience_years', parseInt(e.target.value))}
                        className="input"
                      />
                    </div>
                  </>
                )}

                {error && <p className="error">{error}</p>}

                <button type="submit" className="btn btn-primary w-full py-2.5 font-bold">
                  {t('auth.register_btn')}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
                {t('auth.has_account')}{' '}
                <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
                  {t('auth.login_link')}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
