'use client'

import { useTranslation } from 'react-i18next'
import { ShieldCheck, Star } from 'lucide-react'
import { AuthPageSkeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/authStore'
import AuthShell from '@/components/auth/AuthShell'
import LoginForm from '@/components/auth/LoginForm'

const brandPoints = [
  { icon: ShieldCheck, textKey: 'landing.feature_4_title' },
  { icon: Star, textKey: 'landing.feature_2_title' },
]

export default function LoginPage() {
  const { isLoading } = useAuthStore()
  const { t } = useTranslation()

  if (isLoading) return <AuthPageSkeleton />

  return (
    <AuthShell
      title={t('auth.login_title')}
      subtitle={t('auth.welcome_back')}
      brandPoints={brandPoints}
    >
      <LoginForm />
    </AuthShell>
  )
}
