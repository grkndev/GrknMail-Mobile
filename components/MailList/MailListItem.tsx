import { truncate } from '@/lib/utils'
import React, { useMemo } from 'react'
import { Image, Text, View } from 'react-native'
import Icons from '../ui/icons'

// Optimized: Pre-calculated test content outside component
const TEST_EMAIL_CONTENT = "This is a test email ".repeat(10)
const TRUNCATED_CONTENT = truncate(TEST_EMAIL_CONTENT, 100)

// Optimized: Memoized image source
const AVATAR_SOURCE = { uri: 'https://github.com/grkndev.png' }

// Optimized: Static styles
const AVATAR_CONTAINER_STYLE = 'relative w-12 h-12 items-start'
const NOTIFICATION_BADGE_STYLE = 'absolute top-0 right-0 bg-blue-500 rounded-full w-4 h-4 z-10 border-2 border-white'
const AVATAR_STYLE = 'w-12 h-12 rounded-full'
const HEADER_STYLE = 'flex flex-row justify-between items-center'
const CONTENT_STYLE = 'flex flex-row justify-between items-center flex-1 gap-2'
const TEXT_CONTAINER_STYLE = 'flex-1'
const ICON_CONTAINER_STYLE = 'flex flex-col items-center justify-evenly h-full'
const MAIN_CONTAINER_STYLE = 'flex flex-row items-start gap-2 w-full px-4 py-2 mt-2'

// Reanimated ile animasyonlu wrapper component
const MailListItem = React.memo(function MailListItem({
    item,
    index
}: {
    item: any,
    index: number
}) {

    // Optimized: Memoize dynamic content only when item changes
    const emailContent = useMemo(() => {
        if (item?.body) {
            return truncate(item.body, 100)
        }
        return TRUNCATED_CONTENT
    }, [item?.body])

    const senderName = useMemo(() => {
        return item?.sender || 'GrknDev'
    }, [item?.sender])

    const emailTitle = useMemo(() => {
        return item?.title || 'Hello, world!'
    }, [item?.title])

    const timestamp = useMemo(() => {
        return item?.receivedAt || '11:42 AM'
    }, [item?.receivedAt])

    const avatarSource = item?.avatarUrl ? { uri: item.avatarUrl } : AVATAR_SOURCE

    return (
        <View className={MAIN_CONTAINER_STYLE}>
            <View className={AVATAR_CONTAINER_STYLE}>
                <View className={NOTIFICATION_BADGE_STYLE} />
                <Image source={avatarSource} className={AVATAR_STYLE} />
            </View>
            <View className='flex-1'>
                <View className={HEADER_STYLE}>
                    <Text className='text-lg font-bold'>{senderName}</Text>
                    <Text className='text-sm text-zinc-500'>{timestamp}</Text>
                </View>
                <View className={CONTENT_STYLE}>
                    <View className={TEXT_CONTAINER_STYLE}>
                        <Text className='text-base font-semibold'>{emailTitle}</Text>
                        <Text className='text-sm text-zinc-400'>{emailContent}</Text>
                    </View>
                    <View className={ICON_CONTAINER_STYLE}>
                        <Icons name='Paperclip' size={16} color='gray' />
                        <Icons name='Star' size={16} color='gold' fill='gold' />
                    </View>
                </View>
            </View>
        </View>
    )
})

export default MailListItem
