import { Star, ArrowUpRight, Briefcase } from 'lucide-react'
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
      className="card card-hover group block rounded-xl p-6 relative"
    >
      <span className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-light)] transition-all duration-200 group-hover:bg-[var(--primary)] group-hover:text-[var(--on-primary)] group-hover:shadow-[var(--shadow-primary)]">
        <ArrowUpRight size={16} />
      </span>

      <div className="flex items-center gap-4 mb-4 pr-8">
        <div className="avatar w-14 h-14 rounded-xl text-xl shrink-0">
          {(master.user.first_name?.[0] || master.user.phone[0]).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate leading-snug">
            {master.user.first_name || master.user.phone}
          </h3>
          <div className="flex items-center gap-1 text-sm mt-1">
            <Star size={14} fill="currentColor" style={{ color: 'var(--primary)' }} />
            <span className="font-bold" style={{ color: 'var(--text)' }}>{master.rating.toFixed(1)}</span>
            <span className="caption" style={{ color: 'var(--text-light)' }}>({master.rating_count})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {master.professions.map((prof) => (
          <span key={prof.id} className="pill text-xs py-1 px-2.5 cursor-default">
            {prof.icon} {prof.name_uz}
          </span>
        ))}
      </div>

      {master.bio && (
        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {master.bio}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        {master.experience_years > 0 ? (
          <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-light)' }}>
            <Briefcase size={13} style={{ color: 'var(--primary)' }} /> {master.experience_years} yillik tajriba
          </span>
        ) : (
          <span />
        )}
        <span
          className={`text-xs font-semibold flex items-center gap-1.5 ${master.is_available ? '' : 'opacity-50'}`}
          style={{ color: master.is_available ? 'var(--success)' : 'var(--text-light)' }}
        >
          <span
            className={`w-2 h-2 rounded-full ${master.is_available ? '' : 'opacity-40'}`}
            style={{
              background: master.is_available ? 'var(--success)' : 'var(--text-light)',
              boxShadow: master.is_available ? '0 0 0 4px color-mix(in srgb, var(--success) 18%, transparent)' : 'none',
            }}
          />
          {master.is_available ? "Bo'sh" : 'Band'}
        </span>
      </div>
    </Link>
  )
}
