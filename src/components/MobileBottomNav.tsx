'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, ClipboardList, Map, User, Settings,
} from 'lucide-react'

const clientLinks = [
  { href: '/client', labelKey: 'sidebar.orders', icon: ClipboardList },
  { href: '/client/masters', labelKey: 'sidebar.masters', icon: Users },
  { href: '/client/profile', labelKey: 'sidebar.profile', icon: User },
  { href: '/client/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const masterLinks = [
  { href: '/master', labelKey: 'sidebar.listings', icon: LayoutDashboard },
  { href: '/master/map', labelKey: 'sidebar.map', icon: Map },
  { href: '/master/profile', labelKey: 'sidebar.profile', icon: User },
  { href: '/master/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const adminLinks = [
  { href: '/admin', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
  { href: '/admin/masters', labelKey: 'sidebar.masters', icon: Users },
  { href: '/admin/orders', labelKey: 'sidebar.orders_alt', icon: ClipboardList },
  { href: '/admin/settings', labelKey: 'sidebar.settings', icon: Settings },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { t } = useTranslation()

  const role = user?.role || 'client'
  let links = clientLinks
  if (role === 'master') links = masterLinks
  if (role === 'admin') links = adminLinks

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-[var(--border)] bg-[var(--surface)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 min-h-[56px] py-1.5 transition-colors ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text-light)]'
              }`}
            >
              <span
                className={`flex items-center justify-center w-12 h-8 rounded-lg transition-colors ${
                  isActive ? 'bg-[var(--accent-light)]' : ''
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span className="text-[10px] font-medium leading-none">{t(link.labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
