'use client'

import { useTranslation } from 'react-i18next'
import { MapPin, Navigation, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

interface RouteOrder {
  id: string
  title: string
  status: string
  address?: string
  location_lat?: number
  location_lng?: number
}

interface OrderRouteListProps {
  orders: RouteOrder[]
  loading: boolean
  routeActive: boolean
  onRoute: (order: RouteOrder) => void
  onClearRoute: () => void
}

export default function OrderRouteList({
  orders,
  loading,
  routeActive,
  onRoute,
  onClearRoute,
}: OrderRouteListProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t('order.accepted')}</h2>
        {routeActive && (
          <button
            onClick={onClearRoute}
            className="flex items-center gap-1 text-xs font-medium hover:underline"
            style={{ color: 'var(--danger)' }}
          >
            <X size={14} /> {t('order.cancel_route')}
          </button>
        )}
      </div>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-xl w-full" />
          <Skeleton className="h-20 rounded-xl w-full" />
          <Skeleton className="h-20 rounded-xl w-full" />
        </div>
      ) : (
        <>
          {orders.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-light)' }}>{t('order.no_active')}</p>
          )}
          {orders.map((order) => (
            <div key={order.id} className="card rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{order.title}</h3>
                <span className="text-xs capitalize" style={{ color: 'var(--text-light)' }}>{order.status}</span>
              </div>
              {order.address && (
                <p className="text-xs flex items-center gap-1 mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={12} /> {order.address}
                </p>
              )}
              <button
                onClick={() => onRoute(order)}
                className="flex items-center gap-1 text-xs font-semibold hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                <Navigation size={12} /> {t('order.route')}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
