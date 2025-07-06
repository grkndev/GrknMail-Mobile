import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Icons from '../ui/icons'

// Reanimated ile animasyonlu wrapper component
const MailListItem = React.memo(function MailListItem({
    item,
    index
}: {
    item: any,
    index: number
}) {

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.8}
                className='flex flex-row items-start  gap-2 w-full px-4 py-2 mt-2'
                onPress={() => {
                    console.log('pressed')
                }}
            >
                <View className='relative w-12 h-12 items-start'>
                    <View className='absolute top-0 right-0 bg-blue-500 rounded-full w-4 h-4 z-10 border-2 border-white' />
                    <Image source={{ uri: 'https://github.com/grkndev.png' }} className='w-12 h-12 rounded-full' />
                </View>
                <View className='flex-1'>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-lg font-bold'>GrknDev</Text>
                        <Text className='text-sm text-zinc-500'>11:42 AM</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center flex-1 gap-2'>
                        <View className='flex-1'>
                            <Text className='text-base font-semibold'>Hello, world!</Text>
                            <Text className='text-sm text-zinc-400 '>{"This is a test email ".repeat(10).truncate(100)}</Text>
                        </View>
                        <View className='flex flex-col items-center justify-evenly h-full'>
                            <Icons name='Paperclip' size={16} color='gray' />
                            <Icons name='Star' size={16} color='gold' fill='gold' />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
})

export default MailListItem
