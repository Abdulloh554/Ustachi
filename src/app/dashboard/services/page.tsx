'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { workshopAPI } from '@/lib/api'
import Modal from '@/components/crm/Modal'
import ServiceForm from '@/components/crm/ServiceForm'
import { SkeletonTableRows } from '@/components/ui/Skeleton'
import { formatMoney } from '@/lib/utils'

export default function ServicesPage() {
  const { t } = useTranslation()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await workshopAPI.serviceList()
      setServices(res.data)
    } catch {
      setServices([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (s: any) => {
    if (!confirm(t('crm.confirm_delete'))) return
    await workshopAPI.serviceRemove(s.id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('crm.services_title')}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('crm.staff_specializations')}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          <Plus size={16} className="mr-1.5 inline" /> {t('crm.add_service')}
        </button>
      </div>

      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th>{t('crm.service_name')}</th>
                <th>{t('crm.service_price')}</th>
                <th>{t('crm.service_duration')}</th>
                <th>{t('crm.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonTableRows rows={4} cols={4} />}
              {!loading && services.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10" style={{ color: 'var(--text-light)' }}>
                    {t('crm.not_found')}
                  </td>
                </tr>
              )}
              {!loading &&
                services.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium" style={{ color: 'var(--text)' }}>{s.name}</td>
                    <td>{formatMoney(s.price)} so'm</td>
                    <td>{s.duration_minutes} min</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-secondary)]"
                          style={{ color: 'var(--text-secondary)' }}
                          onClick={() => {
                            setEditing(s)
                            setModalOpen(true)
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-secondary)]"
                          style={{ color: 'var(--danger-text)' }}
                          onClick={() => remove(s)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('crm.edit') : t('crm.add_service')}
      >
        <ServiceForm
          editing={editing}
          onDone={() => {
            setModalOpen(false)
            load()
          }}
        />
      </Modal>
    </div>
  )
}
