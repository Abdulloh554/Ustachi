'use client'

import { useTranslation } from 'react-i18next'
import { SkeletonPills } from '@/components/ui/Skeleton'

interface MasterFieldsProps {
  professions: any[]
  loading: boolean
  selectedIds: number[]
  bio: string
  experienceYears: number
  onChange: (field: string, value: any) => void
  onToggleProfession: (id: number) => void
}

export function MasterFields({
  professions,
  loading,
  selectedIds,
  bio,
  experienceYears,
  onChange,
  onToggleProfession,
}: MasterFieldsProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <label className="block text-sm font-semibold mb-2">{t('auth.choose_profession')}</label>
        {loading ? (
          <SkeletonPills />
        ) : (
          <div className="flex flex-wrap gap-2">
            {professions.map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => onToggleProfession(prof.id)}
                className={`pill text-sm ${selectedIds.includes(prof.id) ? 'active' : ''}`}
              >
                {prof.icon} {prof.name_uz}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('auth.about_self')}</label>
        <textarea
          value={bio}
          onChange={(e) => onChange('bio', e.target.value)}
          rows={3}
          className="input"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{t('auth.experience_years')}</label>
        <input
          type="number"
          value={experienceYears}
          onChange={(e) => onChange('experience_years', parseInt(e.target.value))}
          className="input"
        />
      </div>
    </>
  )
}
