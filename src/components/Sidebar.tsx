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
  Settings, LogOut, Sun, Moon, Wrench, Star, Menu, X,
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

type SidebarLink = (typeof clientLinks)[number]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const role = user?.role || 'client'
  let links: SidebarLink[] = clientLinks
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

  const isAccount = (href: string) => href.includes('/profile') || href.includes('/settings')
  const mainLinks = links.filter((l) => !isAccount(l.href))
  const accountLinks = links.filter((l) => isAccount(l.href))

  const renderLink = (link: SidebarLink, index: number) => {
    const Icon = link.icon
    const isActive = pathname === link.href
    const expanded = `${open ? 'max-lg:block' : 'max-lg:hidden'} lg:block`
    return (
      <Link
        key={link.href}
        href={link.href}
        style={{ animationDelay: `${index * 0.05}s` }}
        className={`nav-item ${isActive ? 'active' : ''} ${
          open
            ? 'max-lg:justify-start'
            : 'max-lg:justify-center max-lg:px-0'
        } lg:justify-start`}
      >
        <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
        <span className={`font-medium ${expanded}`}>{t(link.labelKey)}</span>
        {link.href === '/master/reviews' && reviewCount > 0 && (
          <span
            className={`ml-auto text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-white bg-[var(--accent)] ${expanded}`}
          >
            {reviewCount}
          </span>
        )}
      </Link>
    )
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

        <div
          className={`px-5 pt-5 pb-5 bg-[var(--accent)] text-white ${
            open ? 'max-lg:block' : 'max-lg:hidden'
          } lg:block`}
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Wrench size={19} />
            </span>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-base leading-tight text-white">{t('app.name')}</h1>
              <p className="text-[11px] text-white/80 capitalize">{t(`role.${role}`)}</p>
            </div>
          </div>
          <div className="mt-5 h-px bg-white/20" />
          <p className="mt-3 text-[10px] uppercase tracking-widest text-white/70">{t('app.name')}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p
            className={`px-3 pb-1.5 text-[10px] font-medium uppercase tracking-widest ${
              open ? 'max-lg:block' : 'max-lg:hidden'
            } lg:block`}
            style={{ color: 'var(--text-light)' }}
          >
            {t('sidebar.nav')}
          </p>
          {mainLinks.map(renderLink)}
          {accountLinks.length > 0 && (
            <>
              <p
                className={`px-3 pt-4 pb-1.5 text-[10px] font-medium uppercase tracking-widest ${
                  open ? 'max-lg:block' : 'max-lg:hidden'
                } lg:block`}
                style={{ color: 'var(--text-light)' }}
              >
                {t('sidebar.account')}
              </p>
              {accountLinks.map(renderLink)}
            </>
          )}
        </nav>

        <div className={`p-3 ${open ? 'max-lg:block' : 'max-lg:hidden'} lg:block`}>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/60 p-3">
            <div className="flex items-center gap-3">
              <div className="avatar w-10 h-10 rounded-full text-sm shrink-0">{initial}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{user?.first_name || user?.phone}</p>
                <p className="text-[11px] truncate" style={{ color: 'var(--text-light)' }}>{user?.phone}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={toggle}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors hover:bg-[var(--bg-secondary)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                {theme === 'dark' ? t('sidebar.light_mode') : t('sidebar.dark_mode')}
              </button>
              <button
                onClick={logout}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-transparent transition-colors hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]"
                style={{ color: 'var(--danger)' }}
              >
                <LogOut size={14} />
                {t('sidebar.logout')}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
