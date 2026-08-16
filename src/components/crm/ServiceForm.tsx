'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { workshopAPI } from '@/lib/api'

export default function ServiceForm({
  editing,
  onDone,
}: {
  editing?: any
  onDone: () => void
}) {
  const { t } = useTranslation()
  const [name, setName] = useState(editing?.name || '')
  const [price, setPrice] = useState(editing?.price || '')
  const [duration, setDuration] = useState(editing?.duration_minutes || 60)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = {
        name,
        price: Number(price) || 0,
        duration_minutes: Number(duration) || 0,
      }
      if (editing) {
        await workshopAPI.serviceUpdate(editing.id, data)
      } else {
        await workshopAPI.serviceCreate(data)
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
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('crm.service_name')}</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.service_price')}</label>
          <input type="number" className="input" value={price} onChange={(e) => setPrice(e.target.value)} min={0} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.service_duration')}</label>
          <input type="number" className="input" value={duration} onChange={(e) => setDuration(e.target.value)} min={5} required />
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
        {submitting && <Loader2 size={16} className="inline animate-spin mr-2" />}
        {t('crm.save')}
      </button>
    </form>
  )
}
