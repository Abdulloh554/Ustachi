'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'

const publicPaths = ['/', '/auth/login', '/auth/register', '/masters']

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadProfile, isLoading, user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (isLoading) return
    if (!user && !publicPaths.includes(pathname)) {
      router.push('/auth/login')
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  return <>{children}</>
}
