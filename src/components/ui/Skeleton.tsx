export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonCardList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <Skeleton className="h-3 w-1/3 rounded-lg mt-2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-lg shrink-0" />
          </div>
          <Skeleton className="h-3 w-full rounded-lg mb-2" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <Skeleton className="h-3 w-20 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTableRows({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c}>
              <Skeleton className={`h-4 rounded-lg ${c === 0 ? 'w-2/3' : 'w-full'}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function SkeletonPills({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-28 rounded-full" />
      ))}
    </div>
  )
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full rounded-lg mb-2" />
          <Skeleton className="h-3 w-2/3 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonMap() {
  return (
    <div className="h-[600px] rounded-xl overflow-hidden border border-[var(--border)]">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat rounded-xl">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20 rounded-lg" />
                <Skeleton className="h-5 w-12 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-6 space-y-4">
        <Skeleton className="h-5 w-40 rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-[46%]">
        <div className="h-full flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <Skeleton className="h-5 w-24 rounded-lg" />
          </div>
          <div className="max-w-sm space-y-4">
            <Skeleton className="h-9 w-full rounded-xl" />
            <Skeleton className="h-9 w-3/4 rounded-xl" />
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-2/3 rounded-lg" />
            <Skeleton className="h-3 w-5/6 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-40 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-5">
          <Skeleton className="h-8 w-56 mx-auto rounded-lg lg:hidden" />
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
          <div className="card rounded-2xl p-8 space-y-4">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
