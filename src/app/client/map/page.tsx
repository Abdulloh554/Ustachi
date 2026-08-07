'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { masterAPI } from '@/lib/api'
import { SkeletonMap } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'

const MapWithNoSSR = dynamic(() => import('@/components/Map'), { ssr: false })

export default function ClientMapPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [masters, setMasters] = useState<any[]>([])

  useEffect(() => {
    masterAPI.list({ ordering: '-rating' }).then((res) => {
      setMasters(res.data.results || res.data)
      setLoading(false)
    })
  }, [])

  const markers = masters
    .filter((m: any) => m.user.location_lat && m.user.location_lng)
    .map((m: any) => ({
      lat: m.user.location_lat,
      lng: m.user.location_lng,
      title: m.user.first_name || m.user.phone,
      status: m.is_available ? 'active' : 'busy',
      address: m.professions?.map((p: any) => `${p.icon} ${p.name_uz}`).join(', ') || '',
      id: m.id,
    }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('client.masters_map')}</h1>

      {loading ? (
        <SkeletonMap />
      ) : (
        <>
          <div className="bg-surface rounded-xl p-4 border border-border mb-4">
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>{t('sidebar.masters')} ({markers.length})</span>
              </div>
            </div>
          </div>

          <div className="h-[600px] rounded-xl overflow-hidden border border-border">
            <MapWithNoSSR markers={markers} />
          </div>

          {markers.length === 0 && (
            <p className="text-text-secondary text-center py-8">
              {t('client.map_no_location')}
            </p>
          )}
        </>
      )}
    </div>
  )
}
