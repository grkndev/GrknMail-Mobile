import { Easing } from 'react-native-reanimated';

// Standard animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const;

// Standard easing curves
export const ANIMATION_EASING = {
  EASE_OUT: Easing.out(Easing.cubic),
  EASE_IN: Easing.in(Easing.cubic),
  EASE_IN_OUT: Easing.inOut(Easing.cubic),
  SPRING: Easing.out(Easing.back(1.7)),
} as const;

// Standard spring configurations
export const SPRING_CONFIG = {
  GENTLE: {
    damping: 20,
    stiffness: 300,
    mass: 1,
    overshootClamping: true,
  },
  BOUNCY: {
    damping: 15,
    stiffness: 400,
    mass: 0.8,
  },
  RESPONSIVE: {
    damping: 25,
    stiffness: 350,
    mass: 0.9,
    overshootClamping: true,
  },
} as const;

// Standard opacity values
export const OPACITY = {
  HIDDEN: 0,
  FADED: 0.3,
  SEMI_VISIBLE: 0.6,
  VISIBLE: 1,
} as const;

// Standard scale values
export const SCALE = {
  SMALL: 0.9,
  SLIGHTLY_SMALL: 0.95,
  NORMAL: 1,
  SLIGHTLY_LARGE: 1.05,
  LARGE: 1.2,
} as const; 