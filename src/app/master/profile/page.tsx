'use client'

import { useEffect, useState } from 'react'
import { masterAPI, professionAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
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
    profession_ids: [] as string[],
    is_available: true,
  })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
    professionAPI.list().then((res) => setProfessions(res.data.results || res.data)).catch(() => setProfessions([]))
  }, [])

  const loadProfile = async () => {
    try {
      const res = await masterAPI.myProfile()
      setProfile(res.data)
      setForm({
        bio: res.data.bio || '',
        experience_years: res.data.experience_years || 0,
        profession_ids: res.data.professions?.map((p: any) => p.id) || [],
        is_available: res.data.is_available,
      })
    } catch {
    }
  }

  const toggleProfession = (id: string) => {
    setError('')
    setForm((prev) => ({
      ...prev,
      profession_ids: prev.profession_ids.includes(id)
        ? prev.profession_ids.filter((p) => p !== id)
        : [...prev.profession_ids, id],
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    if (form.profession_ids.length === 0) {
      setError(t('master.requires_profession'))
      return
    }
    setSaving(true)
    try {
      const res = await masterAPI.updateProfile(form)
      setProfile(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError(t('auth.error_occurred'))
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return <MasterProfileSkeleton />
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight">{t('master.profile_edit')}</h1>
        <p className="caption mt-1">{t('master.profile_subtitle')}</p>
      </div>

      <div className="card p-6 sm:p-8">
        <ProfileHeader profile={profile} />
      </div>

      <form onSubmit={handleSave} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <section className="card p-6">
              <h3 className="text-lg font-semibold leading-tight">{t('master.your_professions')}</h3>
              <p className="caption mt-0.5 mb-4">{t('master.professions_hint')}</p>
              <ProfessionsPicker
                professions={professions}
                selected={form.profession_ids}
                onToggle={toggleProfession}
              />
              {error && <p className="mt-3 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}
            </section>

            <section className="card p-6">
              <h3 className="text-lg font-semibold leading-tight">{t('master.about_me')}</h3>
              <p className="caption mt-0.5 mb-4">{t('master.about_hint')}</p>
              <label className="block text-sm font-medium mb-1.5">{t('auth.about_self')}</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="input"
              />
              <div className="mt-5">
                <label className="block text-sm font-medium mb-1.5">{t('master.experience')}</label>
                <div className="relative max-w-[200px]">
                  <input
                    type="number"
                    min={0}
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="input pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 caption">{t('master.experience_label')}</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="card p-6">
              <h3 className="text-lg font-semibold leading-tight">{t('order.status_label')}</h3>
              <p className="caption mt-0.5 mb-4">{t('master.availability_desc')}</p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{form.is_available ? t('status.available') : t('status.busy')}</span>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, is_available: !p.is_available }))}
                  className={`toggle ${form.is_available ? 'active' : ''}`}
                  aria-pressed={form.is_available}
                >
                  <span className="toggle-track" />
                  <span className="toggle-knob" />
                </button>
              </div>
            </section>

            <section className="card p-6">
              <button type="submit" disabled={saving} className="btn btn-primary w-full">
                {saving ? t('common.loading') : t('master.save')}
              </button>
              {saved && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium" style={{ color: 'var(--success)' }}>
                  <CheckCircle2 size={15} /> {t('master.saved')}
                </p>
              )}
              <p className="caption text-center mt-3">{t('master.save_note')}</p>
            </section>
          </aside>
        </div>
      </form>
    </div>
  )
}
