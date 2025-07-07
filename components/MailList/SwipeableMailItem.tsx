import { OPACITY, SCALE, SPRING_CONFIG } from '@/lib/constants/animations'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, {
    cancelAnimation,
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
    index: number
    onArchive?: (item: any) => void
    onDelete?: (item: any) => void
}

const SWIPE_THRESHOLD_PARTIAL = 80
const SWIPE_THRESHOLD_COMPLETE = 150

// Gesture states enum for better performance
enum GestureState {
    IDLE = 0,
    PARTIAL_LEFT = 1,
    COMPLETE_LEFT = 2,
    PARTIAL_RIGHT = 3,
    COMPLETE_RIGHT = 4,
}

const SwipeableMailItem = React.memo(function SwipeableMailItem({
    item,
    index,
    onArchive,
    onDelete
}: SwipeableMailItemProps) {
    // Optimized: Only 2 shared values instead of 5
    const translateX = useSharedValue(0)
    const gestureState = useSharedValue(GestureState.IDLE)

    // Haptic debouncing
    const lastHapticTime = useRef(0)
    const HAPTIC_DEBOUNCE = 100 // ms

    // Cleanup animations on unmount
    useEffect(() => {
        return () => {
            cancelAnimation(translateX)
            cancelAnimation(gestureState)
        }
    }, [translateX, gestureState])

    const triggerHaptic = () => {
        const now = Date.now()
        if (now - lastHapticTime.current > HAPTIC_DEBOUNCE) {
            lastHapticTime.current = now
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
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
            'worklet'
            gestureState.value = GestureState.IDLE
        },
        onActive: (event) => {
            translateX.value = event.translationX

            // Optimized haptic triggers with enum states
            const absTranslation = Math.abs(event.translationX)
            const isLeft = event.translationX < 0

            if (absTranslation >= SWIPE_THRESHOLD_COMPLETE) {
                const newState = isLeft ? GestureState.COMPLETE_LEFT : GestureState.COMPLETE_RIGHT
                if (gestureState.value !== newState) {
                    gestureState.value = newState
                    runOnJS(triggerHaptic)()
                }
            } else if (absTranslation >= SWIPE_THRESHOLD_PARTIAL) {
                const newState = isLeft ? GestureState.PARTIAL_LEFT : GestureState.PARTIAL_RIGHT
                if (gestureState.value !== newState) {
                    gestureState.value = newState
                    runOnJS(triggerHaptic)()
                }
            }
        },
        onEnd: (event) => {
            const shouldExecuteAction = Math.abs(event.translationX) > SWIPE_THRESHOLD_COMPLETE

            if (shouldExecuteAction) {
                const action = event.translationX < 0 ? 'archive' : 'delete'
                runOnJS(executeAction)(action)
            }

            translateX.value = withSpring(0, SPRING_CONFIG.GENTLE)
            gestureState.value = GestureState.IDLE
        },
        onCancel: () => {
            translateX.value = withSpring(0, SPRING_CONFIG.GENTLE)
            gestureState.value = GestureState.IDLE
        }
    })

    // Optimized: Combined container and main content styles
    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }]
        }
    })

    // Optimized: Left action styles
    const leftActionAnimatedStyle = useAnimatedStyle(() => {
        const isLeft = translateX.value < 0
        const absTranslateX = Math.abs(translateX.value)

        if (!isLeft) return { opacity: 0, transform: [{ scale: SCALE.SMALL }] }

        const progress = interpolate(
            absTranslateX,
            [0, SWIPE_THRESHOLD_PARTIAL, SWIPE_THRESHOLD_COMPLETE],
            [0, 0.6, 1],
            Extrapolation.CLAMP
        )

        const opacity = interpolate(
            progress,
            [0, 0.3, 1],
            [OPACITY.HIDDEN, OPACITY.SEMI_VISIBLE, OPACITY.VISIBLE],
            Extrapolation.CLAMP
        )

        const scale = interpolate(
            progress,
            [0, 0.5, 1],
            [SCALE.SMALL, SCALE.NORMAL, SCALE.LARGE],
            Extrapolation.CLAMP
        )

        return {
            opacity,
            transform: [{ scale }]
        }
    })

    // Optimized: Right action styles
    const rightActionAnimatedStyle = useAnimatedStyle(() => {
        const isRight = translateX.value > 0
        const absTranslateX = Math.abs(translateX.value)

        if (!isRight) return { opacity: 0, transform: [{ scale: SCALE.SMALL }] }

        const progress = interpolate(
            absTranslateX,
            [0, SWIPE_THRESHOLD_PARTIAL, SWIPE_THRESHOLD_COMPLETE],
            [0, 0.6, 1],
            Extrapolation.CLAMP
        )

        const opacity = interpolate(
            progress,
            [0, 0.3, 1],
            [OPACITY.HIDDEN, OPACITY.SEMI_VISIBLE, OPACITY.VISIBLE],
            Extrapolation.CLAMP
        )

        const scale = interpolate(
            progress,
            [0, 0.5, 1],
            [SCALE.SMALL, SCALE.NORMAL, SCALE.LARGE],
            Extrapolation.CLAMP
        )

        return {
            opacity,
            transform: [{ scale }]
        }
    })

    // Optimized: Background styles
    const leftBackgroundAnimatedStyle = useAnimatedStyle(() => {
        const isLeft = translateX.value < 0
        const absTranslateX = Math.abs(translateX.value)

        if (!isLeft) return { opacity: 0 }

        const progress = interpolate(
            absTranslateX,
            [0, SWIPE_THRESHOLD_PARTIAL, SWIPE_THRESHOLD_COMPLETE],
            [0, 0.4, 1],
            Extrapolation.CLAMP
        )

        return {
            opacity: interpolate(
                progress,
                [0, 0.2, 1],
                [OPACITY.HIDDEN, OPACITY.FADED, OPACITY.VISIBLE],
                Extrapolation.CLAMP
            )
        }
    })

    const rightBackgroundAnimatedStyle = useAnimatedStyle(() => {
        const isRight = translateX.value > 0
        const absTranslateX = Math.abs(translateX.value)

        if (!isRight) return { opacity: 0 }

        const progress = interpolate(
            absTranslateX,
            [0, SWIPE_THRESHOLD_PARTIAL, SWIPE_THRESHOLD_COMPLETE],
            [0, 0.4, 1],
            Extrapolation.CLAMP
        )

        return {
            opacity: interpolate(
                progress,
                [0, 0.2, 1],
                [OPACITY.HIDDEN, OPACITY.FADED, OPACITY.VISIBLE],
                Extrapolation.CLAMP
            )
        }
    })

    return (
        <TouchableOpacity className="relative" activeOpacity={0.5} onPress={() => {
            console.log('pressed')
        }}>
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
                activeOffsetX={[-8, 8]}
                failOffsetY={[-20, 20]}
                shouldCancelWhenOutside={true}
            >
                <Animated.View style={[containerAnimatedStyle]} className="bg-white">
                    <MailListItem item={item} index={index} />
                </Animated.View>
            </PanGestureHandler>
        </TouchableOpacity>
    )
})

export default SwipeableMailItem 