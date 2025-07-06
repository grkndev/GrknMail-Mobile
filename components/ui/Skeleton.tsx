import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

type SkeletonProps = {
    children: React.ReactNode;
    style?: ViewStyle;
};

const Skeleton: React.FC<SkeletonProps> = ({ children, style }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            progress.value,
            [0, 1],
            [0, 1]
        );
        return {
            opacity,
        };
    });

    return (
        <Animated.View style={[{
            width: 40,
            height: 40,
        }, animatedStyle]}>
           {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        // borderRadius: 8,
        // overflow: 'hidden',
    },
});

export default Skeleton;
