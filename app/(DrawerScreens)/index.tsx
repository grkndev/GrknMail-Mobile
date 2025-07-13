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

  // const getToken = async () => {
  //   const token = await tokenCache?.getToken("accessToken")

  //   return jose.decodeJwt(token)
  // }

  const { fetchWithAuth } = useAuth()


  const { data, isLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => fetchWithAuth(`/api/protected/inbox`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
  })
  console.log("Google Mail data", data)

  // React.useEffect(() => {
  //   getToken().then(token => {
  //     console.log("token", token.google_access_token)
  //   })
  // }, [])

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
      <TabView />
      <MailList data={dummyData} />
      <NewMailButton />
    </SafeAreaView>
  )
}