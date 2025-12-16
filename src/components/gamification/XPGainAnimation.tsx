import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { sounds } from '@/lib/sounds';

interface XPGainAnimationProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export function XPGainAnimation({ amount, show, onComplete }: XPGainAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      sounds.xp();
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div
        className={cn(
          'text-4xl font-bold text-amber-500 animate-bounce',
          'transform transition-all duration-500',
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10'
        )}
        style={{
          animation: 'xpFloat 1.5s ease-out forwards',
          textShadow: '0 2px 10px rgba(245, 158, 11, 0.5)',
        }}
      >
        +{amount} XP
      </div>
      <style>{`
        @keyframes xpFloat {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scale(1.2);
          }
          40% {
            transform: translateY(-10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
