'use client'

import { useCallback, useEffect, useState } from 'react'
import { storeAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { Package, Plus, Minus, Pencil, Trash2 } from 'lucide-react'
import { formatMoney } from '@/lib/utils'
import ProductFormModal, { ProductFormData, emptyProductForm } from '@/components/seller/ProductFormModal'

interface Product {
  id: string
  name: string
  category: string
  price: string
  cost_price: string
  quantity: number
  description: string
}

export default function SellerWarehousePage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    storeAPI.myProducts()
      .then((res) => setProducts(res.data.results || res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const changeQuantity = async (id: string, delta: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    const next = Math.max(0, product.quantity + delta)
    setBusyId(id)
    try {
      await storeAPI.updateProduct(id, { quantity: next })
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: next } : p)))
    } catch {
      load()
    } finally {
      setBusyId(null)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setError('')
    setModalOpen(true)
  }

  const submit = async (data: ProductFormData) => {
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        name: data.name,
        category: data.category,
        price: data.price,
        cost_price: data.cost_price,
        quantity: data.quantity,
        description: data.description,
      }
      if (editing) {
        await storeAPI.updateProduct(editing.id, payload)
      } else {
        await storeAPI.createProduct(payload)
      }
      setModalOpen(false)
      load()
    } catch (err: any) {
      const msg = err.response?.data
      if (typeof msg === 'string') setError(msg)
      else if (msg?.detail) setError(msg.detail)
      else setError(t('auth.error_occurred'))
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm(t('seller.delete_product') + '?')) return
    try {
      await storeAPI.deleteProduct(id)
      load()
    } catch {
      load()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 space-y-3">
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('seller.warehouse_title')}</h1>
          <p className="caption mt-1">{t('seller.warehouse_subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} className="mr-1.5" /> {t('seller.add_product')}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="card rounded-2xl">
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-[var(--border)]"
              style={{ background: 'var(--surface)', color: 'var(--text-light)' }}
            >
              <Package size={24} />
            </div>
            <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>{t('seller.product_empty')}</p>
            <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
              {t('seller.product_empty_desc')}
            </p>
            <div className="mt-5">
              <button className="btn btn-primary" onClick={openAdd}>
                <Plus size={16} className="mr-1.5" /> {t('seller.add_product')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="card rounded-2xl p-5 animate-fade-in-up flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary-active)] flex items-center justify-center shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{p.name}</p>
                    {p.category && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>{p.category}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]" aria-label="Edit">
                    <Pencil size={15} style={{ color: 'var(--text-light)' }} />
                  </button>
                  <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]" aria-label="Delete">
                    <Trash2 size={15} style={{ color: 'var(--error)' }} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{formatMoney(p.price)} so'm</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                    {t('seller.product_cost')}: {formatMoney(p.cost_price)} so'm
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => changeQuantity(p.id, -1)}
                    disabled={busyId === p.id || p.quantity === 0}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Decrease"
                  >
                    <Minus size={14} style={{ color: 'var(--text)' }} />
                  </button>
                  <span className="min-w-[72px] text-center text-sm font-bold" style={{ color: 'var(--primary-active)' }}>
                    {p.quantity} {t('seller.units')}
                  </span>
                  <button
                    onClick={() => changeQuantity(p.id, 1)}
                    disabled={busyId === p.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        initial={
          editing
            ? {
                name: editing.name,
                category: editing.category ?? '',
                price: String(editing.price),
                cost_price: String(editing.cost_price ?? ''),
                quantity: String(editing.quantity),
                description: editing.description ?? '',
              }
            : emptyProductForm
        }
        submitting={submitting}
        error={error}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
      />
    </div>
  )
}
