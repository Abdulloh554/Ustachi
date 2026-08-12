'use client'

import { useTranslation } from 'react-i18next'

export default function ProfessionsPicker({
  professions,
  selected,
  onToggle,
}: {
  professions: any[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {professions.map((prof: any) => (
          <button
            key={prof.id}
            type="button"
            onClick={() => onToggle(prof.id)}
            aria-pressed={selected.includes(prof.id)}
            className={`pill text-sm py-2 ${selected.includes(prof.id) ? 'active' : ''}`}
          >
            {prof.icon} {prof.name_uz}
          </button>
        ))}
      </div>
      {professions.length === 0 && (
        <p className="caption">{t('common.loading')}</p>
      )}
    </div>
  )
}
