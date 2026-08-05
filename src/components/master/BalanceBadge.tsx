'use client'

import { useTranslation } from 'react-i18next'
import { Wallet } from 'lucide-react'

export default function BalanceBadge({ balance }: { balance: number | null }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
      <Wallet size={16} />
      <span>{balance != null ? balance.toLocaleString('ru-RU') : '...'}</span>
      <span className="font-medium opacity-80">{t('order.price_label')}</span>
    </div>
  )
}
