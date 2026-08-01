'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getStatusLabel } from '@/lib/utils'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MarkerData {
  lat: number
  lng: number
  title: string
  status?: string
  address?: string
  id?: number | string
}

export default function Map({ markers = [] }: { markers: MarkerData[] }) {
  const center: [number, number] =
    markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : [41.2995, 69.2401]

  return (
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
              {m.status && <p className="text-xs text-text-secondary capitalize">{getStatusLabel(m.status)}</p>}
              {m.address && <p className="text-xs text-text-secondary">{m.address}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
