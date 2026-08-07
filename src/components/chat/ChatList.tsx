'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { chatAPI } from '@/lib/api'
import { MessageSquare, Inbox } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'

interface ConversationData {
  id: number
  order_id?: number
  order_title?: string
  other_user_id?: number
  other_user_name?: string
  other_user_role?: string
  last_message?: string | null
  last_message_at?: string | null
  unread_count?: number
}

export default function ChatList() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [items, setItems] = useState<ConversationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    chatAPI
      .listConversations()
      .then((res) => {
        if (!cancelled) setItems(res.data.results || res.data || [])
      })
      .catch(() => {
        if (!cancelled) setError(t('chat.load_error'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [t])

  return (
    <div className="space-y-3">
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'color-mix(in srgb, var(--danger) 12%, transparent)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-3 w-2/3 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Inbox size={24} />}
          title={t('chat.no_conversations')}
        />
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            href={`/chat/${item.id}`}
            className="card card-hover p-4 flex items-center gap-3"
          >
            <span className="avatar w-11 h-11 rounded-full text-sm shrink-0">
              {item.other_user_name?.[0]?.toUpperCase() || <MessageSquare size={18} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold truncate">
                  {item.other_user_name || `User ${item.other_user_id ?? ''}`}
                </p>
                <span className="text-[11px] shrink-0" style={{ color: 'var(--text-light)' }}>
                  {item.last_message_at
                    ? new Date(item.last_message_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </span>
              </div>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.order_title ? `${item.order_title}: ` : ''}
                {item.last_message || t('chat.no_messages')}
              </p>
            </div>
            {item.unread_count ? (
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0"
                style={{ background: 'var(--primary)', color: '#fff' }}
              >
                {item.unread_count}
              </span>
            ) : null}
          </Link>
        ))
      )}
    </div>
  )
}
