import { Star, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Master {
  id: number
  user: {
    id: number
    phone: string
    first_name: string
    last_name: string
    avatar: string | null
  }
  professions: Array<{ id: number; name_uz: string; icon: string }>
  bio: string
  rating: number
  rating_count: number
  experience_years: number
  is_available: boolean
}

export default function MasterCard({ master }: { master: Master }) {
  return (
    <Link
      href={`/masters/${master.id}`}
      className="card card-hover block rounded-2xl p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="avatar w-14 h-14 rounded-2xl text-xl shrink-0">
          {(master.user.first_name?.[0] || master.user.phone[0]).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold truncate">{master.user.first_name || master.user.phone}</h3>
          <div className="flex items-center gap-1 text-sm mt-1">
            <Star size={14} fill="currentColor" style={{ color: 'var(--warning)' }} />
            <span className="font-bold" style={{ color: 'var(--text)' }}>{master.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--text-light)' }}>({master.rating_count})</span>
          </div>
        </div>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${master.is_available ? '' : 'opacity-40'}`}
          style={{ background: master.is_available ? 'var(--success)' : 'var(--text-light)', boxShadow: master.is_available ? '0 0 0 4px color-mix(in srgb, var(--success) 20%, transparent)' : 'none' }} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {master.professions.map((prof) => (
          <span key={prof.id} className="pill text-xs py-1 px-2.5 cursor-default">
            {prof.icon} {prof.name_uz}
          </span>
        ))}
      </div>

      {master.bio && (
        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{master.bio}</p>
      )}

      {master.experience_years > 0 && (
        <p className="text-xs mt-3 flex items-center gap-1 font-medium" style={{ color: 'var(--text-light)' }}>
          <MapPin size={12} /> {master.experience_years} yillik tajriba
        </p>
      )}
    </Link>
  )
}
