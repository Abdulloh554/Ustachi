'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Store } from 'lucide-react'
import { workshopAPI } from '@/lib/api'
import PanelSettings from '@/components/crm/PanelSettings'

export default function DashboardSettingsPage() {
  const { t } = useTranslation()
  const [workshop, setWorkshop] = useState<any>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [schedule, setSchedule] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    workshopAPI.me().then((res) => {
      setWorkshop(res.data)
      setName(res.data.name || '')
      setAddress(res.data.address || '')
      setPhone(res.data.phone || '')
      setSchedule(res.data.work_schedule || '')
    }).catch(() => setWorkshop(null))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await workshopAPI.updateMe({ name, address, phone, work_schedule: schedule })
      setMsg(t('crm.settings_saved'))
    } catch {
      setMsg(t('crm.error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold leading-tight">{t('sidebar.settings')}</h1>

      {workshop && (
        <div className="card rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Store size={17} style={{ color: 'var(--primary-active)' }} /> {t('crm.edit_workshop')}
          </h2>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('crm.workshop_name')}</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('crm.workshop_address')}</label>
                <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('crm.workshop_phone')}</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('crm.workshop_schedule')}</label>
                <input className="input" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving && <Loader2 size={16} className="inline animate-spin mr-2" />}
                {t('crm.save')}
              </button>
              {msg && <span className="text-sm" style={{ color: 'var(--success-text)' }}>{msg}</span>}
            </div>
          </form>
        </div>
      )}

      <PanelSettings />
    </div>
  )
}
