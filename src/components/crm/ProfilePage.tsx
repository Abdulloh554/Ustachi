'use client'

import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Camera, Sun, Moon, Send, Phone, User as UserIcon, Shield, AtSign } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { authAPI, mediaUrl } from '@/lib/api'
import { BOT_URL, BOT_USERNAME } from '@/lib/constants'
import i18n from '@/lib/i18n'

const ROLE_ICONS: Record<string, any> = {
  owner: Shield,
  staff: UserIcon,
  admin: Shield,
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, setUser } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passSaving, setPassSaving] = useState(false)
  const [passMsg, setPassMsg] = useState('')
  const [passError, setPassError] = useState('')

  if (!user) return null

  const RoleIcon = ROLE_ICONS[user.role] || UserIcon
  const avatar = mediaUrl(user.avatar)

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    setError('')
    try {
      const res = await authAPI.updateProfile({ first_name: firstName, last_name: lastName, username, phone })
      setUser(res.data)
      setMsg(t('crm.settings_saved'))
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.error || data?.detail || t('crm.error'))
    } finally {
      setSaving(false)
    }
  }

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSavingAvatar(true)
    setError('')
    try {
      const form = new FormData()
      form.append('avatar', file)
      const res = await authAPI.updateProfileForm(form)
      setUser(res.data)
      setMsg(t('crm.settings_saved'))
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.error || data?.detail || t('crm.error'))
    } finally {
      setSavingAvatar(false)
      if (fileRef.current) fileRef.current.value = ''
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
      setPassError(typeof data === 'string' ? data : data?.error || data?.detail || t('crm.error'))
    } finally {
      setPassSaving(false)
    }
  }

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang)
    setUser({ ...user, language: lang })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold leading-tight">{t('profile.title')}</h1>
      <p className="text-sm -mt-4" style={{ color: 'var(--text-secondary)' }}>{t('profile.subtitle')}</p>

      <div className="card rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}>
                {(user.first_name?.[0] || user.phone?.[0] || '?').toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center border-2 border-[var(--surface)] text-white bg-[var(--primary)] hover:opacity-90 transition-opacity"
              disabled={savingAvatar}
              title={t('crm.change_photo')}
            >
              {savingAvatar ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold leading-tight" style={{ color: 'var(--text)' }}>
              {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.phone}
            </h2>
            <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}>
              <RoleIcon size={12} /> {t(`role.${user.role}`)}
            </span>
            <p className="mt-2 text-sm flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Phone size={14} /> {user.phone}
            </p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="mt-6 space-y-4 border-t border-[var(--border)] pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('auth.first_name')}</label>
              <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('auth.last_name')}</label>
              <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                <AtSign size={13} /> {t('auth.username')}
              </label>
              <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                <Phone size={13} /> {t('auth.phone')}
              </label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <Loader2 size={16} className="inline animate-spin mr-2" />}
              {t('crm.save')}
            </button>
            {msg && <span className="text-sm" style={{ color: 'var(--success-text)' }}>{msg}</span>}
            {error && <span className="text-sm error">{error}</span>}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('crm.settings_old_password')}</label>
              <input type="password" className="input" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('crm.settings_new_password')}</label>
              <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
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

      <div className="card rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--primary-light)', color: 'var(--primary-active)' }}>
              <Send size={19} />
            </span>
            <div>
              <h2 className="font-semibold">{t('crm.bot_title')}</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('crm.bot_desc')}</p>
            </div>
          </div>
          <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <Send size={15} className="mr-1.5 inline" /> {BOT_USERNAME}
          </a>
        </div>
      </div>
    </div>
  )
}
