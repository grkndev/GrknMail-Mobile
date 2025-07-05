import Header from '@/components/Header'
import MailList from '@/components/MailList'
import NewMailButton from '@/components/NewMailButton'
import TabView from '@/components/TabView'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
      <TabView />
      <MailList data={Array.from({ length: 50 }).fill(dummyData)} />
      <NewMailButton />
    </SafeAreaView>
  )
}

const dummyData = {
  id: 1,
  image: 'https://github.com/grkndev.png',
  author: 'Grkndev',
  subject: 'Hello, world!',
  body: 'This is a test email',
  sentAt: new Date(),
  isRead: false,
}
