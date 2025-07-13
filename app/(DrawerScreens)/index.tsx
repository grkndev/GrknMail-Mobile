import Header from '@/components/Header'
import MailList from '@/components/MailList'
import NewMailButton from '@/components/NewMailButton'
import TabView from '@/components/TabView'
import { useAuth } from '@/context/auth'
import { BASE_GMAIL_API_URL } from '@/lib/constants'
import { dummyData, getCategoryQuery } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'



export default function Home() {
  const { fetchWithAuth } = useAuth()
  const query = getCategoryQuery("INBOX")
  const fetchUrl = new URL(`${BASE_GMAIL_API_URL}/users/me/messages`)
  const fetchUrlQuery = new URLSearchParams()
  fetchUrlQuery.set("q", `in:inbox ${query}`)
  fetchUrlQuery.set("maxResults", '50')
  fetchUrlQuery.set("includeSpamTrash", "false")
  fetchUrl.search = fetchUrlQuery.toString()

  const { data, isLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => fetchWithAuth(fetchUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
  })
  console.log("Google Mail data", data)
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
      <TabView />
      <MailList data={dummyData} />
      <NewMailButton />
    </SafeAreaView>
  )
}