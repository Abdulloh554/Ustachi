'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from 'react-i18next'
import { Shield, User, Wrench, Store, LucideIcon } from 'lucide-react'

interface Panel {
  href: string
  labelKey: string
  icon: LucideIcon
}

const panels: Panel[] = [
  { href: '/admin', labelKey: 'panel.admin', icon: Shield },
  { href: '/client', labelKey: 'panel.client', icon: User },
  { href: '/master', labelKey: 'panel.master', icon: Wrench },
  { href: '/seller', labelKey: 'panel.seller', icon: Store },
]

export default function PanelSwitcher() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const pathname = usePathname()

  if (user?.role !== 'admin') return null

  const activeHref =
    panels.find((p) => pathname === p.href || pathname.startsWith(`${p.href}/`))?.href || null

  return (
    <div className="sticky top-0 z-40 sm:ml-16 lg:ml-[280px] border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="flex items-center gap-1.5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
        {panels.map((panel) => {
          const Icon = panel.icon
          const isActive = panel.href === activeHref
          return (
            <Link
              key={panel.href}
              href={panel.href}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-white bg-[var(--primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <Icon size={15} strokeWidth={isActive ? 2.4 : 2} />
              {t(panel.labelKey)}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
