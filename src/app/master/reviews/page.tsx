'use client'

import { useEffect, useState } from 'react'
import { reviewAPI } from '@/lib/api'
import { SkeletonCardList } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/lib/utils'
import { Star, MessageSquare } from 'lucide-react'

export default function MasterReviewsPage() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewAPI.myReviews().then((res) => {
      setReviews(res.data.results || res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{t('sidebar.reviews')}</h1>
          <p className="caption mt-1">{t('reviews.subtitle')}</p>
        </div>
        {reviews.length > 0 && (
          <span className="pill active cursor-default text-sm">{reviews.length}</span>
        )}
      </div>

      {loading ? (
        <SkeletonCardList count={3} />
      ) : (
        <>
          {reviews.length === 0 && (
            <p className="text-text-secondary text-center py-12">{t('reviews.empty')}</p>
          )}
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{review.order_title}</h3>
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
                        style={{ color: n <= review.rating ? 'var(--primary)' : 'var(--text-light)' }}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('reviews.got_rating', { stars: review.rating })}
                </p>

                {review.comment ? (
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ) : (
                  <p className="text-xs mt-3" style={{ color: 'var(--text-light)' }}>{t('reviews.no_comment')}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
