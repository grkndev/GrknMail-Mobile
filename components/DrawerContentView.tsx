import { DrawerContentComponentProps } from '@react-navigation/drawer'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DrawerContentView(props: DrawerContentComponentProps) {
  return (
    <SafeAreaView className='flex-1 p-4'>
      <TouchableOpacity onPress={
        () => {
          props.navigation.navigate('index')
        }
      } className={
        `flex-row items-center gap-2 p-4 rounded-lg ${props.state.index === 0 ? 'bg-[#D7EAFD] ' : ''}`
      }>
        <Text className={
          `font-bold ${props.state.index === 0 ? 'text-blue-500' : ''}`
        }>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={
        () => {
          props.navigation.navigate('trash')
        }
      } className={
        `flex-row items-center gap-2 p-4 rounded-lg ${props.state.index === 1 ? 'bg-[#D7EAFD] ' : ''}`
      }>
        <Text className={
          `font-bold ${props.state.index === 1 ? 'text-blue-500' : ''}`
        }>Trash</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}