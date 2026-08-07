'use client'

import { useTranslation } from 'react-i18next'
import StatusBadge from '@/components/StatusBadge'

const AVATAR_COLORS: [string, string][] = [
  ['#EFF6FF', '#1D4ED8'],
  ['#FEF3E2', '#B45309'],
  ['#F0FDF4', '#15803D'],
  ['#FEF2F2', '#B91C1C'],
  ['#F5F3FF', '#6D28D9'],
  ['#ECFEFF', '#0E7490'],
]

export function pickAvatarColor(name: string): [string, string] {
  let sum = 0
  for (const ch of name) sum += ch.charCodeAt(0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

export default function OrderClientInfo({
  title,
  name,
  phone,
  status,
}: {
  title?: string
  name: string
  phone?: string
  status: string
}) {
  const { t } = useTranslation()
  const [avatarBg, avatarFg] = pickAvatarColor(name)

  return (
    <div className="flex flex-col min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
      <div className="w-full min-w-0 min-[640px]:w-auto">
        {title && <h3 className="text-lg font-semibold leading-snug">{title}</h3>}
        <div className="flex items-center gap-2.5 mt-2">
          <span
            className="avatar w-8 h-8 rounded-full text-xs shrink-0 min-[640px]:w-9 min-[640px]:h-9 min-[640px]:text-sm"
            style={{ background: avatarBg, color: avatarFg }}
          >
            {name[0]?.toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium truncate">{name}</span>
            <span className="block text-xs truncate" style={{ color: 'var(--text-light)' }}>
              {phone || t('role.client')}
            </span>
          </span>
        </div>
      </div>
      <div className="shrink-0 self-end min-[640px]:self-auto">
        <StatusBadge status={status} />
      </div>
    </div>
  )
}
