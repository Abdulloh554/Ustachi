'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'

export default function ClientProfilePage() {
  const { user, setUser, isLoading } = useAuthStore()
  const { t } = useTranslation()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await authAPI.updateProfile(form)
    setUser(res.data)
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-7 w-40 rounded-lg" />
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-3 w-28 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl mt-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight">{t('profile.title')}</h1>
        <p className="caption mt-1">{t('profile.subtitle')}</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
            {(user?.first_name?.[0] || user?.phone?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.first_name || t('role.unnamed')}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.phone}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--text-light)' }}>{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('auth.first_name')}</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('auth.last_name')}</label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {t('settings.save')}
          </button>
        </form>
      </div>
    </div>
  )
}
