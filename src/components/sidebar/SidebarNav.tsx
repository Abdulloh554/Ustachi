'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { LucideIcon } from 'lucide-react'

export interface SidebarLink {
  href: string
  labelKey: string
  icon: LucideIcon
  badge?: number
}

export default function SidebarNav({
  links,
  open,
  badges = {},
}: {
  links: SidebarLink[]
  open: boolean
  badges?: Record<string, number>
}) {
  const pathname = usePathname()
  const { t } = useTranslation()

  const isAccount = (href: string) => href.includes('/profile') || href.includes('/settings')
  const mainLinks = links.filter((l) => !isAccount(l.href))
  const accountLinks = links.filter((l) => isAccount(l.href))

  const renderLink = (link: SidebarLink, index: number) => {
    const Icon = link.icon
    const isActive = pathname === link.href
    const expanded = `${open ? 'max-lg:block' : 'max-lg:hidden'} lg:block`
    const badge = badges[link.href]

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
        {badge && badge > 0 && (
          <span
            className={`ml-auto text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-white bg-[var(--primary)] ${expanded}`}
          >
            {badge}
          </span>
        )}
      </Link>
    )
  }

  const sectionLabel = (label: string) => (
    <p
      className={`px-3 pb-1.5 text-[10px] font-medium uppercase tracking-widest ${
        open ? 'max-lg:block' : 'max-lg:hidden'
      } lg:block`}
      style={{ color: 'var(--text-light)' }}
    >
      {label}
    </p>
  )

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {sectionLabel(t('sidebar.nav'))}
      {mainLinks.map(renderLink)}
      {accountLinks.length > 0 && (
        <>
          {sectionLabel(t('sidebar.account'))}
          {accountLinks.map(renderLink)}
        </>
      )}
    </nav>
  )
}
