'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, CheckCircle, X, UserX, Loader2, PackagePlus, Receipt } from 'lucide-react'
import { orderAPI } from '@/lib/api'
import Modal from '@/components/crm/Modal'
import ReceiptModal from '@/components/crm/ReceiptModal'
import { useAuthStore } from '@/store/authStore'

export default function OrderActions({
  order,
  staffList = [],
  products = [],
  onChanged,
}: {
  order: any
  staffList?: any[]
  products?: any[]
  onChanged: () => void
}) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const role = user?.role || 'client'
  const isOwner = role === 'owner'

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [assignStaff, setAssignStaff] = useState('')
  const [showComplete, setShowComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [showConsume, setShowConsume] = useState(false)
  const [consumeProduct, setConsumeProduct] = useState('')
  const [consumeQty, setConsumeQty] = useState(1)
  const [showReceipt, setShowReceipt] = useState(false)

  const run = async (fn: () => Promise<any>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      onChanged()
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.detail || t('crm.error'))
    } finally {
      setBusy(false)
    }
  }

  const doAssign = () => {
    if (!assignStaff) return
    run(() => orderAPI.assign(order.id, assignStaff))
  }

  const doComplete = () => {
    run(async () => {
      await orderAPI.updateStatus(order.id, 'completed', paymentMethod)
      setShowComplete(false)
    })
  }

  const doConsume = () => {
    if (!consumeProduct || !consumeQty) return
    run(async () => {
      await orderAPI.consume(order.id, consumeProduct, Number(consumeQty))
      setShowConsume(false)
      setConsumeQty(1)
    })
  }

  const status = order.status
  const canStart = status === 'assigned'
  const canComplete = status === 'in_progress'
  const canCancel = isOwner && (status === 'queued' || status === 'assigned')
  const canNoShow = isOwner && (status === 'queued' || status === 'assigned')
  const canConsume = (isOwner || role === 'staff') && status === 'in_progress' && products.length > 0
  const canReceipt = status === 'completed'

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {isOwner && status === 'queued' && (
          <div className="flex items-center gap-1.5">
            <select
              className="input !py-1.5 !h-auto text-sm min-w-[150px]"
              value={assignStaff}
              onChange={(e) => setAssignStaff(e.target.value)}
            >
              <option value="">{t('crm.select_staff')}</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.user?.id || s.id}>
                  {s.staff_name}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary !py-1.5 !h-auto text-sm"
              onClick={doAssign}
              disabled={busy || !assignStaff}
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : t('crm.assign')}
            </button>
          </div>
        )}

        {canStart && (
          <button
            className="btn btn-primary !py-1.5 !h-auto text-sm"
            onClick={() => run(() => orderAPI.updateStatus(order.id, 'in_progress'))}
            disabled={busy}
          >
            <Play size={14} className="mr-1 inline" /> {t('crm.start')}
          </button>
        )}

        {canComplete && (
          <button
            className="btn btn-success !py-1.5 !h-auto text-sm"
            onClick={() => setShowComplete(true)}
          >
            <CheckCircle size={14} className="mr-1 inline" /> {t('crm.complete')}
          </button>
        )}

        {canConsume && (
          <button
            className="btn !py-1.5 !h-auto text-sm"
            onClick={() => setShowConsume(true)}
            style={{ borderColor: 'var(--border)' }}
          >
            <PackagePlus size={14} className="mr-1 inline" /> {t('crm.consume')}
          </button>
        )}

        {canReceipt && (
          <button
            className="btn !py-1.5 !h-auto text-sm"
            onClick={() => setShowReceipt(true)}
            style={{ borderColor: 'var(--border)' }}
          >
            <Receipt size={14} className="mr-1 inline" /> {t('crm.receipt_title')}
          </button>
        )}

        {canNoShow && (
          <button
            className="btn !py-1.5 !h-auto text-sm"
            onClick={() => {
              if (confirm(t('crm.confirm_no_show'))) run(() => orderAPI.updateStatus(order.id, 'no_show'))
            }}
            disabled={busy}
            style={{ borderColor: 'var(--border)' }}
          >
            <UserX size={14} className="mr-1 inline" /> {t('crm.no_show')}
          </button>
        )}

        {canCancel && (
          <button
            className="btn btn-danger !py-1.5 !h-auto text-sm"
            onClick={() => {
              if (confirm(t('crm.confirm_cancel'))) run(() => orderAPI.cancel(order.id))
            }}
            disabled={busy}
          >
            <X size={14} className="mr-1 inline" /> {t('crm.cancel')}
          </button>
        )}
      </div>

      {error && <p className="error mt-2 text-sm">{error}</p>}

      <Modal open={showComplete} onClose={() => setShowComplete(false)} title={t('crm.complete')}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('crm.payment_method')}</label>
            <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">{t('crm.cash')}</option>
              <option value="card">{t('crm.card')}</option>
              <option value="transfer">{t('crm.transfer')}</option>
            </select>
          </div>
          <button className="btn btn-success w-full" onClick={doComplete} disabled={busy}>
            {busy && <Loader2 size={16} className="inline animate-spin mr-2" />}
            {t('crm.complete')}
          </button>
        </div>
      </Modal>

      <Modal open={showConsume} onClose={() => setShowConsume(false)} title={t('crm.consume')}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('crm.consume_product')}</label>
            <select className="input" value={consumeProduct} onChange={(e) => setConsumeProduct(e.target.value)}>
              <option value="">{t('crm.consume_product')}...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.quantity} {p.unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('crm.consume_qty')}</label>
            <input
              type="number"
              className="input"
              value={consumeQty}
              min={1}
              onChange={(e) => setConsumeQty(Number(e.target.value))}
            />
          </div>
          <button className="btn btn-primary w-full" onClick={doConsume} disabled={busy || !consumeProduct}>
            {busy && <Loader2 size={16} className="inline animate-spin mr-2" />}
            {t('crm.consume_btn')}
          </button>
        </div>
      </Modal>

      <ReceiptModal orderId={order.id} open={showReceipt} onClose={() => setShowReceipt(false)} />
    </div>
  )
}
