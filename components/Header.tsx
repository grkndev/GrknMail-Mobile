import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Icons from './ui/icons'

export default function Header() {
  const navigation = useNavigation()
  return (
    <View className="flex flex-row justify-between items-center p-4">
      <View className='flex-row items-center gap-2'>
        <Image source={{ uri: 'https://github.com/grkndev.png' }} className='w-12 h-12 rounded-full' />
        <View className='flex-col'>
          <Text className='text-xs text-zinc-500'>Welcome back,</Text>
          <Text className='text-xl text-zinc-900 font-bold'>Grkndev</Text>
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