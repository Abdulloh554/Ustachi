'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { chatAPI, chatWebSocketUrl } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Send, ArrowLeft, Loader2, CornerUpLeft, Pencil, Trash2, X } from 'lucide-react'

interface MessageData {
  id: string
  sender: string
  sender_name?: string
  sender_role?: string
  text: string
  edited?: boolean
  reply_to?: { id: string; text: string } | string | null
  created_at: string
}

export default function ChatWindow({
  conversationId,
  orderTitle,
}: {
  conversationId: string
  orderTitle?: string
}) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<MessageData[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<MessageData | null>(null)
  const [editing, setEditing] = useState<MessageData | null>(null)
  const [busy, setBusy] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    chatAPI
      .messages(conversationId)
      .then((res) => {
        if (cancelled) return
        setMessages(res.data.results || res.data || [])
      })
      .catch((err: any) => {
        if (cancelled) return
        const data = err.response?.data
        setError(typeof data === 'string' ? data : data?.error || t('chat.load_error'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    let socket: WebSocket | null = null

    chatWebSocketUrl(conversationId).then((url) => {
      if (cancelled) return
      socket = new WebSocket(url)
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
          } else if (data.type === 'message_edited') {
            setMessages((prev) => prev.map((m) => (m.id === data.message.id ? { ...m, ...data.message } : m)))
          } else if (data.type === 'message_deleted') {
            setMessages((prev) => prev.filter((m) => m.id !== data.id))
          }
        } catch {}
      }
    })

    return () => {
      cancelled = true
      if (socket) {
        socket.close()
        wsRef.current = null
      }
    }
  }, [conversationId, t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (editing) {
      setInput(editing.text)
      inputRef.current?.focus()
    } else if (!replyingTo) {
      setInput('')
    }
  }, [editing])

  const submit = async () => {
    const text = input.trim()
    if (!text || busy) return

    if (editing) {
      setBusy(true)
      setError('')
      try {
        const res = await chatAPI.edit(conversationId, editing.id, text)
        setMessages((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...res.data } : m)))
        setEditing(null)
        setInput('')
      } catch (err: any) {
        const data = err.response?.data
        setError(typeof data === 'string' ? data : data?.error || t('auth.error_occurred'))
      } finally {
        setBusy(false)
      }
      return
    }

    if (replyingTo && !editing) {
      setBusy(true)
      setError('')
      try {
        const res = await chatAPI.send(conversationId, text, replyingTo.id)
        setMessages((prev) => (prev.some((m) => m.id === res.data.id) ? prev : [...prev, res.data]))
        setInput('')
        setReplyingTo(null)
      } catch (err: any) {
        const data = err.response?.data
        setError(typeof data === 'string' ? data : data?.error || t('auth.error_occurred'))
      } finally {
        setBusy(false)
      }
      return
    }

    if (!wsRef.current) {
      setError(t('chat.not_connected'))
      return
    }
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', text }))
      setInput('')
    } else {
      setError(t('chat.not_connected'))
    }
  }

  const startReply = (message: MessageData) => {
    setReplyingTo(message)
    setEditing(null)
    setSelectedId(null)
    inputRef.current?.focus()
  }

  const startEdit = (message: MessageData) => {
    setEditing(message)
    setReplyingTo(null)
    setSelectedId(null)
  }

  const removeMessage = async (message: MessageData) => {
    if (!window.confirm(t('chat.delete_confirm'))) return
    setBusy(true)
    setError('')
    try {
      await chatAPI.del(conversationId, message.id)
      setMessages((prev) => prev.filter((m) => m.id !== message.id))
      setSelectedId(null)
    } catch (err: any) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.error || t('auth.error_occurred'))
    } finally {
      setBusy(false)
    }
  }

  const isMine = (message: MessageData) => user?.id === message.sender

  const replyTextOf = (message: MessageData) =>
    typeof message.reply_to === 'object' && message.reply_to ? message.reply_to.text : null

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
        className="flex-1 overflow-y-auto rounded-2xl p-4 pt-12 space-y-3"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={() => setSelectedId(null)}
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
          messages.map((message) => {
            const mine = isMine(message)
            const selected = selectedId === message.id
            const replyText = replyTextOf(message)
            return (
              <div
                key={message.id}
                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative max-w-[78%]">
                  {selected && (
                    <div
                      className={`absolute -top-10 flex items-center gap-1 rounded-xl p-1 z-10 ${
                        mine ? 'right-0' : 'left-0'
                      }`}
                      style={{ background: 'var(--surface)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => startReply(message)}
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--bg-secondary)]"
                        title={t('chat.reply')}
                      >
                        <CornerUpLeft size={14} /> {t('chat.reply')}
                      </button>
                      {mine && (
                        <>
                          <button
                            onClick={() => startEdit(message)}
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--bg-secondary)]"
                            title={t('chat.edit')}
                          >
                            <Pencil size={14} /> {t('chat.edit')}
                          </button>
                          <button
                            onClick={() => removeMessage(message)}
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--bg-secondary)]"
                            style={{ color: 'var(--danger)' }}
                            title={t('chat.delete')}
                          >
                            <Trash2 size={14} /> {t('chat.delete')}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed cursor-pointer ${
                      mine ? 'rounded-br-md' : 'rounded-bl-md'
                    }`}
                    style={
                      mine
                        ? { background: 'var(--primary)', color: '#fff' }
                        : { background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
                    }
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedId(selected ? null : message.id)
                    }}
                  >
                    {!mine && message.sender_name && (
                      <p className="text-[11px] font-semibold mb-0.5 opacity-70">
                        {message.sender_name}
                      </p>
                    )}
                    {replyText && (
                      <div
                        className="mb-1.5 rounded-lg px-2 py-1 text-xs opacity-80 border-l-2"
                        style={
                          mine
                            ? { background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.6)' }
                            : { background: 'var(--bg-secondary)', borderColor: 'var(--primary)' }
                        }
                      >
                        <p className="line-clamp-2 whitespace-pre-wrap break-words">{replyText}</p>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <p
                      className="text-[10px] mt-1"
                      style={{ color: mine ? 'rgba(255,255,255,0.75)' : 'var(--text-light)' }}
                    >
                      {formatDate(message.created_at)}
                      {message.edited && (
                        <span className="ml-1 italic opacity-80">{t('chat.edited')}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}

      {(replyingTo || editing) && (
        <div
          className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {editing ? (
            <Pencil size={15} className="shrink-0" style={{ color: 'var(--text-light)' }} />
          ) : (
            <CornerUpLeft size={15} className="shrink-0" style={{ color: 'var(--text-light)' }} />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">
              {editing ? t('chat.editing_message') : t('chat.replying_to')}
            </p>
            <p className="text-xs truncate opacity-70">{(editing || replyingTo)?.text}</p>
          </div>
          <button
            onClick={() => {
              setReplyingTo(null)
              setEditing(null)
              setInput('')
            }}
            className="p-1 rounded-lg hover:bg-[var(--surface)]"
            aria-label={t('common.close')}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={t('chat.placeholder')}
          className="input flex-1 min-w-0"
        />
        <button
          onClick={submit}
          disabled={!input.trim() || busy}
          className="btn btn-primary px-4"
          aria-label={t('chat.send')}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
