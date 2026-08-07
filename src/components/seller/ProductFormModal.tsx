'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Loader2 } from 'lucide-react'

export interface ProductFormData {
  name: string
  category: string
  price: string
  cost_price: string
  quantity: string
  description: string
}

export const emptyProductForm: ProductFormData = {
  name: '',
  category: '',
  price: '',
  cost_price: '',
  quantity: '0',
  description: '',
}

export default function ProductFormModal({
  open,
  initial,
  submitting,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean
  initial: ProductFormData
  submitting: boolean
  error: string
  onClose: () => void
  onSubmit: (data: ProductFormData) => void
}) {
  const { t } = useTranslation()
  const [form, setForm] = useState<ProductFormData>(initial)

  useEffect(() => {
    if (open) setForm(initial)
  }, [open, initial])

  const formReady = form.name.trim() && form.price.trim()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg card rounded-2xl p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            {initial.name ? t('seller.edit_product') : t('seller.add_product')}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]" aria-label="Close">
            <X size={18} style={{ color: 'var(--text-light)' }} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.product_name')}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.product_category')}</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('seller.product_price')}</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('seller.product_cost')}</label>
              <input
                type="number"
                min={0}
                value={form.cost_price}
                onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.product_quantity')}</label>
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.product_description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input resize-none"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={submitting || !formReady}
            onClick={() => onSubmit(form)}
          >
            {submitting && <Loader2 size={16} className="inline animate-spin mr-2" />}
            {t('seller.store_save')}
          </button>
        </div>
      </div>
    </div>
  )
}
