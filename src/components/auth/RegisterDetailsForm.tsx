'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { ArrowLeft, Phone, Loader2, Info } from 'lucide-react'

export interface RegisterFormData {
  phone: string
  password: string
  first_name: string
  last_name: string
  role: 'client' | 'owner'
}

interface RegisterDetailsFormProps {
  data: RegisterFormData
  submitting: boolean
  error: string
  onChange: (field: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export default function RegisterDetailsForm({
  data,
  submitting,
  error,
  onChange,
  onSubmit,
  onBack,
}: RegisterDetailsFormProps) {
  const { t } = useTranslation()

  return (
    <div className="card rounded-2xl p-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <button
          type="button"
          onClick={onBack}
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
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
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
              value={data.first_name}
              onChange={(e) => onChange('first_name', e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('auth.last_name')}</label>
            <input
              type="text"
              value={data.last_name}
              onChange={(e) => onChange('last_name', e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('auth.password')}</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
            className="input"
            required
            minLength={6}
          />
        </div>

        {data.role === 'owner' && (
          <p className="rounded-xl p-3 flex items-start gap-2 text-sm" style={{ background: 'var(--bg-secondary)' }}>
            <Info size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--primary-active)' }} />
            {t('auth.owner_hint')}
          </p>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting && <Loader2 size={16} className="inline animate-spin mr-2" />}
          {t('auth.register_btn')}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
        {t('auth.has_account')}{' '}
        <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
          {t('auth.login_link')}
        </Link>
      </p>
    </div>
  )
}
