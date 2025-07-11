import Header from '@/components/Header'
import MailList from '@/components/MailList'
import NewMailButton from '@/components/NewMailButton'
import TabView from '@/components/TabView'
import { useAuth } from '@/context/auth'
import { dummyData } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  const { fetchWithAuth } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => fetchWithAuth('/api/protected/inbox', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
  })
  console.log(data)
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
      <TabView />
      <MailList data={dummyData} />
      <NewMailButton />
    </SafeAreaView>
  )
}