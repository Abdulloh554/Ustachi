'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { workshopAPI } from '@/lib/api'

export default function ProductForm({
  editing,
  onDone,
}: {
  editing?: any
  onDone: () => void
}) {
  const { t } = useTranslation()
  const [name, setName] = useState(editing?.name || '')
  const [category, setCategory] = useState(editing?.category || '')
  const [price, setPrice] = useState(editing?.price || '')
  const [cost, setCost] = useState(editing?.cost_price || '')
  const [quantity, setQuantity] = useState(editing?.quantity ?? 0)
  const [unit, setUnit] = useState(editing?.unit || 'dona')
  const [threshold, setThreshold] = useState(editing?.min_threshold ?? 0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = {
        name,
        category,
        price: Number(price) || 0,
        cost_price: Number(cost) || 0,
        quantity: Number(quantity) || 0,
        unit,
        min_threshold: Number(threshold) || 0,
      }
      if (editing) {
        await workshopAPI.inventoryUpdate(editing.id, data)
      } else {
        await workshopAPI.inventoryCreate(data)
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
        <label className="block text-sm font-semibold mb-1.5">{t('crm.product_name')}</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.product_category')}</label>
          <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Elektrik / Santexnika / Material" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.product_unit')}</label>
          <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.product_price')}</label>
          <input type="number" className="input" value={price} onChange={(e) => setPrice(e.target.value)} min={0} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.product_cost')}</label>
          <input type="number" className="input" value={cost} onChange={(e) => setCost(e.target.value)} min={0} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.product_quantity')}</label>
          <input type="number" className="input" value={quantity} onChange={(e) => setQuantity(e.target.value)} min={0} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('crm.product_threshold')}</label>
          <input type="number" className="input" value={threshold} onChange={(e) => setThreshold(e.target.value)} min={0} />
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
