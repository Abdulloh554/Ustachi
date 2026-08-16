'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { workshopAPI, orderAPI } from '@/lib/api'
import { formatMoney } from '@/lib/utils'

export default function CreateOrderForm({
  services,
  onCreated,
}: {
  services: any[]
  onCreated: (order: any) => void
}) {
  const { t } = useTranslation()
  const [serviceId, setServiceId] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceId) {
      setError(t('crm.client_choose_service'))
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const body: any = {
        service_id: serviceId,
        description,
        address,
      }
      if (scheduledAt) body.scheduled_at = new Date(scheduledAt).toISOString()
      const res = await orderAPI.create(body)
      onCreated(res.data)
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.detail || t('crm.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('crm.client_choose_service')}</label>
        <select className="input" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">{t('crm.client_choose_service')}...</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {formatMoney(s.price)} so'm
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('crm.description')}</label>
        <textarea
          className="input min-h-[80px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Muammoni qisqacha tavsiflang"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('crm.address')}</label>
        <input
          className="input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Masalan: Toshkent, Chilonzor 5"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('crm.schedule_optional')}</label>
        <input
          type="datetime-local"
          className="input"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
        {submitting && <Loader2 size={16} className="inline animate-spin mr-2" />}
        {t('crm.client_create_order')}
      </button>
    </form>
  )
}
