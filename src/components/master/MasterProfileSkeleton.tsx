'use client'

import { Skeleton } from '@/components/ui/Skeleton'

export default function MasterProfileSkeleton() {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-5">
            <Skeleton className="w-20 h-20 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-28 rounded-lg" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-20 w-44 rounded-xl lg:ml-auto" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-3">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-full" />
              ))}
            </div>
          </div>
          <div className="card p-6 space-y-4">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-11 w-40 rounded-xl" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6 space-y-3">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-6 w-28 rounded-lg" />
          </div>
          <div className="card p-6">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
