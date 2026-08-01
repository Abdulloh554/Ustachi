'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import '@/lib/i18n'
import i18n from 'i18next'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()

  useEffect(() => {
    if (user?.language) {
      i18n.changeLanguage(user.language)
    }
  }, [user?.language])

  return <>{children}</>
}
