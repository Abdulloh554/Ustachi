'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { workshopAPI } from '@/lib/api'

export default function StaffForm({
  editing,
  onDone,
}: {
  editing?: any
  onDone: () => void
}) {
  const { t } = useTranslation()
  const [phone, setPhone] = useState(editing?.phone || '')
  const [firstName, setFirstName] = useState(editing?.first_name || '')
  const [lastName, setLastName] = useState(editing?.last_name || '')
  const [password, setPassword] = useState('')
  const [specializations, setSpecializations] = useState(
    (editing?.specializations || []).join(', ')
  )
  const [experienceYears, setExperienceYears] = useState(editing?.experience_years || 0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data: any = {
        first_name: firstName,
        last_name: lastName,
        specializations: specializations.split(',').map((s: string) => s.trim()).filter(Boolean),
        experience_years: Number(experienceYears) || 0,
      }
      if (editing) {
        await workshopAPI.staffUpdate(editing.id, data)
      } else {
        await workshopAPI.staffCreate({ ...data, phone, password })
      }
      onDone()
    } catch (err: any) {
      const res = err.response?.data
      setError(typeof res === 'string' ? res : res?.detail || t('crm.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.staff_name')}</label>
          <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('auth.last_name')}</label>
          <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>
      {!editing && (
        <>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('crm.staff_phone')}</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998901234567" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('crm.staff_password')}</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
        </>
      )}
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('crm.staff_specializations')}</label>
        <input
          className="input"
          value={specializations}
          onChange={(e) => setSpecializations(e.target.value)}
          placeholder="Elektr, Santexnika, Konditsioner"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('crm.staff_experience')}</label>
        <input
          type="number"
          className="input"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          min={0}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
        {submitting && <Loader2 size={16} className="inline animate-spin mr-2" />}
        {t('crm.save')}
      </button>
    </form>
  )
}
