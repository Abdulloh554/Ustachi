'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer, Loader2, Receipt as ReceiptIcon } from 'lucide-react'
import { orderAPI } from '@/lib/api'
import Modal from '@/components/crm/Modal'
import { formatMoney, formatDate } from '@/lib/utils'

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? 'font-bold' : ''} style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="font-semibold text-right" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}

export default function ReceiptModal({
  orderId,
  open,
  onClose,
}: {
  orderId: string
  open: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !orderId) return
    setLoading(true)
    orderAPI
      .receipt(orderId)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [open, orderId])

  return (
    <Modal open={open} onClose={onClose} title={t('crm.receipt_title')} maxWidth="max-w-sm">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : data ? (
        <div className="space-y-4">
          <div id="receipt-print" className="text-sm space-y-3" style={{ color: 'var(--text)' }}>
            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center gap-2 font-bold">
                <ReceiptIcon size={16} /> {data.workshop?.name || 'Ustachi'}
              </div>
              {data.workshop?.phone && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{data.workshop.phone}</p>
              )}
              {data.workshop?.address && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{data.workshop.address}</p>
              )}
            </div>

            <div className="border-t border-dashed border-[var(--border-strong)] pt-3 space-y-1.5">
              <Row label={t('crm.receipt_order')} value={`#${data.order.queue_number}`} bold />
              <Row label={t('crm.receipt_date')} value={formatDate(data.order.created_at || data.created_at)} />
              <Row label={t('crm.receipt_client')} value={data.order.client_name || data.order.client_details?.first_name || '—'} />
              <Row label={t('crm.receipt_service')} value={data.order.service_type || '—'} />
              <Row label={t('crm.receipt_staff')} value={data.staff_name || '—'} />
              <Row label={t('crm.receipt_status')} value={t(`status.${data.order.status}`)} />
            </div>

            {data.items.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  {t('crm.receipt_consumed')}
                </p>
                <div className="border-t border-dashed border-[var(--border-strong)] pt-2 space-y-1.5">
                  {data.items.map((item: any) => (
                    <div key={item.product} className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--text)' }}>{item.product_name}</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {item.quantity} × {formatMoney(item.unit_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-dashed border-[var(--border-strong)] pt-2 space-y-1.5">
              <Row label={t('crm.receipt_total')} value={`${formatMoney(data.paid)} so'm`} bold />
            </div>
          </div>

          <button className="btn btn-primary w-full" onClick={() => window.print()}>
            <Printer size={14} className="mr-1.5 inline" /> {t('crm.print')}
          </button>
        </div>
      ) : (
        <p className="text-sm text-center py-8" style={{ color: 'var(--text-light)' }}>{t('crm.error')}</p>
      )}
    </Modal>
  )
}
