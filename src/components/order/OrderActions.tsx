'use client'

import { useTranslation } from 'react-i18next'

export default function OrderActions({
  status,
  onAccept,
  onStatusChange,
  acceptPrice,
  acceptDisabled,
}: {
  status: string
  onAccept?: () => void
  onStatusChange?: (status: string) => void
  acceptPrice?: number | null
  acceptDisabled?: boolean
}) {
  const { t } = useTranslation()

  if (status === 'new' && onAccept) {
    return (
      <button
        onClick={onAccept}
        disabled={acceptDisabled}
        className="btn btn-primary mt-4 w-full py-2.5 font-bold"
      >
        {t('order.accept')}
        {acceptPrice != null && (
          <span className="ml-2 opacity-90">- {acceptPrice.toLocaleString('ru-RU')} {t('order.price_label')}</span>
        )}
      </button>
    )
  }

  if (onStatusChange) {
    return (
      <div className="mt-4 flex gap-2">
        {status === 'accepted' && (
          <button onClick={() => onStatusChange('coming')} className="btn btn-primary flex-1 py-2.5 font-bold">
            {t('order.coming')}
          </button>
        )}
        {status === 'coming' && (
          <button onClick={() => onStatusChange('in_progress')} className="btn btn-primary flex-1 py-2.5 font-bold">
            {t('order.in_progress')}
          </button>
        )}
        {status === 'in_progress' && (
          <>
            <button onClick={() => onStatusChange('completed')} className="btn btn-primary flex-1 py-2.5 font-bold">
              {t('order.completed')}
            </button>
            <button onClick={() => onStatusChange('failed')} className="btn btn-danger flex-1 py-2.5 font-bold">
              {t('order.failed')}
            </button>
          </>
        )}
      </div>
    )
  }

  return null
}
