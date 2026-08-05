'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

const INITIAL_FORM = {
  title: '',
  description: '',
  profession: '',
  address: '',
  price: '',
  location_lat: 41.3,
  location_lng: 69.2,
}

interface CreateOrderModalProps {
  professions: any[]
  onClose: () => void
  onCreate: (form: typeof INITIAL_FORM) => Promise<void>
}

export default function CreateOrderModal({ professions, onClose, onCreate }: CreateOrderModalProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onCreate(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">{t('client.new_order')}</h2>
          <button onClick={onClose} className="btn btn-ghost p-1"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder={t('order.title')}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
            required
          />
          <textarea
            placeholder={t('order.description')}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="input"
            required
          />
          <select
            value={form.profession}
            onChange={(e) => setForm({ ...form, profession: e.target.value })}
            className="select"
          >
            <option value="">{t('order.choose_field')}</option>
            {professions.map((p: any) => (
              <option key={p.id} value={p.id}>{p.icon} {p.name_uz}</option>
            ))}
          </select>
          <input
            placeholder={t('order.address')}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input"
          />
          <input
            placeholder={t('order.price')}
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input"
          />
          <button type="submit" className="btn btn-primary w-full py-2 font-medium" disabled={submitting}>
            {t('order.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
