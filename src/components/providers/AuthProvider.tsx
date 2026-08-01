'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'

const publicPaths = ['/', '/auth/login', '/auth/register', '/masters']

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadProfile, user, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (isLoading) return
    if (user) return
    if (!publicPaths.includes(pathname)) {
      router.push('/auth/login')
    }
  }, [user, isLoading, pathname, router])

  return <>{children}</>
}
