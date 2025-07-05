import { useVisibility } from '@/lib/context/VisibilityContext'
import { FlashList, ViewToken } from "@shopify/flash-list"
import React, { useCallback, useRef, useState } from 'react'
import { RefreshControl } from 'react-native'
import SwipeableMailItem from "./SwipeableMailItem"

export default function MailList({data}: {data: any[]}) { 
    const [refreshing, setRefreshing] = useState(false)
    const { setVisibleItems } = useVisibility()
    
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50, // Item'in %50'si görünür olduğunda tetiklenir
        waitForInteraction: false,
        minimumViewTime: 50
    })

    const onViewableItemsChanged = useCallback(({ viewableItems: items }: { viewableItems: ViewToken[] }) => {
        const newViewableItems = new Set(items.map(item => item.index).filter((index): index is number => index !== null))
        setVisibleItems(newViewableItems)
    }, [setVisibleItems])

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
        return (
            <SwipeableMailItem 
                item={item} 
                index={index}
                onArchive={handleArchive}
                onDelete={handleDelete}
            />
        )
    }, [handleArchive, handleDelete])

    return ( 
        <FlashList 
            data={data} 
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