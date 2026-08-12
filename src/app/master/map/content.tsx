'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { orderAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { SkeletonMap } from '@/components/ui/Skeleton'
import OrderRouteList from '@/components/map/OrderRouteList'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import  'leaflet/dist/leaflet.css'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const RoutingControl = dynamic(() => import('@/components/RoutingControl'), { ssr: false })

const greenIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function MasterMapContent() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [routeDest, setRouteDest] = useState<[number, number] | null>(null)
  const [browserLoc, setBrowserLoc] = useState<[number, number] | null>(null)

  useEffect(() => {
    orderAPI.list()
      .then((res) => {
        const all = res.data.results || res.data
        setOrders(all.filter((o: any) => ['accepted', 'coming', 'in_progress'].includes(o.status)))
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setBrowserLoc([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      )
    }
  }, [])

  const origin: [number, number] | null =
    (user?.location_lat && user?.location_lng
      ? [user.location_lat, user.location_lng]
      : browserLoc) || null

  const markers = orders
    .filter((o) => o.location_lat && o.location_lng)
    .map((o) => ({
      lat: o.location_lat,
      lng: o.location_lng,
      title: o.title,
      status: o.status,
      address: o.address,
      id: o.id,
    }))

  const center: [number, number] =
    markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : [41.2995, 69.2401]

  const handleRoute = (order: any) => {
    if (order.location_lat && order.location_lng) {
      setRouteDest([order.location_lat, order.location_lng])
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('sidebar.map')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {loading ? (
            <SkeletonMap />
          ) : (
            <div className="h-[600px] rounded-xl overflow-hidden border border-border">
              <MapContainer
                center={center}
                zoom={12}
                className="w-full h-full"
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((m, i) => (
                  <Marker
                    key={`${m.id || i}`}
                    position={[m.lat, m.lng]}
                    icon={defaultIcon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{m.title}</p>
                        {m.status && <p className="text-xs text-text-secondary capitalize">{m.status}</p>}
                        {m.address && <p className="text-xs text-text-secondary">{m.address}</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {browserLoc && (
                  <Marker position={browserLoc} icon={greenIcon}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{t('order.my_location')}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                {routeDest && origin && (
                  <RoutingControl origin={origin} destination={routeDest} onClear={() => setRouteDest(null)} />
                )}
              </MapContainer>
            </div>
          )}
        </div>

        <OrderRouteList
          orders={orders}
          loading={loading}
          routeActive={!!routeDest}
          onRoute={handleRoute}
          onClearRoute={() => setRouteDest(null)}
        />
      </div>
    </div>
  )
}
