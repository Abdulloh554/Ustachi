'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { reviewAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Users, ClipboardList, Map, User,
  Settings, LogOut, Sun, Moon, Wrench, Star,
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
  { href: '/master/reviews', labelKey: 'sidebar.reviews', icon: Star },
  { href: '/master/profile', labelKey: 'sidebar.profile', icon: User },
  { href: '/master/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const adminLinks = [
  { href: '/admin', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
  { href: '/admin/masters', labelKey: 'sidebar.masters', icon: Users },
  { href: '/admin/orders', labelKey: 'sidebar.orders_alt', icon: ClipboardList },
  { href: '/admin/map', labelKey: 'sidebar.map', icon: Map },
  { href: '/admin/settings', labelKey: 'sidebar.settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const { t } = useTranslation()

  const role = user?.role || 'client'
  let links = clientLinks
  if (role === 'master') links = masterLinks
  if (role === 'admin') links = adminLinks

  const [reviewCount, setReviewCount] = useState(0)

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

  const initial = (user?.first_name?.[0] || user?.phone?.[0] || '?').toUpperCase()

  return (
    <aside className="sidebar fixed left-0 top-0 h-full w-64 flex flex-col z-50 animate-slide-in">
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-accent">
            <Wrench size={18} className="text-white" />
          </span>
          <div>
            <h1 className="font-display font-extrabold text-base leading-tight">{t('app.name')}</h1>
            <p className="text-[11px] font-medium capitalize" style={{ color: 'var(--text-light)' }}>
              {t(`role.${role}`)}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link, i) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${i * 0.05}s` }}
              className={`nav-item ${isActive ? 'active' : ''} ${isActive ? 'text-white' : ''}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
              <span className="font-medium">{t(link.labelKey)}</span>
              {link.href === '/master/reviews' && reviewCount > 0 && (
                <span className="ml-auto text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-white"
                  style={{ background: 'var(--accent)' }}>
                  {reviewCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <div className="flex items-center gap-3 px-2 py-2.5 mb-1">
          <div className="avatar w-9 h-9 rounded-full text-sm">{initial}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user?.first_name || user?.phone}</p>
            <p className="text-[11px] truncate" style={{ color: 'var(--text-light)' }}>{user?.phone}</p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="nav-item w-full"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? t('sidebar.light_mode') : t('sidebar.dark_mode')}
        </button>
        <button
          onClick={logout}
          className="nav-item w-full"
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={18} />
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  )
}
