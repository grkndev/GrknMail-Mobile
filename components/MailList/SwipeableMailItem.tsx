import * as Haptics from 'expo-haptics'
import React from 'react'
import { View } from 'react-native'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import Icons from '../ui/icons'
import MailListItem from './MailListItem'

interface SwipeableMailItemProps {
    item: any
    isVisible: boolean
    onArchive?: (item: any) => void
    onDelete?: (item: any) => void
}

const SWIPE_THRESHOLD_PARTIAL = 80
const SWIPE_THRESHOLD_COMPLETE = 150

const SwipeableMailItem = React.memo(function SwipeableMailItem({ 
    item, 
    isVisible, 
    onArchive, 
    onDelete 
}: SwipeableMailItemProps) {
    const translateX = useSharedValue(0)
    const hasTriggeredPartialLeft = useSharedValue(false)
    const hasTriggeredPartialRight = useSharedValue(false)
    const hasTriggeredCompleteLeft = useSharedValue(false)
    const hasTriggeredCompleteRight = useSharedValue(false)

    const triggerHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const executeAction = (action: 'archive' | 'delete') => {
        if (action === 'archive' && onArchive) {
            onArchive(item)
        } else if (action === 'delete' && onDelete) {
            onDelete(item)
        }
    }

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart: () => {
            hasTriggeredPartialLeft.value = false
            hasTriggeredPartialRight.value = false
            hasTriggeredCompleteLeft.value = false
            hasTriggeredCompleteRight.value = false
        },
        onActive: (event) => {
            translateX.value = event.translationX

            // Left swipe (negative values) - Archive
            if (event.translationX < -SWIPE_THRESHOLD_PARTIAL && !hasTriggeredPartialLeft.value) {
                hasTriggeredPartialLeft.value = true
                runOnJS(triggerHaptic)()
            }
            
            if (event.translationX < -SWIPE_THRESHOLD_COMPLETE && !hasTriggeredCompleteLeft.value) {
                hasTriggeredCompleteLeft.value = true
                runOnJS(triggerHaptic)()
            }

            // Right swipe (positive values) - Delete
            if (event.translationX > SWIPE_THRESHOLD_PARTIAL && !hasTriggeredPartialRight.value) {
                hasTriggeredPartialRight.value = true
                runOnJS(triggerHaptic)()
            }
            
            if (event.translationX > SWIPE_THRESHOLD_COMPLETE && !hasTriggeredCompleteRight.value) {
                hasTriggeredCompleteRight.value = true
                runOnJS(triggerHaptic)()
            }
        },
        onEnd: (event) => {
            const shouldExecuteAction = Math.abs(event.translationX) > SWIPE_THRESHOLD_COMPLETE

            if (shouldExecuteAction) {
                if (event.translationX < 0) {
                    runOnJS(executeAction)('archive')
                } else {
                    runOnJS(executeAction)('delete')
                }
            }

            translateX.value = withSpring(0, {
                damping: 15,
                stiffness: 150,
            })
        },
        onCancel: () => {
            // Reset all haptic flags
            hasTriggeredPartialLeft.value = false
            hasTriggeredPartialRight.value = false
            hasTriggeredCompleteLeft.value = false
            hasTriggeredCompleteRight.value = false
            
            // Reset position with spring animation
            translateX.value = withSpring(0, {
                damping: 15,
                stiffness: 150,
            })
        }
    })

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }]
        }
    })

    const leftActionAnimatedStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD_COMPLETE, -SWIPE_THRESHOLD_PARTIAL, 0],
            [1, 0.6, 0],
            Extrapolation.CLAMP
        )

        const scale = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD_COMPLETE, -SWIPE_THRESHOLD_PARTIAL, 0],
            [1.2, 1, 0.8],
            Extrapolation.CLAMP
        )

        return {
            opacity: progress,
            transform: [{ scale }]
        }
    })

    const rightActionAnimatedStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD_PARTIAL, SWIPE_THRESHOLD_COMPLETE],
            [0, 0.6, 1],
            Extrapolation.CLAMP
        )

        const scale = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD_PARTIAL, SWIPE_THRESHOLD_COMPLETE],
            [0.8, 1, 1.2],
            Extrapolation.CLAMP
        )

        return {
            opacity: progress,
            transform: [{ scale }]
        }
    })

    const leftBackgroundAnimatedStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD_COMPLETE, 0],
            [1, 0],
            Extrapolation.CLAMP
        )

        return {
            opacity: progress
        }
    })

    const rightBackgroundAnimatedStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD_COMPLETE],
            [0, 1],
            Extrapolation.CLAMP
        )

        return {
            opacity: progress
        }
    })

    return (
        <View className="relative">
            {/* Left Action Background (Archive) */}
            <Animated.View 
                style={[leftBackgroundAnimatedStyle]}
                className="z-10 absolute left-0 top-0 bottom-0 w-full bg-blue-500 flex-row items-center justify-end pr-12"
            >
                <Animated.View style={[leftActionAnimatedStyle]}>
                    <Icons name="Archive" size={24} color="white" />
                </Animated.View>
            </Animated.View>

            {/* Right Action Background (Delete) */}
            <Animated.View 
                style={[rightBackgroundAnimatedStyle]}
                className="z-10 absolute right-0 top-0 bottom-0 w-full bg-red-500 flex-row items-center justify-start pl-12"
            >
                <Animated.View style={[rightActionAnimatedStyle]}>
                    <Icons name="Trash" size={24} color="white" />
                </Animated.View>
            </Animated.View>

            {/* Main Content */}
            <PanGestureHandler 
                onGestureEvent={gestureHandler}
                activeOffsetX={[-10, 10]}
                failOffsetY={[-10, 10]}
                shouldCancelWhenOutside={true}
            >
                <Animated.View style={[containerAnimatedStyle]} className="bg-white">
                    <MailListItem item={item} isVisible={isVisible} />
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
})

export default SwipeableMailItem 