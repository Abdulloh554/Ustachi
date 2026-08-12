'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { adminAPI } from '@/lib/api'
import { SkeletonMap } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'

const MapWithNoSSR = dynamic(() => import('@/components/Map'), { ssr: false })

export default function AdminMapPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ orders: any[]; masters: any[] }>({ orders: [], masters: [] })

  useEffect(() => {
    adminAPI.map()
      .then((res) => {
        setData(res.data)
      })
      .catch(() => {
        setData({ orders: [], masters: [] })
      })
      .finally(() => setLoading(false))
  }, [])

  const orderMarkers = data.orders.map((o: any) => ({
    lat: o.location_lat,
    lng: o.location_lng,
    title: o.title,
    status: o.status,
    address: o.address,
    id: o.id,
  }))

  const masterMarkers = data.masters.map((m: any) => ({
    lat: m.user__location_lat,
    lng: m.user__location_lng,
    title: m.user__phone,
    status: m.is_available ? 'active' : 'busy',
    id: m.user__phone,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('admin.map_title')}</h1>
      {loading ? (
        <SkeletonMap />
      ) : (
        <>
          <div className="bg-surface rounded-xl p-4 border border-border mb-4">
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--primary)' }} />
                <span>{t('admin.map_orders')} ({data.orders.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>{t('admin.map_masters')} ({data.masters.length})</span>
              </div>
            </div>
          </div>
          <div className="h-[600px] rounded-xl overflow-hidden border border-border">
            <MapWithNoSSR markers={[...orderMarkers, ...masterMarkers]} />
          </div>
        </>
      )}
    </div>
  )
}
