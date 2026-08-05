'use client'

import { Skeleton } from '@/components/ui/Skeleton'

export default function MasterProfileSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <Skeleton className="h-7 w-48 rounded-lg" />
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-9 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-full" />
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
    </div>
  )
}
