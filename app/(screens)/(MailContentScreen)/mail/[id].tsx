import MailContent from '@/components/MailContent'
import Icons from '@/components/ui/icons'
import { dummyData } from '@/lib/utils'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet'


export default function MailContentScreen() {
  const { id } = useLocalSearchParams()
  

  // Find the mail item by id
  const mailItem = dummyData.find((item) => item.id === id)


  // ref
  const moreOptionsBottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const detailsBottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    moreOptionsBottomSheetModalRef.current?.present();
  }, []);

  const handlePresentDetailsModalPress = React.useCallback(() => {
    detailsBottomSheetModalRef.current?.present();
  }, []);


  return (
    <>
      {/* MORE OPTIONS BOTTOM SHEET */}
      <BottomSheetModal
        ref={moreOptionsBottomSheetModalRef}
        backdropComponent={
          (props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          )
        }
      >
        <BottomSheetView

          style={{
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            flex: 1,
            gap: 16,
            paddingBottom: 32,
          }}
        >
          <Pressable className='flex-row items-center gap-2 rounded-lg p-4'>
            <Icons name='Reply' size={24} color='black' />
            <Text className='font-semibold'>Reply</Text>
          </Pressable>

          <Pressable className='flex-row items-center gap-2 rounded-lg p-4'>
            <Icons name='Forward' size={24} color='black' />
            <Text className='font-semibold'>Forward</Text>
          </Pressable>

          <Pressable className='flex-row items-center gap-2 rounded-lg p-4'>
            <Icons name='Archive' size={24} color='black' />
            <Text className='font-semibold'>Archive</Text>
          </Pressable>

          <Pressable className='flex-row items-center gap-2 rounded-lg p-4'>
            <Icons name='Trash2' size={24} color='red' />
            <Text className='font-semibold text-red-500'>Delete</Text>
          </Pressable>


        </BottomSheetView>
      </BottomSheetModal>

      {/* DETAILS BOTTOM SHEET */}
      <BottomSheetModal
        ref={detailsBottomSheetModalRef}
        backdropComponent={
          (props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          )
        }
      >
        <BottomSheetView

          style={{
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            flex: 1,
            gap: 8,
            paddingBottom: 32,
          }}
        >
          <Text>From: no-reply@grkn.dev</Text>
          <Text>To: info@grkn.dev</Text>
          <Text>Date: 2025-07-09</Text>
          <Text>Subject: Test Mail</Text>
          <Text>Signed by: Grkn</Text>
          <Text>Security: Standart (TLS)</Text>



        </BottomSheetView>
      </BottomSheetModal>


      <SafeAreaView className='flex-1 bg-white'>
        {/* HEADER */}
        <View className='flex-row items-center justify-between p-4'>
          <Pressable className='w-12 h-12  bg-gray-200 rounded-full items-center justify-center'
            onPress={() => router.back()}
          >
            <Icons name='ChevronLeft' size={24} color='black' />
          </Pressable>
          <View className=''>
            <Text className='text-lg font-bold'>Mail Content</Text>
          </View>
          <Pressable onPress={handlePresentModalPress} className='w-12 h-12  bg-gray-200 rounded-full items-center justify-center'>
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
              <Pressable className='ml-2 flex-row items-center gap-2 bg-gray-200 rounded-lg py-1 px-2'
                onPress={handlePresentDetailsModalPress}
              >
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