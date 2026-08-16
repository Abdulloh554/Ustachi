'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { getActivePanel } from '@/lib/panel'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, ClipboardList, Users, Wrench, Boxes, BarChart3,
  Settings, LogOut, Sun, Moon, Menu, X, CalendarCheck, MessageSquare, UserRound,
} from 'lucide-react'
import SidebarHeader from '@/components/sidebar/SidebarHeader'
import SidebarNav, { SidebarLink } from '@/components/sidebar/SidebarNav'
import SidebarFooter from '@/components/sidebar/SidebarFooter'

const ownerLinks: SidebarLink[] = [
  { href: '/dashboard', labelKey: 'sidebar.today', icon: LayoutDashboard },
  { href: '/dashboard/orders', labelKey: 'sidebar.orders_alt', icon: ClipboardList },
  { href: '/dashboard/staff', labelKey: 'sidebar.staff', icon: Users },
  { href: '/dashboard/services', labelKey: 'sidebar.services', icon: Wrench },
  { href: '/dashboard/inventory', labelKey: 'sidebar.inventory', icon: Boxes },
  { href: '/dashboard/reports', labelKey: 'sidebar.reports', icon: BarChart3 },
  { href: '/chat', labelKey: 'sidebar.chat', icon: MessageSquare },
  { href: '/profile', labelKey: 'sidebar.profile', icon: UserRound },
  { href: '/dashboard/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const staffLinks: SidebarLink[] = [
  { href: '/staff', labelKey: 'sidebar.today', icon: CalendarCheck },
  { href: '/staff/orders', labelKey: 'sidebar.orders_alt', icon: ClipboardList },
  { href: '/chat', labelKey: 'sidebar.chat', icon: MessageSquare },
  { href: '/profile', labelKey: 'sidebar.profile', icon: UserRound },
  { href: '/staff/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const clientLinks: SidebarLink[] = [
  { href: '/client', labelKey: 'sidebar.orders', icon: ClipboardList },
  { href: '/chat', labelKey: 'sidebar.chat', icon: MessageSquare },
  { href: '/profile', labelKey: 'sidebar.profile', icon: UserRound },
  { href: '/client/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const adminLinks: SidebarLink[] = [
  { href: '/profile', labelKey: 'sidebar.profile', icon: UserRound },
  { href: '/admin/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const linksByRole: Record<string, SidebarLink[]> = {
  owner: ownerLinks,
  staff: staffLinks,
  client: clientLinks,
  admin: adminLinks,
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const role = user?.role || 'client'
  const activePanel = getActivePanel(pathname)
  const panel = activePanel || role
  const links = linksByRole[panel] || linksByRole[role] || clientLinks
  const headerRole = panel === 'dashboard' ? 'owner' : panel

  useEffect(() => {
    setOpen(false)
  }, [pathname])

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

        <SidebarHeader open={open} role={headerRole} />

        <SidebarNav links={links} open={open} badges={{}} />

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
