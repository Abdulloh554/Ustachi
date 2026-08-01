'use client'

import dynamic from 'next/dynamic'

const MasterMapContent = dynamic(() => import('./content'), { ssr: false })

export default function MasterMapPage() {
  return <MasterMapContent />
}
