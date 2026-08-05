'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Phone, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const roleRoutes: Record<string, string> = {
  client: '/client',
  master: '/master',
  admin: '/admin',
}

export default function LoginForm() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuthStore()
  const { t } = useTranslation()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(phone, password)
      router.push(roleRoutes[user.role] || '/client')
    } catch (err: any) {
      const data = err.response?.data
      if (typeof data === 'string') {
        setError(data)
      } else if (data?.detail) {
        setError(data.detail)
      } else {
        setError(t('auth.invalid_credentials'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
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
              disabled={submitting}
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
            disabled={submitting}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary w-full py-2.5 font-bold" disabled={submitting}>
          {submitting && <Loader2 size={16} className="inline animate-spin mr-2" />}
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
  )
}
