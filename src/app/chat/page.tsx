'use client'

import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/DashboardLayout'
import ChatList from '@/components/chat/ChatList'

export default function ChatPage() {
  const { t } = useTranslation()
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight">{t('sidebar.chat')}</h1>
        <p className="caption mt-1">{t('chat.subtitle')}</p>
      </div>
      <ChatList />
    </DashboardLayout>
  )
}
