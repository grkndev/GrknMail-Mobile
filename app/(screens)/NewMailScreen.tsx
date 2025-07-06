import Icons from '@/components/ui/icons'
import { router, Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NewMailScreen() {
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height)
            setIsKeyboardVisible(true)
        })
        
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0)
            setIsKeyboardVisible(false)
        })

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    return (
        <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                className='flex-1 bg-blue-500'
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <SafeAreaView className='flex-1 bg-white'>
                    {/* Header */}
                    <View className='p-4'>
                        <View className='flex-row items-center justify-between'>
                            <TouchableOpacity className=' rounded-full p-3' onPress={() => router.back()}>
                                <Icons name='ArrowLeft' size={24} color='#000' />
                            </TouchableOpacity>
                            <Text className='text-2xl font-bold'>New Mail</Text>
                            <TouchableOpacity className=' rounded-full p-3'>
                                <Icons name='Send' size={24} color='#3b82f6' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Scrollable Content */}
                    <ScrollView 
                        className='flex-1 px-4' 
                        contentContainerStyle={{ 
                            flexGrow: 1, 
                            paddingBottom: isKeyboardVisible && Platform.OS === 'android' ? keyboardHeight + 20 : 20 
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className='flex flex-col gap-4'>
                            <View className='flex-row items-center gap-2'>
                                <Text className='text-base font-medium'>To:</Text>
                                <TextInput placeholder='Enter email' className='rounded-md p-2 flex-1' placeholderTextColor={"#d4d4d8"} />
                            </View>
                            <View className='flex-row items-center gap-2'>
                                <Text className='text-base font-medium'>Cc/Bcc:</Text>
                                <TextInput placeholder='Enter email' className='rounded-md p-2 flex-1' placeholderTextColor={"#d4d4d8"} />
                            </View>
                            <View className='flex-row items-center gap-2'>
                                <Text className='text-base font-medium'>Subject:</Text>
                                <TextInput placeholder='Enter email' className='rounded-md p-2 flex-1' placeholderTextColor={"#d4d4d8"} />
                            </View>
                            <View className='flex-col gap-2 flex-1'>
                                <Text className='text-base font-medium'>Body:</Text>
                                <TextInput 
                                    placeholder='Type your message here...' 
                                    className='flex-1 rounded-md p-2 min-h-32' 
                                    placeholderTextColor={"#d4d4d8"} 
                                    multiline={true} 
                                    style={{
                                        textAlignVertical: 'top',
                                        minHeight: 128,
                                    }} 
                                />
                            </View>
                        </View>
                    </ScrollView>
                    
                    {/* Fixed Bottom Buttons */}
                    <View 
                        className='p-4 border-t border-gray-200 bg-white'
                        style={{
                            marginBottom: isKeyboardVisible && Platform.OS === 'android' ? keyboardHeight : 0
                        }}
                    >
                        <View className='flex-row items-center gap-2'>
                            <TouchableOpacity className='rounded-full p-3'>
                                <Icons name="Paperclip" size={24} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity className='rounded-full p-3'>
                                <Icons name="Camera" size={24} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity className='rounded-full p-3'>
                                <Icons name="Image" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    )
}