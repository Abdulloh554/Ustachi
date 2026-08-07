export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatMoney(value: string | number): string {
  const num = Number(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString('ru-RU')
}

import i18n from 'i18next'

export function getStatusLabel(status: string): string {
  const key = `status.${status}`
  const translated = i18n.t(key)
  return translated !== key ? translated : status.replace('_', ' ')
}
