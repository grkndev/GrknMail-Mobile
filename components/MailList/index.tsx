import { FlashList, ViewToken } from "@shopify/flash-list"
import React, { useCallback, useRef, useState } from 'react'
import MailListItem from "./MailListItem"


export default function MailList() { 
    const [viewableItems, setViewableItems] = useState(new Set())
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 30, // Item'in %30'u görünür olduğunda tetiklenir
        waitForInteraction: false,
        minimumViewTime: 100
    })

    const onViewableItemsChanged = useCallback(({ viewableItems: items }: { viewableItems: ViewToken[] }) => {
        const newViewableItems = new Set(items.map(item => item.index))
        setViewableItems(newViewableItems)
    }, [])

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const isVisible = viewableItems.has(index)
        return (
            <MailListItem 
                item={item} 
                isVisible={isVisible}
            />
        )
    }

    return ( 
        <FlashList 
            data={Array.from({ length: 50 }).fill(dummyData)} 
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()} 
            contentContainerStyle={{ 
                padding: 8 
            }} 
            estimatedItemSize={100}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
        /> 
    ) 
} 



const dummyData = { 
    id: 1, 
    image: 'https://github.com/grkndev.png', 
    author: 'Grkndev', 
    subject: 'Hello, world!', 
    body: 'This is a test email', 
    sentAt: new Date(), 
    isRead: false, 
}