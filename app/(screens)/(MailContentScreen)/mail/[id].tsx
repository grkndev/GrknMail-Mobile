import MailContent from '@/components/MailContent'
import Icons from '@/components/ui/icons'
import { dummyData } from '@/lib/utils'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MailContentScreen() {
  const { id } = useLocalSearchParams()

  // Find the mail item by id
  const mailItem = dummyData.find((item) => item.id === id)

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className='flex-1 bg-white'>
        {/* HEADER */}
        <View className='flex-row items-center justify-between p-4'>
          <Pressable className='w-12 h-12  bg-gray-200 rounded-full items-center justify-center'>
            <Icons name='ChevronLeft' size={24} color='black' />
          </Pressable>
          <View className=''>
            <Text className='text-lg font-bold'>Mail Content</Text>
          </View>
          <Pressable className='w-12 h-12  bg-gray-200 rounded-full items-center justify-center'>
            <Icons name='EllipsisVertical' size={24} color='black' />
          </Pressable>
        </View>

        {/* BODY */}
        <View className='flex-1 px-4 gap-4'>
          {/* HEADER */}
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-2xl font-bold'>{mailItem?.title || 'Mail Not Found'}</Text>
            <Pressable className='flex-row items-center gap-2'>
              <Icons
                name='Star'
                size={24}
                color={mailItem?.isStarred ? 'gold' : 'gray'}
                fill={mailItem?.isStarred ? 'gold' : 'transparent'}
              />
            </Pressable>
          </View>
          {/* INFO */}
          <View className='flex flex-row items-center justify-between'>
            <View className='flex flex-row items-center gap-2'>
              <Image
                source={{ uri: mailItem?.avatarUrl || 'https://github.com/grkndev.png' }}
                className='w-10 h-10 rounded-full'
              />
              <View className='flex flex-col'>
                <Text className='font-semibold'>{mailItem?.sender || 'Unknown'}</Text>
                <Text className='text-sm text-gray-500'>info@grkn.dev</Text>
              </View>
              <Pressable className='ml-2 flex-row items-center gap-2 bg-gray-200 rounded-lg py-1 px-2'>
                <Icons name='Ellipsis' size={12} color='black' />
              </Pressable>
            </View>
            <View>
              <Text className='text-sm text-gray-500'>{mailItem?.receivedAt || 'Unknown'}</Text>
            </View>
          </View>
          {/* CONTENT */}
          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {mailItem ? (
              <MailContent
                content={mailItem.body}
                contentType={mailItem.contentType}
              />
            ) : (
              <View className='flex-1 items-center justify-center'>
                <Text className='text-gray-500 text-center'>Mail not found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  )
}