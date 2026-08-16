'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { workshopAPI } from '@/lib/api'
import Modal from '@/components/crm/Modal'
import StaffForm from '@/components/crm/StaffForm'
import { SkeletonTableRows } from '@/components/ui/Skeleton'

export default function StaffPage() {
  const { t } = useTranslation()
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await workshopAPI.staffList()
      setStaff(res.data)
    } catch {
      setStaff([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleAvailable = async (s: any) => {
    await workshopAPI.staffUpdate(s.id, { is_available: !s.is_available })
    load()
  }

  const remove = async (s: any) => {
    if (!confirm(t('crm.confirm_delete'))) return
    await workshopAPI.staffRemove(s.id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('sidebar.staff')}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('crm.staff_overview')}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          <Plus size={16} className="mr-1.5 inline" /> {t('crm.add_staff')}
        </button>
      </div>

      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th>{t('crm.staff_name')}</th>
                <th>{t('crm.staff_phone')}</th>
                <th>{t('crm.staff_specializations')}</th>
                <th>{t('crm.staff_experience')}</th>
                <th>{t('crm.staff_availability')}</th>
                <th>{t('crm.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonTableRows rows={4} cols={6} />}
              {!loading && staff.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10" style={{ color: 'var(--text-light)' }}>
                    {t('crm.no_staff')}
                  </td>
                </tr>
              )}
              {!loading &&
                staff.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium" style={{ color: 'var(--text)' }}>{s.staff_name}</td>
                    <td>{s.phone}</td>
                    <td>{(s.specializations || []).join(', ') || '—'}</td>
                    <td>{s.experience_years} yil</td>
                    <td>
                      <button
                        onClick={() => toggleAvailable(s)}
                        className={`badge ${s.is_available ? 'badge-completed' : 'badge-cancelled'}`}
                      >
                        {s.is_available ? t('crm.available') : t('crm.busy')}
                      </button>
                    </td>
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
        title={editing ? t('crm.edit_staff') : t('crm.add_staff')}
      >
        <StaffForm
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
