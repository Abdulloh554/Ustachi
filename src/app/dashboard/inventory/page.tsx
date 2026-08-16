'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { workshopAPI } from '@/lib/api'
import Modal from '@/components/crm/Modal'
import ProductForm from '@/components/crm/ProductForm'
import { SkeletonTableRows } from '@/components/ui/Skeleton'
import { formatMoney } from '@/lib/utils'

export default function InventoryPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await workshopAPI.inventoryList()
      setProducts(res.data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (p: any) => {
    if (!confirm(t('crm.confirm_delete'))) return
    await workshopAPI.inventoryRemove(p.id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('crm.inventory_title')}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('crm.inventory_subtitle')}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          <Plus size={16} className="mr-1.5 inline" /> {t('crm.add_product')}
        </button>
      </div>

      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th>{t('crm.product_name')}</th>
                <th>{t('crm.product_category')}</th>
                <th>{t('crm.product_price')}</th>
                <th>{t('crm.product_cost')}</th>
                <th>{t('crm.product_quantity')}</th>
                <th>{t('crm.product_threshold')}</th>
                <th>{t('crm.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonTableRows rows={5} cols={7} />}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: 'var(--text-light)' }}>
                    {t('crm.not_found')}
                  </td>
                </tr>
              )}
              {!loading &&
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium" style={{ color: 'var(--text)' }}>
                      <span className="flex items-center gap-1.5">
                        {p.name}
                        {p.low_stock && (
                          <AlertTriangle size={14} style={{ color: 'var(--warning-text)' }} />
                        )}
                      </span>
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>{formatMoney(p.price)} so'm</td>
                    <td>{formatMoney(p.cost_price)} so'm</td>
                    <td className="font-semibold" style={{ color: p.low_stock ? 'var(--warning-text)' : 'var(--text)' }}>
                      {p.quantity} {p.unit}
                    </td>
                    <td>{p.min_threshold} {p.unit}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-secondary)]"
                          style={{ color: 'var(--text-secondary)' }}
                          onClick={() => {
                            setEditing(p)
                            setModalOpen(true)
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-secondary)]"
                          style={{ color: 'var(--danger-text)' }}
                          onClick={() => remove(p)}
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
        title={editing ? t('crm.edit') : t('crm.add_product')}
        maxWidth="max-w-lg"
      >
        <ProductForm
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
