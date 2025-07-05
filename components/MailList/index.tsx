import { FlashList, ViewToken } from "@shopify/flash-list"
import React, { useCallback, useRef, useState } from 'react'
import { RefreshControl } from 'react-native'
import SwipeableMailItem from "./SwipeableMailItem"


export default function MailList() { 
    const [viewableItems, setViewableItems] = useState(new Set())
    const [refreshing, setRefreshing] = useState(false)
    
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50, // Item'in %50'si görünür olduğunda tetiklenir
        waitForInteraction: false,
        minimumViewTime: 50
    })

    const onViewableItemsChanged = useCallback(({ viewableItems: items }: { viewableItems: ViewToken[] }) => {
        const newViewableItems = new Set(items.map(item => item.index))
        setViewableItems(newViewableItems)
    }, [])

    const handleArchive = useCallback((item: any) => {
        console.log('Archiving item:', item)
        // TODO: Implement archive logic
    }, [])

    const handleDelete = useCallback((item: any) => {
        console.log('Deleting item:', item)
        // TODO: Implement delete logic
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        
        // Simulate loading delay (1-2 seconds)
        setTimeout(() => {
            setRefreshing(false)
            console.log('Mail list refreshed!')
            // TODO: Implement actual refresh logic (fetch new emails, etc.)
        }, 1500)
    }, [])

    const renderItem = useCallback(({ item, index }: { item: any, index: number }) => {
        const isVisible = viewableItems.has(index)
        return (
            <SwipeableMailItem 
                item={item} 
                isVisible={isVisible}
                onArchive={handleArchive}
                onDelete={handleDelete}
            />
        )
    }, [viewableItems, handleArchive, handleDelete])

    return ( 
        <FlashList 
            data={Array.from({ length: 50 }).fill(dummyData)} 
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()} 
            contentContainerStyle={{ 
                // padding: 8 
            }} 
            estimatedItemSize={120}
            removeClippedSubviews={true}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#007AFF"
                    colors={['#007AFF']}
                />
            }
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