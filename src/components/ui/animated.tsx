import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  pageVariants,
  staggerItemVariants,
  scaleVariants,
  fadeInVariants,
  slideUpVariants,
  popInVariants,
} from '@/lib/animations';

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for animated lists
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerContainer({ children, className, delay = 0.1 }: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: delay,
            delayChildren: 0.1,
          },
        },
      }}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item for list children
interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} {...props}>
      {children}
    </motion.div>
  );
}

// Animated card with hover effects
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hover?: boolean;
}

export function AnimatedCard({ children, hover = true, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      variants={scaleVariants}
      initial="initial"
      animate="animate"
      whileHover={hover ? 'hover' : undefined}
      whileTap={hover ? 'tap' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Fade in component
interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Slide up component
interface SlideUpProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export function SlideUp({ children, delay = 0, ...props }: SlideUpProps) {
  return (
    <motion.div
      variants={slideUpVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Pop in component (for badges, icons)
interface PopInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export function PopIn({ children, delay = 0, ...props }: PopInProps) {
  return (
    <motion.div
      variants={popInVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated counter for numbers
interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={value}
      >
        {value}
      </motion.span>
    </motion.span>
  );
}

// Skeleton loader with pulse animation
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <motion.div
      className={`bg-muted rounded-md ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
      <div className="flex gap-2 pt-2">
        <Skeleton height={24} width={60} className="rounded-full" />
        <Skeleton height={24} width={80} className="rounded-full" />
      </div>
    </div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height={14} width={80} />
          <Skeleton height={28} width={60} />
        </div>
        <Skeleton height={32} width={32} className="rounded-full" />
      </div>
      <Skeleton height={6} width="100%" className="rounded-full" />
    </div>
  );
}

// Hover scale wrapper
interface HoverScaleProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  scale?: number;
}

export function HoverScale({ children, scale = 1.02, ...props }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated presence wrapper for conditional rendering
export { AnimatePresence } from 'framer-motion';
