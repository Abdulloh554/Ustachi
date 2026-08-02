'use client'

import Sidebar from '@/components/Sidebar'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="min-h-screen animate-fade-in sm:ml-16 lg:ml-[280px] pb-20 sm:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  )
}
