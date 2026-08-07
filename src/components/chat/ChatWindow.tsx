'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { chatAPI, chatWebSocketUrl } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Send, ArrowLeft, Loader2 } from 'lucide-react'

interface MessageData {
  id: number
  sender: number
  sender_name?: string
  sender_role?: string
  text: string
  created_at: string
}

export default function ChatWindow({
  conversationId,
  orderTitle,
}: {
  conversationId: number
  orderTitle?: string
}) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<MessageData[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    chatAPI
      .messages(conversationId)
      .then((res) => {
        if (cancelled) return
        setMessages(res.data.results || res.data || [])
      })
      .catch(() => {
        if (!cancelled) setError(t('chat.load_error'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    const socket = new WebSocket(chatWebSocketUrl(conversationId))
    wsRef.current = socket

    socket.onopen = () => {
      if (!cancelled) setConnected(true)
    }
    socket.onclose = () => {
      if (!cancelled) setConnected(false)
    }
    socket.onerror = () => {
      if (!cancelled) setConnected(false)
    }
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.message.id)) return prev
            return [...prev, data.message]
          })
        }
      } catch {}
    }

    return () => {
      cancelled = true
      socket.close()
      wsRef.current = null
    }
  }, [conversationId, t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = input.trim()
    if (!text || !wsRef.current) return
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', text }))
      setInput('')
    } else {
      setError(t('chat.not_connected'))
    }
  }

  const isMine = (message: MessageData) => user?.id === message.sender

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/chat"
          className="btn btn-ghost p-2"
          aria-label={t('common.back')}
        >
          <ArrowLeft size={18} />
        </Link>
        <span className="avatar w-10 h-10 rounded-full text-sm shrink-0">
          {orderTitle?.[0]?.toUpperCase() || <MessageSquare size={18} />}
        </span>
        <div className="min-w-0">
          <p className="font-semibold truncate">{orderTitle || t('chat.title')}</p>
          <p
            className={`text-xs flex items-center gap-1.5 ${connected ? 'text-[var(--success)]' : 'text-[var(--text-light)]'}`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: connected ? 'var(--success)' : 'var(--text-light)' }}
            />
            {connected ? t('chat.online') : t('chat.offline')}
          </p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto rounded-2xl p-4 space-y-3"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full text-[var(--text-light)]">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-[var(--text-light)]">
            <MessageSquare size={28} />
            <p className="text-sm">{t('chat.empty')}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isMine(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine(message)
                    ? 'rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={
                  isMine(message)
                    ? { background: 'var(--primary)', color: '#fff' }
                    : { background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
                }
              >
                {!isMine(message) && message.sender_name && (
                  <p className="text-[11px] font-semibold mb-0.5 opacity-70">
                    {message.sender_name}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                <p
                  className="text-[10px] mt-1"
                  style={{ color: isMine(message) ? 'rgba(255,255,255,0.75)' : 'var(--text-light)' }}
                >
                  {formatDate(message.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder={t('chat.placeholder')}
          className="input flex-1 min-w-0"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || !connected}
          className="btn btn-primary px-4"
          aria-label={t('chat.send')}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
