import Header from '@/components/Header'
import MailList from '@/components/MailList'
import NewMailButton from '@/components/NewMailButton'
import TabView from '@/components/TabView'
import { useAuth } from '@/context/auth'
import { mapGmailToMailItem } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



export default function Home() {

  // const getToken = async () => {
  //   const token = await tokenCache?.getToken("accessToken")

  //   return jose.decodeJwt(token)
  // }

  const { fetchWithAuth } = useAuth()


  const { data, isLoading, error } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => fetchWithAuth(`/api/protected/inbox`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
  })
  // console.log("Google Mail data", data)

  // React.useEffect(() => {
  //   getToken().then(token => {
  //     console.log("token", token.google_access_token)
  //   })
  // }, [])

  // Map Gmail API data to IMailItem format
  const mailData = React.useMemo(() => {
    if (!data?.messages) return []
    return data.messages.map(mapGmailToMailItem)
  }, [data])

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <Header />
        <TabView />
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className='text-gray-500 mt-4'>Mail'ler yükleniyor...</Text>
        </View>
        <NewMailButton />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <Header />
        <TabView />
        <View className='flex-1 justify-center items-center px-4'>
          <Text className='text-red-500 text-lg font-semibold mb-2'>Hata</Text>
          <Text className='text-gray-500 text-center'>Mail'ler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</Text>
        </View>
        <NewMailButton />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
      <TabView />
      <MailList data={mailData} />
      <NewMailButton />
    </SafeAreaView>
  )
}