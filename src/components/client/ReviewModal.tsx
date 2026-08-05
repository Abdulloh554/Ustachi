'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'

interface ReviewModalProps {
  orderTitle: string
  submitting: boolean
  onSubmit: (rating: number, comment: string) => Promise<void>
}

export default function ReviewModal({ orderTitle, submitting, onSubmit }: ReviewModalProps) {
  const { t } = useTranslation()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const submit = async () => {
    if (rating === 0 || submitting) return
    await onSubmit(rating, comment)
    setRating(0)
    setComment('')
  }

  return (
    <div className="modal-overlay">
      <div className="modal p-6 text-center animate-scale-in">
        <h2 className="font-display font-extrabold text-lg mb-1">{t('reviews.rate_title')}</h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{t('reviews.rate_desc')}</p>
        <p className="text-sm font-semibold mb-4">{orderTitle}</p>

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
          onClick={submit}
          disabled={rating === 0 || submitting}
          className="btn btn-primary w-full py-2.5 font-bold disabled:opacity-50"
        >
          {submitting ? t('reviews.submitting') : t('reviews.submit')}
        </button>
      </div>
    </div>
  )
}
