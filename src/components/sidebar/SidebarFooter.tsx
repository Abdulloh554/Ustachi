'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, LogOut, Send, User } from 'lucide-react'
import { BOT_URL } from '@/lib/constants'

export default function SidebarFooter({
  open,
  user,
  theme,
  onToggleTheme,
  onLogout,
}: {
  open: boolean
  user: any
  theme: string
  onToggleTheme: () => void
  onLogout: () => void
}) {
  const { t } = useTranslation()
  const initial = (user?.first_name?.[0] || user?.phone?.[0] || '?').toUpperCase()

  return (
    <div className={`p-3 ${open ? 'max-lg:block' : 'max-lg:hidden'} lg:block`}>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/60 p-3">
        <Link href="/profile" className="flex items-center gap-3 group">
          <div className="avatar w-10 h-10 rounded-full text-sm shrink-0">{initial}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate group-hover:text-[var(--primary-active)] transition-colors" style={{ color: 'var(--text)' }}>
              {user?.first_name || user?.phone}
            </p>
            <p className="caption text-[11px] truncate flex items-center gap-1">
              <User size={10} /> {user?.phone}
            </p>
          </div>
        </Link>
        <div className="flex gap-2 mt-3">
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--bg-secondary)] hover:border-[var(--text-light)] hover:shadow-[var(--shadow-sm)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Send size={14} />
            Telegram
          </a>
          <button
            onClick={onToggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--bg-secondary)] hover:border-[var(--text-light)] hover:shadow-[var(--shadow-sm)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border border-transparent transition-all duration-200 hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]"
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
