'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getActivePanel } from '@/lib/panel'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, ClipboardList, Settings, CalendarCheck,
  MessageSquare, Users, Wrench, Boxes, BarChart3,
} from 'lucide-react'

const ownerLinks = [
  { href: '/dashboard', labelKey: 'sidebar.today', icon: LayoutDashboard },
  { href: '/dashboard/orders', labelKey: 'sidebar.orders_alt', icon: ClipboardList },
  { href: '/dashboard/staff', labelKey: 'sidebar.staff', icon: Users },
  { href: '/dashboard/inventory', labelKey: 'sidebar.inventory', icon: Boxes },
  { href: '/dashboard/reports', labelKey: 'sidebar.reports', icon: BarChart3 },
  { href: '/chat', labelKey: 'sidebar.chat', icon: MessageSquare },
]

const staffLinks = [
  { href: '/staff', labelKey: 'sidebar.today', icon: CalendarCheck },
  { href: '/staff/orders', labelKey: 'sidebar.orders_alt', icon: ClipboardList },
  { href: '/chat', labelKey: 'sidebar.chat', icon: MessageSquare },
]

const clientLinks = [
  { href: '/client', labelKey: 'sidebar.orders', icon: ClipboardList },
  { href: '/chat', labelKey: 'sidebar.chat', icon: MessageSquare },
]

const adminLinks = [
  { href: '/admin/settings', labelKey: 'sidebar.settings', icon: Settings },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { t } = useTranslation()

  const role = user?.role || 'client'
  const activePanel = getActivePanel(pathname)
  const panel = activePanel || role
  let links = clientLinks
  if (panel === 'dashboard') links = ownerLinks
  if (panel === 'staff') links = staffLinks
  if (panel === 'admin') links = adminLinks

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-[var(--border)] bg-[var(--surface)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] py-1.5 transition-all duration-200 ${
                isActive ? 'text-[var(--primary-active)]' : 'text-[var(--text-light)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <span
                className={`flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[var(--primary-light)]' : ''
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
