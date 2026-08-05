'use client'

import { useTranslation } from 'react-i18next'

export default function ProfessionsPicker({
  professions,
  selected,
  onToggle,
}: {
  professions: any[]
  selected: number[]
  onToggle: (id: number) => void
}) {
  const { t } = useTranslation()

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{t('master.your_professions')}</label>
      <div className="flex flex-wrap gap-2">
        {professions.map((prof: any) => (
          <button
            key={prof.id}
            type="button"
            onClick={() => onToggle(prof.id)}
            className={`pill text-sm ${selected.includes(prof.id) ? 'active' : ''}`}
          >
            {prof.icon} {prof.name_uz}
          </button>
        ))}
      </div>
    </div>
  )
}
