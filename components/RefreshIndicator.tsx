import { View } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle
} from 'react-native-reanimated'
import Skeleton from './ui/Skeleton'

// Modern Loading Component
export default function ModernRefreshIndicator({ progressValue }: { progressValue: Animated.SharedValue<number> }) {
    const animatedStyle = useAnimatedStyle(() => {
        const progress = progressValue.value
        const scale = interpolate(progress, [0, 1], [0.8, 1], Extrapolation.CLAMP)
        const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.5, 1], Extrapolation.CLAMP)

        return {
            transform: [{ scale }],
            opacity
        }
    })

    // Optimized: Only animate skeleton when actually refreshing
    const isLoading = progressValue.value > 0.1

    return (
        <Animated.View style={[{
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
        }, animatedStyle]}>
            <View style={{
                width: 40,
                height: 40,
                // backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Skeleton isLoading={isLoading}>
                    <Animated.Image
                        source={require('../assets/images/gdev_logo_black.png')}
                        style={{ width: 40, height: 40 }} />
                </Skeleton>
                {/* <Animated.View style={[{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: 'white',
                }, spinnerStyle]} /> */}
            </View>
        </Animated.View>
    )
}