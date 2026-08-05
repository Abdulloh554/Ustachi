'use client'

import { useTranslation } from 'react-i18next'
import { Sun, Moon, LogOut } from 'lucide-react'

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
        <div className="flex items-center gap-3">
          <div className="avatar w-10 h-10 rounded-full text-sm shrink-0">{initial}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user?.first_name || user?.phone}</p>
            <p className="text-[11px] truncate" style={{ color: 'var(--text-light)' }}>{user?.phone}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onToggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors hover:bg-[var(--bg-secondary)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? t('sidebar.light_mode') : t('sidebar.dark_mode')}
          </button>
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-transparent transition-colors hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]"
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={14} />
            {t('sidebar.logout')}
          </button>
        </div>
      </div>
    </div>
  )
}
