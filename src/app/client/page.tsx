'use client'

import { useEffect, useState } from 'react'
import { orderAPI, professionAPI, reviewAPI } from '@/lib/api'
import OrderCard from '@/components/OrderCard'
import { useTranslation } from 'react-i18next'
import { Plus, X, Star } from 'lucide-react'

export default function ClientOrdersPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<any[]>([])
  const [professions, setProfessions] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [pending, setPending] = useState<any[]>([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', profession: '', address: '', price: '', location_lat: 41.3, location_lng: 69.2 })

  useEffect(() => {
    loadOrders()
    professionAPI.list().then((res) => setProfessions(res.data.results || res.data))
  }, [])

  const loadOrders = async () => {
    const res = await orderAPI.list()
    const all = res.data.results || res.data
    setOrders(all)
    setPending(all.filter((o: any) => o.status === 'completed' && !o.my_review))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await orderAPI.create({
      ...form,
      profession: form.profession ? parseInt(form.profession) : null,
    })
    setShowModal(false)
    setForm({ title: '', description: '', profession: '', address: '', price: '', location_lat: 41.3, location_lng: 69.2 })
    loadOrders()
  }

  const submitReview = async () => {
    const current = pending[0]
    if (!current || rating === 0 || submitting) return
    setSubmitting(true)
    try {
      await reviewAPI.submit({ order: current.id, rating, comment })
      setOrders((prev) => prev.map((o) =>
        o.id === current.id ? { ...o, my_review: { rating, comment } } : o
      ))
      setRating(0)
      setComment('')
      setPending((prev) => prev.slice(1))
    } catch {
      // baholash muvaffaqiyatsiz
    } finally {
      setSubmitting(false)
    }
  }

  const currentReview = pending[0]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">{t('client.my_orders')}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 px-3 py-1.5 text-sm"
        >
          <Plus size={16} /> {t('client.new_order')}
        </button>
      </div>

      <div className="space-y-3">
        {orders.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-light)' }}>{t('client.no_orders')}</p>
        )}
        {orders.map((order: any) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">{t('client.new_order')}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost p-1"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder={t('order.title')}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                required
              />
              <textarea
                placeholder={t('order.description')}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="input"
                required
              />
              <select
                value={form.profession}
                onChange={(e) => setForm({ ...form, profession: e.target.value })}
                className="select"
              >
                <option value="">{t('order.choose_field')}</option>
                {professions.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name_uz}</option>
                ))}
              </select>
              <input
                placeholder={t('order.address')}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input"
              />
              <input
                placeholder={t('order.price')}
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
              />
              <button type="submit" className="btn btn-primary w-full py-2 font-medium">
                {t('order.submit')}
              </button>
            </form>
          </div>
        </div>
      )}

      {currentReview && (
        <div className="modal-overlay">
          <div className="modal p-6 text-center animate-scale-in">
            <h2 className="font-display font-extrabold text-lg mb-1">{t('reviews.rate_title')}</h2>
            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{t('reviews.rate_desc')}</p>
            <p className="text-sm font-semibold mb-4">{currentReview.title}</p>

            <div className="flex items-center justify-center gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={34}
                    fill={n <= rating ? 'currentColor' : 'none'}
                    style={{ color: n <= rating ? 'var(--warning)' : 'var(--text-light)' }}
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder={t('reviews.comment_optional')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="input mb-4 text-left"
            />

            <button
              onClick={submitReview}
              disabled={rating === 0 || submitting}
              className="btn btn-primary w-full py-2.5 font-bold disabled:opacity-50"
            >
              {submitting ? t('reviews.submitting') : t('reviews.submit')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
