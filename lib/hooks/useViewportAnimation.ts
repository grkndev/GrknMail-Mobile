import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useVisibility } from '../context/VisibilityContext';

interface UseViewportAnimationProps {
  index: number;
  initialOpacity?: number;
  targetOpacity?: number;
  duration?: number;
}

export const useViewportAnimation = ({
  index,
  initialOpacity = 0.3,
  targetOpacity = 1,
  duration = 300
}: UseViewportAnimationProps) => {
  const { visibleItems } = useVisibility();
  const opacity = useSharedValue(initialOpacity);

  useEffect(() => {
    const isVisible = visibleItems.has(index);
    
    opacity.value = withTiming(
      isVisible ? targetOpacity : initialOpacity,
      {
        duration,
        easing: Easing.out(Easing.cubic),
      }
    );
  }, [visibleItems, index, opacity, initialOpacity, targetOpacity, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return {
    animatedStyle,
    isVisible: visibleItems.has(index),
  };
}; 