'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/DashboardLayout'
import ChatWindow from '@/components/chat/ChatWindow'
import { chatAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function ConversationPage() {
  const params = useParams<{ id: string }>()
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const conversationId = Number(params?.id)

  useEffect(() => {
    if (!conversationId) return
    let cancelled = false
    setLoading(true)
    chatAPI
      .listConversations()
      .then((res) => {
        if (cancelled) return
        const list = res.data.results || res.data || []
        const found = list.find((c: any) => c.id === conversationId)
        setTitle(found?.order_title || '')
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
  }, [conversationId, t])

  if (!conversationId) return null

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16 text-[var(--text-light)]">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : error ? (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        ) : (
          <ChatWindow conversationId={conversationId} orderTitle={title} />
        )}
      </div>
    </DashboardLayout>
  )
}
