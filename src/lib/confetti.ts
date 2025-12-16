import confetti from 'canvas-confetti';

// Standard celebration confetti
export function celebrateSuccess() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

// Small burst for quiz correct answers
export function smallCelebration() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    zIndex: 9999,
  });
}

// XP gain effect - gold/amber colors
export function xpGainEffect() {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
    zIndex: 9999,
  });
}

// Level up celebration - big and colorful
export function levelUpCelebration() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

// Streak celebration - fire colors
export function streakCelebration() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ef4444', '#f97316', '#fbbf24'],
    zIndex: 9999,
  });
}
