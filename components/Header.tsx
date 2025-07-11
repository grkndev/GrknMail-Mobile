import { useAuth } from '@/context/auth'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Icons from './ui/icons'

export default function Header() {
  const navigation = useNavigation()
  const { user } = useAuth()
  if (!user) return null
  return (
    <View className="flex flex-row justify-between items-center p-4">
      <View className='flex-row items-center gap-2'>
        <View>
          {
            user?.picture ? (
              <Image source={{ uri: user.picture }} className='w-12 h-12 rounded-full' />
            ) : (
              <Icons name='User' size={24} color='black' />
            )
          }
        </View>
        <View className='flex-col'>
          <Text className='text-xs text-zinc-500'>Welcome back,</Text>
          <Text className='text-xl text-zinc-900 font-bold'>
            {user.name}
          </Text>
        </View>
      </View>
      <TouchableOpacity className=' p-2' onPress={() => {
        (navigation as any).toggleDrawer()
      }}>
        <Icons name='Menu' size={24} color='black' />
      </TouchableOpacity>
    </View>
  )
}