import Header from '@/components/Header'
import MailList from '@/components/MailList'
import NewMailButton from '@/components/NewMailButton'
import TabView from '@/components/TabView'
import { dummyData } from '@/lib/utils'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
      <TabView />
      <MailList data={dummyData} />
      <NewMailButton />
    </SafeAreaView>
  )
}