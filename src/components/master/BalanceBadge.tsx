'use client'

import { useTranslation } from 'react-i18next'
import { Wallet } from 'lucide-react'

export default function BalanceBadge({ balance }: { balance: number | null }) {
  const { t } = useTranslation()

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[var(--primary)]/40"
      style={{ background: 'var(--primary-light)' }}
    >
      <Wallet size={16} style={{ color: 'var(--primary-active)' }} />
      <div className="leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--primary-active)' }}>
          {t('master.balance')}
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--primary-active)' }}>
          {balance != null ? balance.toLocaleString('ru-RU') : '...'}
          <span className="font-medium opacity-80 ml-1">{t('order.price_label')}</span>
        </span>
      </div>
    </div>
  )
}
