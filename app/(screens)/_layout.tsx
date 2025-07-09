import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Slot, Stack } from 'expo-router'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function MailLayout() {
    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>

                <Stack.Screen name="(MailContentScreen)" options={{ headerShown: false }} />

                <Slot />
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}