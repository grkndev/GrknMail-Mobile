import { DrawerContentComponentProps } from '@react-navigation/drawer'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icons from './ui/icons'

export default function DrawerContentView(props: DrawerContentComponentProps) {
  
  return (
    <SafeAreaView className='flex-1 p-4'>


      <TouchableOpacity onPress={
        () => {
          props.navigation.navigate('index')
        }
      } className={
        `flex-row items-center gap-4 p-4 rounded-2xl ${props.state.index === 0 ? 'bg-[#D7EAFD] ' : ''}`
      }>
        <Icons name='Inbox' size={20} color={props.state.index === 0 ? '#007AFF' : '#000'} />
        <Text className={
          `font-bold ${props.state.index === 0 ? 'text-blue-500' : ''}`
        }>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={
        () => {
          props.navigation.navigate('outbox')
        }
      } className={
        `flex-row items-center gap-4 p-4 rounded-2xl ${props.state.index === 3 ? 'bg-[#D7EAFD] ' : ''}`
      }>
        <Icons name='Send' size={20} color={props.state.index === 3 ? '#007AFF' : '#000'} />
        <Text className={
          `font-bold ${props.state.index === 3 ? 'text-blue-500' : ''}`
        }>Outbox</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={
        () => {
          props.navigation.navigate('spam')
        }
      } className={
        `flex-row items-center gap-4 p-4 rounded-2xl ${props.state.index === 2 ? 'bg-[#D7EAFD] ' : ''}`
      }>
        <Icons name='Inbox' size={20} color={props.state.index === 2 ? '#007AFF' : '#000'} />
        <Text className={
          `font-bold ${props.state.index === 2 ? 'text-blue-500' : ''}`
        }>Spam</Text>
      </TouchableOpacity>



      <TouchableOpacity onPress={
        () => {
          props.navigation.navigate('trash')
        }
      } className={
        `flex-row items-center gap-3 p-4 rounded-2xl ${props.state.index === 1 ? 'bg-red-100 ' : ''}`
      }>
        <Icons name='Trash' size={20} color={props.state.index === 1 ? '#ef4444' : '#000'} />
        <Text className={
          `font-bold ${props.state.index === 1 ? 'text-red-500' : ''}`
        }>Trash</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}