'use client'

import { useEffect, useState } from 'react'
import { reviewAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/lib/utils'
import { Star, MessageSquare } from 'lucide-react'

export default function MasterReviewsPage() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    reviewAPI.myReviews().then((res) => {
      setReviews(res.data.results || res.data)
    })
  }, [])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold">{t('sidebar.reviews')}</h1>
        {reviews.length > 0 && (
          <span className="pill active cursor-default text-sm">{reviews.length}</span>
        )}
      </div>

      {reviews.length === 0 && (
        <p className="text-text-secondary text-center py-12">{t('reviews.empty')}</p>
      )}

      <div className="space-y-4">
        {reviews.map((review: any) => (
          <div key={review.id} className="card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <h3 className="font-display font-bold truncate">{review.order_title}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                  {review.client_name || review.client_phone} · {formatDate(review.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={18}
                    fill={n <= review.rating ? 'currentColor' : 'none'}
                    style={{ color: n <= review.rating ? 'var(--warning)' : 'var(--text-light)' }}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('reviews.got_rating', { stars: review.rating })}
            </p>

            {review.comment ? (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <MessageSquare size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <p className="text-sm leading-relaxed">{review.comment}</p>
              </div>
            ) : (
              <p className="text-xs mt-3" style={{ color: 'var(--text-light)' }}>{t('reviews.no_comment')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
