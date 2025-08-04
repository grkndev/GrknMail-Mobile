import { useAuth } from '@/context/auth'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icons from './ui/icons'

export default function DrawerContentView(props: DrawerContentComponentProps) {
  const { signOut } = useAuth() 
  return (
    <SafeAreaView className='flex-1 p-4 justify-between'>
      <View className='flex flex-col'>

        <View className=' items-start w-full '>
          <Image source={require('@/assets/images/grknmail.png')} className='h-16 aspect-video' resizeMode='contain' />
        </View>
        <View className='flex flex-col gap-2'>
          <TouchableOpacity onPress={
            () => {
              props.navigation.navigate('index')
            }
          } className={
            `flex-row items-center gap-4 p-4 rounded-2xl ${props.state.index === 0 ? 'bg-[#D7EAFD] ' : ''}`
          }>
            <View className='flex-row items-center gap-4 flex-1'>
              <Icons name='Inbox' size={20} color={props.state.index === 0 ? '#007AFF' : '#000'} />
              <Text className={
                `font-bold ${props.state.index === 0 ? 'text-blue-500' : ''}`
              }>Home</Text>
            </View>
            <View>
              <Text className={
                `font-semibold ${props.state.index === 0 ? 'text-blue-500' : ''}`
              }>99+</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={
            () => {
              props.navigation.navigate('outbox')
            }
          } className={
            `flex-row items-center gap-4 p-4 rounded-2xl ${props.state.index === 3 ? 'bg-zinc-100 ' : ''}`
          }>
            <Icons name='Send' size={20} color={props.state.index === 3 ? '#71717a' : '#000'} />
            <Text className={
              `font-bold ${props.state.index === 3 ? 'text-zinc-500' : ''}`
            }>Outbox</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={
            () => {
              props.navigation.navigate('spam')
            }
          } className={
            `flex-row items-center gap-4 p-4 rounded-2xl ${props.state.index === 2 ? 'bg-orange-100 ' : ''}`
          }>
            <Icons name='MailWarning' size={20} color={props.state.index === 2 ? '#f97316' : '#000'} />
            <Text className={
              `font-bold ${props.state.index === 2 ? 'text-orange-500' : ''}`
            }>Spam</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={
            () => {
              props.navigation.navigate('trash')
            }
          } className={
            `flex-row items-center gap-3 p-4 rounded-2xl ${props.state.index === 1 ? 'bg-red-100 ' : ''}`
          }>
            <Icons name='Trash2' size={20} color={props.state.index === 1 ? '#ef4444' : '#000'} />
            <Text className={
              `font-bold ${props.state.index === 1 ? 'text-red-500' : ''}`
            }>Trash</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className='flex flex-col gap-2'>
        <TouchableOpacity className='flex-row items-center gap-4 p-4 rounded-2xl'>
          <Icons name='Settings' size={20} color='#000' />
          <Text className='font-bold'>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row items-center gap-4 p-4 rounded-2xl'>
          <Icons name='CircleQuestionMark' size={20} color='#000' />
          <Text className='font-bold'>Help & Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
          // console.log("logout")
          signOut()
        }} className='flex-row items-center gap-4 p-4 rounded-2xl'>
          <Icons name='LogOut' size={20} color='#000' />
          <Text className='font-bold'>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}