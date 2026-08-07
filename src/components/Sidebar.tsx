'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { reviewAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, ClipboardList, Map, User,
  Settings, LogOut, Sun, Moon, Wrench, Star, Menu, X,
  Store, Boxes, BarChart3, ShoppingCart,
} from 'lucide-react'
import SidebarHeader from '@/components/sidebar/SidebarHeader'
import SidebarNav, { SidebarLink } from '@/components/sidebar/SidebarNav'
import SidebarFooter from '@/components/sidebar/SidebarFooter'

const clientLinks: SidebarLink[] = [
  { href: '/client', labelKey: 'sidebar.orders', icon: ClipboardList },
  { href: '/client/masters', labelKey: 'sidebar.masters', icon: Users },
  { href: '/client/store', labelKey: 'sidebar.store', icon: Store },
  { href: '/client/cart', labelKey: 'sidebar.cart', icon: ShoppingCart },
  { href: '/client/profile', labelKey: 'sidebar.profile', icon: User },
  { href: '/client/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const masterLinks: SidebarLink[] = [
  { href: '/master', labelKey: 'sidebar.listings', icon: LayoutDashboard },
  { href: '/master/map', labelKey: 'sidebar.map', icon: Map },
  { href: '/master/reviews', labelKey: 'sidebar.reviews', icon: Star },
  { href: '/master/profile', labelKey: 'sidebar.profile', icon: User },
  { href: '/master/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const sellerLinks: SidebarLink[] = [
  { href: '/seller/warehouse', labelKey: 'sidebar.warehouse', icon: Boxes },
  { href: '/seller/statistics', labelKey: 'sidebar.statistics', icon: BarChart3 },
  { href: '/seller/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const adminLinks: SidebarLink[] = [
  { href: '/admin', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
  { href: '/admin/masters', labelKey: 'sidebar.masters', icon: Users },
  { href: '/admin/orders', labelKey: 'sidebar.orders_alt', icon: ClipboardList },
  { href: '/admin/map', labelKey: 'sidebar.map', icon: Map },
  { href: '/admin/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const linksByRole: Record<string, SidebarLink[]> = {
  client: clientLinks,
  master: masterLinks,
  seller: sellerLinks,
  admin: adminLinks,
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [reviewCount, setReviewCount] = useState(0)

  const role = user?.role || 'client'
  const links = linksByRole[role] || clientLinks

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (role === 'master') {
      reviewAPI.myReviews()
        .then((res) => {
          const list = res.data.results || res.data
          setReviewCount(Array.isArray(list) ? list.length : 0)
        })
        .catch(() => {})
    }
  }, [role])

  const badges: Record<string, number> = {}
  if (role === 'master') {
    badges['/master/reviews'] = reviewCount
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`sidebar fixed left-0 top-0 h-full z-50 flex flex-col hidden sm:flex transition-[width,box-shadow,transform] ${
          open ? 'max-lg:w-64' : 'max-lg:w-16'
        } lg:w-[280px]`}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="hidden sm:flex lg:hidden items-center justify-center shrink-0 m-2 w-11 h-11 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <SidebarHeader open={open} role={role} />

        <SidebarNav links={links} open={open} badges={badges} />

        <SidebarFooter
          open={open}
          user={user}
          theme={theme}
          onToggleTheme={toggle}
          onLogout={logout}
        />
      </aside>
    </>
  )
}
