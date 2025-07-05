import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function TabView() {
    return (
        <View className='flex flex-row justify-between items-center border-b border-zinc-200'>
            <TouchableOpacity className='flex-1 items-center p-2 border-b-2 border-blue-500'   >
                <Text className='font-bold'>All</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-1 items-center  p-2 border-b-2 border-transparent'>
                <Text>Unread</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-1 items-center p-2 border-b-2 border-transparent'>
                <Text>Read</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-1 items-center  p-2 border-b-2 border-transparent'>
                <Text>Archive</Text>
            </TouchableOpacity>
        </View>
    )
}