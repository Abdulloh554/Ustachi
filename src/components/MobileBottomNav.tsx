'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getActivePanel } from '@/lib/panel'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, ClipboardList, Map, User, Settings,
  Store, Boxes, BarChart3, ShoppingCart,
} from 'lucide-react'

const clientLinks = [
  { href: '/client', labelKey: 'sidebar.orders', icon: ClipboardList },
  { href: '/client/masters', labelKey: 'sidebar.masters', icon: Users },
  { href: '/client/store', labelKey: 'sidebar.store', icon: Store },
  { href: '/client/cart', labelKey: 'sidebar.cart', icon: ShoppingCart },
  { href: '/client/profile', labelKey: 'sidebar.profile', icon: User },
  { href: '/client/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const masterLinks = [
  { href: '/master', labelKey: 'sidebar.listings', icon: LayoutDashboard },
  { href: '/master/map', labelKey: 'sidebar.map', icon: Map },
  { href: '/master/profile', labelKey: 'sidebar.profile', icon: User },
  { href: '/master/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const sellerLinks = [
  { href: '/seller/warehouse', labelKey: 'sidebar.warehouse', icon: Boxes },
  { href: '/seller/statistics', labelKey: 'sidebar.statistics', icon: BarChart3 },
  { href: '/seller/settings', labelKey: 'sidebar.settings', icon: Settings },
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
  const activePanel = getActivePanel(pathname)
  const panel = activePanel || role
  let links = clientLinks
  if (panel === 'master') links = masterLinks
  if (panel === 'seller') links = sellerLinks
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
