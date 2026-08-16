export type PanelKey = 'dashboard' | 'staff' | 'client' | 'admin'

const PANEL_PREFIXES: { key: PanelKey; prefix: string }[] = [
  { key: 'dashboard', prefix: '/dashboard' },
  { key: 'staff', prefix: '/staff' },
  { key: 'client', prefix: '/client' },
  { key: 'admin', prefix: '/admin' },
]

export function getActivePanel(pathname: string): PanelKey | null {
  for (const { key, prefix } of PANEL_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return key
  }
  return null
}
