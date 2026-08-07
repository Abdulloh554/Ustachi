'use client'

import { useEffect, useState } from 'react'
import { storeAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { Store, Wallet, MapPin, Phone } from 'lucide-react'
import { formatMoney } from '@/lib/utils'

export default function SellerStorePage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', category: '', description: '', phone: '', address: '' })
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    storeAPI.myStore()
      .then((res) => {
        setForm({
          name: res.data.name ?? '',
          category: res.data.category ?? '',
          description: res.data.description ?? '',
          phone: res.data.phone ?? '',
          address: res.data.address ?? '',
        })
        setBalance(res.data.balance ?? '0')
      })
      .finally(() => setLoading(false))
  }, [])

  const update = (name: string, value: string) => setForm((f) => ({ ...f, [name]: value }))

  const save = async () => {
    setSaving(true)
    try {
      const res = await storeAPI.updateStore(form)
      setBalance(res.data.balance ?? balance)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <div className="card p-6 space-y-4">
          <Skeleton className="h-4 w-40 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('seller.store_title')}</h1>
          <p className="caption mt-1">{t('seller.store_subtitle')}</p>
        </div>
        <div className="stat rounded-xl min-w-[180px]">
          <div className="flex items-center gap-3">
            <div className="stat-icon">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('seller.store_balance')}</p>
              <p className="text-lg font-semibold">{formatMoney(balance)} so'm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm mb-1">
          <Store size={18} style={{ color: 'var(--primary)' }} />
          {t('seller.store_title')}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.store_name')}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder={t('seller.store_name_placeholder')}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.store_category')}</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.store_phone')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                <Phone size={15} />
              </span>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="input pl-9"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('seller.store_address')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                <MapPin size={15} />
              </span>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className="input pl-9"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t('seller.store_description')}</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            className="input resize-none"
          />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? '...' : t('seller.store_save')}
          </button>
          {saved && <p className="text-sm" style={{ color: 'var(--success)' }}>{t('seller.store_saved')}</p>}
        </div>
      </div>
    </div>
  )
}
