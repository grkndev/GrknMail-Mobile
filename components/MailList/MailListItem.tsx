import { getGravatarUrl, IMailItem, truncate } from '@/lib/utils'
import { RelativePathString, router } from 'expo-router'
import React, { memo } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import Icons from '../ui/icons'

// Default avatar fallback
const DEFAULT_AVATAR = { uri: 'https://github.com/grkndev.png' }

// Memoized sub-components for better performance
const MailHeader = memo(({ sender, receivedAt }: { sender: string, receivedAt: string }) => (
    <View className='flex flex-row justify-between items-center'>
        <Text className='text-lg font-bold'>{truncate(sender, 25)}</Text>
        <Text className='text-sm text-zinc-500'>{receivedAt}</Text>
    </View>
))

const MailContent = memo(({ title, body }: { title: string, body: string }) => (
    <View className='flex-1'>
        <Text className='text-base font-semibold' numberOfLines={1}>
            {title}
        </Text>
        <Text className='text-sm text-zinc-400' numberOfLines={2}>
            {truncate(body, 100)}
        </Text>
    </View>
))

const MailActions = memo(({ hasAttachment, isStarred }: { hasAttachment?: boolean, isStarred?: boolean }) => (
    <View className='flex flex-col items-center justify-evenly h-full'>
        {hasAttachment && (
            <Icons name='Paperclip' size={16} color='gray' />
        )}
        {isStarred && (
            <Icons name='Star' size={16} color='gold' fill='gold' />
        )}
    </View>
))

const Avatar = memo(({ avatarUrl, isUnread }: { avatarUrl?: string, isUnread?: boolean }) => (



<View className='relative w-12 h-12 items-start'>
    {
        isUnread && (
            <View className='absolute top-0 right-0 bg-blue-500 rounded-full w-4 h-4 z-10 border-2 border-white' />
        )
    }
    <Image
        source={avatarUrl ? { uri: getGravatarUrl(avatarUrl) } : DEFAULT_AVATAR}
        className='w-12 h-12 rounded-full'
    />
</View>
))

// Ana component - React.memo ile optimize edilmiş
const MailListItem = memo(({
    item,
    index
}: {
    item: IMailItem,
    index: number
}) => {
    return (

        <Pressable className='flex-row items-start p-4 border-b border-gray-100 ' onPress={() => {
            router.push(`/(screens)/(MailContentScreen)/mail/${item.id}` as RelativePathString)
        }}>
            <Avatar avatarUrl={item.from_email} isUnread={item.isUnread} />
            <View className='flex-1 flex flex-col ml-3'>
                <MailHeader sender={item.from_name} receivedAt={item.formattedDate} />
                <View className='flex flex-row justify-between items-center flex-1 gap-2 mt-1'>
                    <MailContent title={item.subject} body={item.snippet} />
                    <MailActions hasAttachment={item.hasAttachments} isStarred={item.isStarred} />
                </View>
            </View>
        </Pressable>

    )
}, (prevProps, nextProps) => {
    // Custom comparison - sadece item değiştiğinde re-render
    return prevProps.item.id === nextProps.item.id &&
        prevProps.index === nextProps.index;
})

// Display name for debugging
MailListItem.displayName = 'MailListItem'

export default MailListItem