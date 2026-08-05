'use client'

import { useEffect, useState } from 'react'
import { masterAPI, professionAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import ProfileHeader from '@/components/master/ProfileHeader'
import ProfessionsPicker from '@/components/master/ProfessionsPicker'
import MasterProfileSkeleton from '@/components/master/MasterProfileSkeleton'

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
    return <MasterProfileSkeleton />
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">{t('master.profile')}</h1>

      <div className="card p-6">
        <ProfileHeader profile={profile} />

        <form onSubmit={handleSave} className="space-y-4">
          <ProfessionsPicker
            professions={professions}
            selected={form.profession_ids}
            onToggle={toggleProfession}
          />

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
