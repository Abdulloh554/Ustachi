'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

interface Props {
  origin: [number, number]
  destination: [number, number]
  onClear: () => void
}

export default function RoutingControl({ origin, destination, onClear }: Props) {
  const map = useMap()

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origin[0], origin[1]),
        L.latLng(destination[0], destination[1]),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{
          color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8B3103',
          weight: 4,
          opacity: 0.8,
        }],
        extendToWaypoints: false,
        missingRouteTolerance: 10,
      },
    }).addTo(map)

    return () => {
      map.removeControl(routingControl)
    }
  }, [map, origin, destination])

  return null
}
