import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

type SkeletonProps = {
    children: React.ReactNode;
    style?: ViewStyle;
    isLoading?: boolean;
};

const Skeleton: React.FC<SkeletonProps> = ({ children, style, isLoading = true }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        if (isLoading) {
            progress.value = withRepeat(
                withTiming(1, { duration: 1000 }),
                -1,
                true
            );
        } else {
            cancelAnimation(progress);
            progress.value = withTiming(1, { duration: 200 });
        }

        return () => {
            cancelAnimation(progress);
        };
    }, [isLoading]);

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
        }, style, animatedStyle]}>
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
