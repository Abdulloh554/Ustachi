'use client'

import { getStatusLabel } from '@/lib/utils'

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge badge-${status}`}>
      {getStatusLabel(status)}
    </span>
  )
}
