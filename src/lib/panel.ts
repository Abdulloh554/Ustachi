export type PanelKey = 'admin' | 'client' | 'master' | 'seller'

const PANEL_PREFIXES: { key: PanelKey; prefix: string }[] = [
  { key: 'admin', prefix: '/admin' },
  { key: 'client', prefix: '/client' },
  { key: 'master', prefix: '/master' },
  { key: 'seller', prefix: '/seller' },
]

export function getActivePanel(pathname: string): PanelKey | null {
  for (const { key, prefix } of PANEL_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return key
  }
  return null
}
