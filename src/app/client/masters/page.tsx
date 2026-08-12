'use client'

import { useEffect, useState } from 'react'
import { masterAPI, professionAPI } from '@/lib/api'
import MasterCard from '@/components/MasterCard'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonCardGrid, SkeletonPills } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { SearchX } from 'lucide-react'

export default function ClientMastersPage() {
  const { t } = useTranslation()
  const [masters, setMasters] = useState<any[]>([])
  const [professions, setProfessions] = useState<any[]>([])
  const [filterProfession, setFilterProfession] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMasters()
    professionAPI.list().then((res) => setProfessions(res.data.results || res.data)).catch(() => setProfessions([]))
  }, [filterProfession])

  const loadMasters = async () => {
    setLoading(true)
    try {
      const params: any = { ordering: '-rating' }
      if (filterProfession) params.professions = filterProfession
      const res = await masterAPI.list(params)
      setMasters(res.data.results || res.data)
    } catch {
      setMasters([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight">{t('master.title')}</h1>
        <p className="caption mt-1">{t('client.masters_subtitle')}</p>
      </div>

      {loading ? (
        <>
          <div className="mb-6">
            <SkeletonPills count={7} />
          </div>
          <SkeletonCardGrid count={6} />
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterProfession('')}
              className={`pill text-sm ${!filterProfession ? 'active' : ''}`}
            >
              {t('client.all_masters')}
            </button>
            {professions.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setFilterProfession(String(p.id))}
                className={`pill text-sm ${filterProfession === String(p.id) ? 'active' : ''}`}
              >
                {p.icon} {p.name_uz}
              </button>
            ))}
          </div>

          {masters.length === 0 ? (
            <EmptyState
              icon={<SearchX size={24} />}
              title={t('client.no_masters')}
              description={t('client.no_masters_desc')}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {masters.map((master: any, index: number) => (
                <div key={master.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                  <MasterCard master={master} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
