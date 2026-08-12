'use client'

import { useEffect, useState } from 'react'
import { settingsAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { SettingsField, SettingsSection } from '@/components/admin/SettingsField'
import { useTranslation } from 'react-i18next'

const fields = [
  ['site_name', 'admin.settings.site_name', 'text'],
  ['site_description', 'admin.settings.site_description', 'textarea'],
  ['banner_title', 'admin.settings.banner_title', 'text'],
  ['banner_subtitle', 'admin.settings.banner_subtitle', 'text'],
] as const

const contactFields = [
  ['contact_phone', 'admin.settings.contact_phone', 'text'],
  ['contact_email', 'admin.settings.contact_email', 'text'],
  ['telegram_url', 'admin.settings.telegram_url', 'text'],
  ['instagram_url', 'admin.settings.instagram_url', 'text'],
  ['support_phone', 'admin.settings.support_phone', 'text'],
] as const

const businessFields = [
  ['min_order_price', 'admin.settings.min_order_price', 'number'],
  ['max_order_price', 'admin.settings.max_order_price', 'number'],
  ['currency_label', 'admin.settings.currency_label', 'text'],
] as const

type FormState = Record<string, string>

export default function AdminSettingsPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    settingsAPI.get()
      .then((res) => {
        const data: FormState = {}
        for (const [key] of [...fields, ...contactFields, ...businessFields]) {
          data[key] = String(res.data[key] ?? '')
        }
        setForm(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const update = (name: string, value: string) => setForm((f) => ({ ...f, [name]: value }))

  const save = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-7 w-56 rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6">
            <Skeleton className="h-4 w-40 rounded-lg mb-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-3 w-24 rounded-lg mb-2" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold leading-tight">{t('admin.settings.title')}</h1>

      <SettingsSection title={t('admin.settings.site_section')}>
        {fields.map(([name, label, type]) => (
          <SettingsField key={name} name={name} label={t(label)} type={type} value={form[name] ?? ''} onChange={update} />
        ))}
      </SettingsSection>

      <SettingsSection title={t('admin.settings.contact_section')}>
        {contactFields.map(([name, label, type]) => (
          <SettingsField key={name} name={name} label={t(label)} type={type} value={form[name] ?? ''} onChange={update} />
        ))}
      </SettingsSection>

      <SettingsSection title={t('admin.settings.business_section')}>
        {businessFields.map(([name, label, type]) => (
          <SettingsField key={name} name={name} label={t(label)} type={type} value={form[name] ?? ''} onChange={update} />
        ))}
      </SettingsSection>

      <div className="flex items-center gap-3">
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? '...' : t('admin.settings.save')}
        </button>
        {saved && <p className="text-sm" style={{ color: 'var(--success)' }}>{t('admin.settings.saved')}</p>}
      </div>
    </div>
  )
}
