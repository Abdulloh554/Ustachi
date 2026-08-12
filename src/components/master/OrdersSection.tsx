'use client'

import { LucideIcon } from 'lucide-react'
import OrderCard from '@/components/OrderCard'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonCardList } from '@/components/ui/Skeleton'

interface OrdersSectionProps {
  orders: any[]
  loading: boolean
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
  acceptPrice?: number
  acceptDisabled?: boolean
  emptyAction?: React.ReactNode
  onAccept?: (id: string) => void
  onStatusChange?: (id: string, status: string) => void
  onCancel?: (id: string) => void
}

export default function OrdersSection({
  orders,
  loading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  acceptPrice,
  acceptDisabled,
  emptyAction,
  onAccept,
  onStatusChange,
  onCancel,
}: OrdersSectionProps) {
  const EmptyIcon = emptyIcon

  return (
    <div className="space-y-4">
      {loading ? (
        <SkeletonCardList count={3} />
      ) : (
        <>
          {orders.length === 0 && (
            <EmptyState icon={<EmptyIcon size={24} />} title={emptyTitle} description={emptyDescription} action={emptyAction} />
          )}
          {orders.map((order: any, index) => (
            <div key={order.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
              <OrderCard
                order={order}
                showActions
                acceptPrice={acceptPrice}
                acceptDisabled={acceptDisabled}
                onAccept={onAccept ? () => onAccept(order.id) : undefined}
                onStatusChange={
                  onStatusChange
                    ? (status) => onStatusChange(order.id, status)
                    : undefined
                }
                onCancel={onCancel ? () => onCancel(order.id) : undefined}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
