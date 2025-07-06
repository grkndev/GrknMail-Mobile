import { useVisibility } from '@/lib/context/VisibilityContext'
import { IMailItem } from '@/lib/utils'
import { FlashList, ViewToken } from "@shopify/flash-list"
import React, { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated'
import ModernRefreshIndicator from '../RefreshIndicator'
import SwipeableMailItem from "./SwipeableMailItem"

export default function MailList({ data }: { data: any[] }) {
    const [refreshing, setRefreshing] = useState(false)
    const { setVisibleItems } = useVisibility()

    // Animated values
    const translateY = useSharedValue(0)
    const refreshProgress = useSharedValue(0)
    const listRef = useRef<FlashList<any>>(null)
    const scrollOffset = useSharedValue(0)
    const scrollVelocity = useSharedValue(0)
    const isScrolling = useSharedValue(false)
    const lastScrollTime = useSharedValue(0)

    const REFRESH_THRESHOLD = 80
    const VELOCITY_THRESHOLD = 50

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
        waitForInteraction: false,
        minimumViewTime: 50
    })

    const onViewableItemsChangedRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        const newItems = new Set(viewableItems.map(i => i.index).filter((i): i is number => i !== null))
        setVisibleItems(newItems)
    })

    const onViewableItemsChanged = onViewableItemsChangedRef.current

    // const handleArchive = useCallback((item: IMailItem) => {
    //     console.log('Archiving item:', item)
    //     // TODO: Implement archive logic
    // }, [])

    // const handleDelete = useCallback((item: IMailItem) => {
    //     console.log('Deleting item:', item)
    //     // TODO: Implement delete logic
    // }, [])

    const triggerRefresh = useCallback(() => {
        setRefreshing(true)

        // Simulate loading
        setTimeout(() => {
            setRefreshing(false)
            console.log('Mail list refreshed!')
            // TODO: Implement actual refresh logic
        }, 2000)
    }, [])

    // Reset animation when refreshing is done
    React.useEffect(() => {
        if (!refreshing) {
            translateY.value = withSpring(0, { damping: 15 })
            refreshProgress.value = withSpring(0, { damping: 15 })
        }
    }, [refreshing])

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }]
        }
    })

    const refreshIndicatorStyle = useAnimatedStyle(() => {
        const opacity = interpolate(translateY.value, [0, 20, REFRESH_THRESHOLD], [0, 0.3, 1], Extrapolation.CLAMP)
        const translateYIndicator = interpolate(
            translateY.value,
            [0, REFRESH_THRESHOLD],
            [-80, 0],
            Extrapolation.CLAMP
        )

        return {
            opacity,
            transform: [{ translateY: translateYIndicator }]
        }
    })

    // Pan gesture handler
    const onPanGestureEvent = useCallback((event: any) => {
        'worklet'
        const { translationY, state, velocityY } = event.nativeEvent

        // Sadece scroll top'dayken ve yukarı çekme hareketinde çalış
        // Daha toleranslı koşullar - normal scroll'u engellemeyecek şekilde
        if (scrollOffset.value > 5 || translationY < 0 ||
            (isScrolling.value && Math.abs(scrollVelocity.value) > VELOCITY_THRESHOLD)) {
            return
        }

        if (state === State.ACTIVE) {
            const newTranslateY = Math.max(0, translationY * 0.6)
            translateY.value = newTranslateY
            refreshProgress.value = Math.min(newTranslateY / REFRESH_THRESHOLD, 1)
        } else if (state === State.END) {
            if (translationY > REFRESH_THRESHOLD && !refreshing) {
                runOnJS(triggerRefresh)()
                translateY.value = withSpring(REFRESH_THRESHOLD, { damping: 15 })
            } else {
                translateY.value = withSpring(0, { damping: 15 })
                refreshProgress.value = withSpring(0, { damping: 15 })
            }
        }
    }, [refreshing])

    // Scroll handlers
    const onScroll = useCallback((event: any) => {
        const offset = event.nativeEvent.contentOffset.y
        const currentTime = Date.now()

        // Velocity hesaplama
        if (lastScrollTime.value > 0) {
            const deltaTime = currentTime - lastScrollTime.value
            const deltaOffset = offset - scrollOffset.value
            scrollVelocity.value = deltaTime > 0 ? Math.abs(deltaOffset / deltaTime) * 1000 : 0
        }

        scrollOffset.value = offset
        lastScrollTime.value = currentTime

        // Eğer scroll yapılıyorsa refresh animasyonunu sıfırla - sadece gerektiğinde
        if (offset > 5 && translateY.value > 0) {
            translateY.value = withSpring(0, { damping: 15 })
            refreshProgress.value = withSpring(0, { damping: 15 })
        }
    }, [])

    const onScrollBeginDrag = useCallback(() => {
        isScrolling.value = true
        // Reset refresh animation only if there's an active refresh
        if (translateY.value > 0) {
            translateY.value = withSpring(0, { damping: 20 })
            refreshProgress.value = withSpring(0, { damping: 20 })
        }
    }, [])

    const onScrollEndDrag = useCallback(() => {
        // Shorter delay for better responsiveness
        setTimeout(() => {
            isScrolling.value = false
        }, 50)
    }, [])

    const onMomentumScrollBegin = useCallback(() => {
        isScrolling.value = true
    }, [])

    const onMomentumScrollEnd = useCallback(() => {
        // Shorter delay for better responsiveness
        setTimeout(() => {
            isScrolling.value = false
            scrollVelocity.value = 0
        }, 50)
    }, [])
    const handleArchive = (item: IMailItem) => console.log('Archive', item)
    const handleDelete = (item: IMailItem) => console.log('Delete', item)

    const renderItem = ({ item, index }: { item: IMailItem, index: number }) => (
        <SwipeableMailItem
            item={item}
            index={index}
            onArchive={handleArchive}
            onDelete={handleDelete}
        />
    )

    return (
        <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Custom Refresh Indicator */}
            <Animated.View style={[{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                height: 80,
                marginTop: 0,
            }, refreshIndicatorStyle]}>
                <ModernRefreshIndicator progressValue={refreshProgress} />
            </Animated.View>

            {/* Main List Container */}
            <PanGestureHandler
                onGestureEvent={onPanGestureEvent}
                onHandlerStateChange={onPanGestureEvent}
                shouldCancelWhenOutside={true}
                activeOffsetY={10}
                failOffsetY={-10}
                failOffsetX={[-80, 80]}
                simultaneousHandlers={listRef}
            >
                <Animated.View style={[{ flex: 1 }, containerStyle]}>
                    <FlashList
                        ref={listRef}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{
                            // padding: 8 
                        }}
                        estimatedItemSize={120}
                        removeClippedSubviews={true}
                        onViewableItemsChanged={onViewableItemsChangedRef.current}
                        viewabilityConfig={viewabilityConfig.current}
                        onScroll={onScroll}
                        onScrollBeginDrag={onScrollBeginDrag}
                        onScrollEndDrag={onScrollEndDrag}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        scrollEventThrottle={16}
                        scrollEnabled={true}
                        bounces={false}
                        overScrollMode="never"
                    />
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
}