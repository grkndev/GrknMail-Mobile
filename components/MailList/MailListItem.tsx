import { IMailItem, truncate } from '@/lib/utils'
import React, { memo } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import Icons from '../ui/icons'

// Default avatar fallback
const DEFAULT_AVATAR = { uri: 'https://github.com/grkndev.png' }

// Memoized sub-components for better performance
const MailHeader = memo(({ sender, receivedAt }: { sender: string, receivedAt: string }) => (
    <View className='flex flex-row justify-between items-center'>
        <Text className='text-lg font-bold'>{sender}</Text>
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

const Avatar = memo(({ avatarUrl }: { avatarUrl?: string }) => (
    <View className='relative w-12 h-12 items-start'>
        <View className='absolute top-0 right-0 bg-blue-500 rounded-full w-4 h-4 z-10 border-2 border-white' />
        <Image 
            source={avatarUrl ? { uri: avatarUrl } : DEFAULT_AVATAR} 
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
        <Pressable className='flex-row items-start p-4 border-b border-gray-100' onPress={() => {
            console.log('MailListItem pressed', item.id)
        }}>
            <Avatar avatarUrl={item.avatarUrl} />
            <View className='flex-1 ml-3'>
                <MailHeader sender={item.sender} receivedAt={item.receivedAt} />
                <View className='flex flex-row justify-between items-center flex-1 gap-2 mt-1'>
                    <MailContent title={item.title} body={item.body} />
                    <MailActions hasAttachment={item.hasAttachment} isStarred={item.isStarred} />
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