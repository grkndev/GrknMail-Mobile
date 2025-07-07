import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { Button, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function OutboxScreen() {
  const navigation = useNavigation()
  return (
    <SafeAreaView className='flex-1 bg-white p-4'>
      <Text className='text-2xl font-bold'>Outbox</Text>
      <Button title='Toggle Drawer' onPress={() => {
        (navigation as any).toggleDrawer()
      }} />
      <FlashList
        data={Array.from({ length: 50 }).fill({ title: "Hello" }) as { title: string }[]}
        renderItem={({ item }: { item: { title: string } }) => <Text>{item.title}</Text>}
        estimatedItemSize={100}
      />
    </SafeAreaView>
  )
}