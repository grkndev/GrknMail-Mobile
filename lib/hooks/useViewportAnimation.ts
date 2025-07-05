import { useEffect } from 'react';
import { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ANIMATION_DURATION, ANIMATION_EASING, OPACITY, SCALE } from '../constants/animations';
import { useVisibility } from '../context/VisibilityContext';

interface UseViewportAnimationProps {
  index: number;
  initialOpacity?: number;
  targetOpacity?: number;
  duration?: number;
  includeScale?: boolean;
  initialScale?: number;
  targetScale?: number;
}

export const useViewportAnimation = ({
  index,
  initialOpacity = OPACITY.FADED,
  targetOpacity = OPACITY.VISIBLE,
  duration = ANIMATION_DURATION.NORMAL,
  includeScale = true,
  initialScale = SCALE.SLIGHTLY_SMALL,
  targetScale = SCALE.NORMAL
}: UseViewportAnimationProps) => {
  const { visibleItems } = useVisibility();
  const opacity = useSharedValue(initialOpacity);

  useEffect(() => {
    const isVisible = visibleItems.has(index);
    
    opacity.value = withTiming(
      isVisible ? targetOpacity : initialOpacity,
      {
        duration,
        easing: ANIMATION_EASING.EASE_OUT,
      }
    );
  }, [visibleItems, index, opacity, initialOpacity, targetOpacity, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseStyle: any = {
      opacity: opacity.value,
    };

    if (includeScale) {
      baseStyle.transform = [
        {
          scale: interpolate(
            opacity.value,
            [initialOpacity, targetOpacity],
            [initialScale, targetScale],
            Extrapolation.CLAMP
          )
        }
      ];
    }

    return baseStyle;
  });

  return {
    animatedStyle,
    isVisible: visibleItems.has(index),
  };
}; 