'use client'

import { useEffect, useState } from 'react'
import { masterAPI, professionAPI } from '@/lib/api'
import MasterCard from '@/components/MasterCard'
import { useTranslation } from 'react-i18next'

export default function ClientMastersPage() {
  const { t } = useTranslation()
  const [masters, setMasters] = useState<any[]>([])
  const [professions, setProfessions] = useState<any[]>([])
  const [filterProfession, setFilterProfession] = useState('')

  useEffect(() => {
    loadMasters()
    professionAPI.list().then((res) => setProfessions(res.data.results || res.data))
  }, [filterProfession])

  const loadMasters = async () => {
    const params: any = { ordering: '-rating' }
    if (filterProfession) params.professions = filterProfession
    const res = await masterAPI.list(params)
    setMasters(res.data.results || res.data)
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{t('master.title')}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterProfession('')}
          className={`pill rounded-full text-sm ${!filterProfession ? 'active' : ''}`}
        >
          {t('client.all_masters')}
        </button>
        {professions.map((p: any) => (
          <button
            key={p.id}
            onClick={() => setFilterProfession(String(p.id))}
            className={`pill rounded-full text-sm ${filterProfession === String(p.id) ? 'active' : ''}`}
          >
            {p.icon} {p.name_uz}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {masters.map((master: any) => (
          <MasterCard key={master.id} master={master} />
        ))}
        {masters.length === 0 && (
          <p className="col-span-full text-center py-12 text-sm" style={{ color: 'var(--text-light)' }}>{t('client.no_masters')}</p>
        )}
      </div>
    </div>
  )
}
