import Header from '@/components/Header'
import MailList from '@/components/MailList'
import TabView from '@/components/TabView'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
      <TabView />


      <MailList />


    </SafeAreaView>
  )
}
