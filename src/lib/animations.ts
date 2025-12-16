import type { Variants } from 'framer-motion';

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Fade in variants
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Slide up variants
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// Scale variants for cards/buttons
export const scaleVariants: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2 },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};

// Stagger container for lists
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item for list children
export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Pop in animation (for badges, notifications)
export const popInVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
};

// Slide in from left
export const slideInLeftVariants: Variants = {
  initial: { x: -50, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Slide in from right
export const slideInRightVariants: Variants = {
  initial: { x: 50, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Pulse animation for attention
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Shake animation for errors
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

// Number counter animation helper
export const counterTransition = {
  duration: 0.8,
  ease: 'easeOut' as const,
};

// Spring transition for interactive elements
export const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
};

// Smooth transition default
export const smoothTransition = {
  duration: 0.3,
  ease: 'easeInOut' as const,
};
