'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { useTranslation } from 'react-i18next'

export default function AdminMastersPage() {
  const { t } = useTranslation()
  const [masters, setMasters] = useState<any[]>([])

  useEffect(() => {
    adminAPI.masters().then((res) => setMasters(res.data.results || res.data))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{t('admin.all_masters')}</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>{t('table.name')}</th>
                <th>{t('table.phone')}</th>
                <th>{t('table.professions')}</th>
                <th>{t('table.rating')}</th>
                <th>{t('table.status')}</th>
                <th>{t('table.experience')}</th>
                <th>{t('table.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {masters.map((m: any) => (
                <tr key={m.id}>
                  <td>{m.user?.first_name || m.user?.phone}</td>
                  <td>{m.user?.phone}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {m.professions?.map((p: any) => (
                        <span key={p.id} className="pill text-xs py-0.5 px-2">{p.icon} {p.name_uz}</span>
                      ))}
                    </div>
                  </td>
                  <td>{m.rating.toFixed(1)} ({m.rating_count})</td>
                  <td>
                    <span className={`pill text-xs py-0.5 px-2 ${m.is_available ? 'active' : ''}`}
                      style={!m.is_available ? { background: 'var(--danger)', color: 'white' } : {}}>
                      {m.is_available ? t('status.available') : t('status.busy')}
                    </span>
                  </td>
                  <td>{m.experience_years} {t('master.experience_label')}</td>
                  <td>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      {Number(m.balance || 0).toLocaleString('ru-RU')} {t('order.price_label')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {masters.length === 0 && <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>{t('admin.no_masters')}</p>}
      </div>
    </div>
  )
}
