'use client'

import { useEffect, useState } from 'react'
import { masterAPI, professionAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'

export default function MasterProfilePage() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<any>(null)
  const [professions, setProfessions] = useState<any[]>([])
  const [form, setForm] = useState({
    bio: '',
    experience_years: 0,
    profession_ids: [] as number[],
    is_available: true,
  })

  useEffect(() => {
    loadProfile()
    professionAPI.list().then((res) => setProfessions(res.data.results || res.data))
  }, [])

  const loadProfile = async () => {
    const res = await masterAPI.myProfile()
    setProfile(res.data)
    setForm({
      bio: res.data.bio || '',
      experience_years: res.data.experience_years || 0,
      profession_ids: res.data.professions?.map((p: any) => p.id) || [],
      is_available: res.data.is_available,
    })
  }

  const toggleProfession = (id: number) => {
    setForm((prev) => ({
      ...prev,
      profession_ids: prev.profession_ids.includes(id)
        ? prev.profession_ids.filter((p) => p !== id)
        : [...prev.profession_ids, id],
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await masterAPI.updateProfile(form)
    setProfile(res.data)
  }

  if (!profile) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40 rounded-lg" />
              <Skeleton className="h-3 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-9 w-full rounded-full" />
          <Skeleton className="h-9 w-full rounded-full" />
          <Skeleton className="h-9 w-full rounded-full" />
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">{t('master.profile')}</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {(profile.user?.first_name?.[0] || profile.user?.phone?.[0] || '?').toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">{profile.user?.first_name || t('role.unnamed')}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('master.rating')}: {profile.rating.toFixed(1)} ({profile.rating_count})</p>
          </div>
          <div className="flex flex-col items-end gap-1 px-4 py-2 rounded-xl font-bold"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{t('master.balance')}</span>
            <span className="text-lg">
              {Number(profile.balance || 0).toLocaleString('ru-RU')} <span className="text-xs font-medium opacity-80">{t('order.price_label')}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('master.your_professions')}</label>
            <div className="flex flex-wrap gap-2">
              {professions.map((prof: any) => (
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
            <label className="block text-sm font-medium mb-1">{t('master.about_me')}</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="input w-full px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('master.experience')}</label>
            <input
              type="number"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
              className="input w-full px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">{t('order.status_label')}</label>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_available: !form.is_available })}
              className={`toggle ${form.is_available ? 'active' : ''}`}
              aria-pressed={form.is_available}
              aria-label={t('order.status_label')}
            >
              <span className="toggle-track" />
              <span className="toggle-knob" />
            </button>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {form.is_available ? t('order.accept_btn') : t('order.busy')}
            </span>
          </div>

          <button type="submit" className="btn btn-primary px-6 py-2 text-sm font-medium">
            {t('master.save')}
          </button>
        </form>
      </div>
    </div>
  )
}
