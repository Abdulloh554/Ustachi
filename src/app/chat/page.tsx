'use client'

import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/DashboardLayout'
import ChatList from '@/components/chat/ChatList'

export default function ChatPage() {
  const { t } = useTranslation()
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">{t('sidebar.chat')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('chat.subtitle')}
        </p>
      </div>
      <ChatList />
    </DashboardLayout>
  )
}
