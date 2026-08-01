'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { authAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'

export default function ClientSettingsPage() {
  const { user, setUser } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const { t } = useTranslation()
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '' })
  const [langSuccess, setLangSuccess] = useState(false)
  const [passSuccess, setPassSuccess] = useState(false)

  const changeLanguage = async (lang: string) => {
    const res = await authAPI.updateProfile({ language: lang })
    setUser(res.data)
    setLangSuccess(true)
    setTimeout(() => setLangSuccess(false), 2000)
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    await authAPI.changePassword(passwordForm)
    setPasswordForm({ old_password: '', new_password: '' })
    setPassSuccess(true)
    setTimeout(() => setPassSuccess(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">{t('settings.title')}</h1>

      <div className="card p-6">
        <h2 className="font-semibold text-sm mb-4">{t('settings.appearance')}</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm">{t('settings.dark_mode')}</span>
          <button
            onClick={toggle}
            className={`toggle ${theme === 'dark' ? 'active' : ''}`}
            aria-pressed={theme === 'dark'}
            aria-label={t('settings.dark_mode')}
          >
            <span className="toggle-track" />
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-sm mb-4">{t('settings.language')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => changeLanguage('uz')}
            className={`pill text-sm ${user?.language === 'uz' ? 'active' : ''}`}
          >
            {t('settings.language_uz')}
          </button>
          <button
            onClick={() => changeLanguage('ru')}
            className={`pill text-sm ${user?.language === 'ru' ? 'active' : ''}`}
          >
            {t('settings.language_ru')}
          </button>
        </div>
        {langSuccess && <p className="text-xs mt-2" style={{ color: 'var(--success)' }}>{t('settings.language_changed')}</p>}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-sm mb-4">{t('settings.change_password')}</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <input
            type="password"
            placeholder={t('settings.old_password')}
            value={passwordForm.old_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
            className="input"
            required
          />
          <input
            type="password"
            placeholder={t('settings.new_password')}
            value={passwordForm.new_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
            className="input"
            required
            minLength={6}
          />
          <button type="submit" className="btn btn-primary px-4 py-1.5 text-sm">
            {t('settings.save')}
          </button>
          {passSuccess && <p className="text-xs mt-2" style={{ color: 'var(--success)' }}>{t('settings.password_changed')}</p>}
        </form>
      </div>
    </div>
  )
}
