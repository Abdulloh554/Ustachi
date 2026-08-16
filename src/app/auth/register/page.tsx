'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { AuthPageSkeleton } from '@/components/ui/Skeleton'
import AuthShell from '@/components/auth/AuthShell'
import RegisterRoleStep from '@/components/auth/RegisterRoleStep'
import RegisterDetailsForm, { RegisterFormData } from '@/components/auth/RegisterDetailsForm'

const roleRoutes: Record<string, string> = {
  client: '/client',
  owner: '/dashboard',
}

const brandPoints = [
  { icon: Check, textKey: 'landing.feature_1_title' },
  { icon: Check, textKey: 'landing.feature_2_title' },
  { icon: Check, textKey: 'landing.feature_3_title' },
]

const initialForm: RegisterFormData = {
  phone: '',
  password: '',
  first_name: '',
  last_name: '',
  role: 'client',
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<RegisterFormData>(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, isLoading } = useAuthStore()
  const { t } = useTranslation()
  const router = useRouter()

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await register({
        phone: form.phone,
        password: form.password,
        username: form.phone,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
      })
      router.push(roleRoutes[user.role] || '/client')
    } catch (err: any) {
      const data = err.response?.data
      if (typeof data === 'string') {
        setError(data)
      } else if (data?.detail) {
        setError(data.detail)
      } else if (data) {
        const msgs = Object.values(data).flat().join('. ')
        setError(msgs || t('auth.error_occurred'))
      } else {
        setError(t('auth.error_occurred'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <AuthPageSkeleton />

  return (
    <AuthShell
      title={t('auth.register_title')}
      subtitle={t('auth.register_subtitle')}
      brandPoints={brandPoints}
      maxWidth="max-w-lg"
    >
      {step === 1 && (
        <RegisterRoleStep
          onSelect={(role) => {
            setForm((prev) => ({ ...prev, role }))
            setStep(2)
          }}
        />
      )}

      {step === 2 && (
        <RegisterDetailsForm
          data={form}
          submitting={submitting}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onBack={() => setStep(1)}
        />
      )}
    </AuthShell>
  )
}
