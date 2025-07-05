import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TrashScreen() {
  const navigation = useNavigation()
  return (
    <SafeAreaView className='flex-1 bg-white p-4'>
      <Text className='text-2xl font-bold'>Trash</Text>
      <Button title='Toggle Drawer' onPress={() => {
        (navigation as any).toggleDrawer()
      }} />
    </SafeAreaView>
  )
}