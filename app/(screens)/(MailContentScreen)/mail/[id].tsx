import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MailContentScreen() {
  const { id } = useLocalSearchParams()
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1'>
          <Text>{id}</Text>
        </View>
      </SafeAreaView>
    </>
  )
}