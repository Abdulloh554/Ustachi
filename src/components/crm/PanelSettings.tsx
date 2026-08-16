'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { authAPI } from '@/lib/api'
import i18n from '@/lib/i18n'

export default function PanelSettings() {
  const { t } = useTranslation()
  const { user, setUser } = useAuthStore()
  const { theme, toggle } = useThemeStore()

  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passSaving, setPassSaving] = useState(false)
  const [passMsg, setPassMsg] = useState('')
  const [passError, setPassError] = useState('')

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg('')
    try {
      const res = await authAPI.updateProfile({ first_name: firstName, last_name: lastName })
      setUser(res.data)
      setProfileMsg(t('crm.settings_saved'))
    } catch {
      setProfileMsg(t('crm.error'))
    } finally {
      setProfileSaving(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassSaving(true)
    setPassMsg('')
    setPassError('')
    try {
      await authAPI.changePassword({ old_password: oldPassword, new_password: newPassword })
      setOldPassword('')
      setNewPassword('')
      setPassMsg(t('crm.settings_saved'))
    } catch (err: any) {
      const data = err.response?.data
      setPassError(typeof data === 'string' ? data : data?.detail || t('crm.error'))
    } finally {
      setPassSaving(false)
    }
  }

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang)
    if (user) setUser({ ...user, language: lang })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold leading-tight">{t('sidebar.settings')}</h1>

      <div className="card rounded-2xl p-6">
        <h2 className="font-semibold mb-4">{t('crm.settings_profile')}</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('auth.first_name')}</label>
              <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('auth.last_name')}</label>
              <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={profileSaving}>
              {profileSaving && <Loader2 size={16} className="inline animate-spin mr-2" />}
              {t('crm.save')}
            </button>
            {profileMsg && <span className="text-sm" style={{ color: 'var(--success-text)' }}>{profileMsg}</span>}
          </div>
        </form>
      </div>

      <div className="card rounded-2xl p-6">
        <h2 className="font-semibold mb-4">{t('crm.settings_theme')} / {t('crm.settings_lang')}</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={toggle} className="btn" style={{ borderColor: 'var(--border)' }}>
            {theme === 'dark' ? <Sun size={16} className="inline mr-2" /> : <Moon size={16} className="inline mr-2" />}
            {theme === 'dark' ? t('crm.settings_light') : t('crm.settings_dark')}
          </button>
          <button onClick={() => switchLang('uz')} className="btn" style={{ borderColor: 'var(--border)' }}>
            O'zbekcha
          </button>
          <button onClick={() => switchLang('ru')} className="btn" style={{ borderColor: 'var(--border)' }}>
            Русский
          </button>
        </div>
      </div>

      <div className="card rounded-2xl p-6">
        <h2 className="font-semibold mb-4">{t('crm.settings_security')}</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('crm.settings_old_password')}</label>
              <input
                type="password"
                className="input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('crm.settings_new_password')}</label>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={passSaving}>
              {passSaving && <Loader2 size={16} className="inline animate-spin mr-2" />}
              {t('crm.settings_change_password')}
            </button>
            {passMsg && <span className="text-sm" style={{ color: 'var(--success-text)' }}>{passMsg}</span>}
            {passError && <span className="text-sm error">{passError}</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
