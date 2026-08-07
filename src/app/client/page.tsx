'use client'

import { useEffect, useState } from 'react'
import { orderAPI, professionAPI, reviewAPI } from '@/lib/api'
import OrderCard from '@/components/OrderCard'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonCardList } from '@/components/ui/Skeleton'
import CreateOrderModal from '@/components/client/CreateOrderModal'
import ReviewModal from '@/components/client/ReviewModal'
import { useTranslation } from 'react-i18next'
import { Plus, ClipboardList } from 'lucide-react'

export default function ClientOrdersPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<any[]>([])
  const [professions, setProfessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [pending, setPending] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadOrders()
    professionAPI.list().then((res) => setProfessions(res.data.results || res.data))
  }, [])

  const loadOrders = async () => {
    const res = await orderAPI.list()
    const all = res.data.results || res.data
    setOrders(all)
    setPending(all.filter((o: any) => o.status === 'completed' && !o.my_review))
    setLoading(false)
  }

  const handleCreate = async (form: any) => {
    await orderAPI.create({
      ...form,
      profession: form.profession ? parseInt(form.profession) : null,
    })
    setShowModal(false)
    loadOrders()
  }

  const submitReview = async (rating: number, comment: string) => {
    const current = pending[0]
    if (!current) return
    setSubmitting(true)
    try {
      await reviewAPI.submit({ order: current.id, rating, comment })
      setOrders((prev) => prev.map((o) =>
        o.id === current.id ? { ...o, my_review: { rating, comment } } : o
      ))
      setPending((prev) => prev.slice(1))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await orderAPI.cancel(id)
      loadOrders()
    } catch (err: any) {
      const data = err.response?.data
      const message = typeof data === 'string' ? data : data?.error || t('auth.error_occurred')
      window.alert(message)
    }
  }

  const currentReview = pending[0]

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('client.my_orders')}</h1>
          <p className="caption mt-1">{t('client.orders_subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary min-h-11 shrink-0"
        >
          <Plus size={16} /> {t('client.new_order')}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <SkeletonCardList count={3} />
        ) : (
          <>
            {orders.length === 0 && (
              <EmptyState
                icon={<ClipboardList size={24} />}
                title={t('client.no_orders')}
                description={t('client.no_orders_desc')}
                action={
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus size={16} /> {t('client.new_order')}
                  </button>
                }
              />
            )}
            {orders.map((order: any, index) => (
              <div key={order.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                <OrderCard order={order} onCancel={() => handleCancel(order.id)} />
              </div>
            ))}
          </>
        )}
      </div>

      {showModal && (
        <CreateOrderModal
          professions={professions}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      {currentReview && (
        <ReviewModal
          orderTitle={currentReview.title}
          submitting={submitting}
          onSubmit={submitReview}
        />
      )}
    </div>
  )
}
