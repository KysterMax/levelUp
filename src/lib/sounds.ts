// Sound effects system using Web Audio API
// No external files needed - generates sounds programmatically

type SoundType = 'xp' | 'levelUp' | 'correct' | 'incorrect' | 'complete' | 'click' | 'streak' | 'badge';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  ramp?: 'up' | 'down' | 'updown';
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig | SoundConfig[]> = {
  xp: {
    frequency: 880,
    duration: 0.1,
    type: 'sine',
    volume: 0.2,
    ramp: 'down',
  },
  levelUp: [
    { frequency: 523.25, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 659.25, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 1046.50, duration: 0.3, type: 'sine', volume: 0.3 },
  ],
  correct: {
    frequency: 880,
    duration: 0.15,
    type: 'sine',
    volume: 0.25,
    ramp: 'up',
  },
  incorrect: {
    frequency: 220,
    duration: 0.25,
    type: 'sawtooth',
    volume: 0.15,
    ramp: 'down',
  },
  complete: [
    { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.25 },
    { frequency: 783.99, duration: 0.1, type: 'sine', volume: 0.25 },
    { frequency: 1046.50, duration: 0.2, type: 'sine', volume: 0.25 },
  ],
  click: {
    frequency: 1200,
    duration: 0.05,
    type: 'sine',
    volume: 0.1,
  },
  streak: [
    { frequency: 440, duration: 0.1, type: 'sine', volume: 0.2 },
    { frequency: 554.37, duration: 0.1, type: 'sine', volume: 0.2 },
    { frequency: 659.25, duration: 0.15, type: 'sine', volume: 0.25 },
  ],
  badge: [
    { frequency: 523.25, duration: 0.12, type: 'sine', volume: 0.3 },
    { frequency: 659.25, duration: 0.12, type: 'sine', volume: 0.3 },
    { frequency: 783.99, duration: 0.12, type: 'sine', volume: 0.3 },
    { frequency: 1046.50, duration: 0.12, type: 'sine', volume: 0.3 },
    { frequency: 1318.51, duration: 0.25, type: 'sine', volume: 0.35 },
  ],
};

let audioContext: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
      return null;
    }
  }
  return audioContext;
}

function playTone(config: SoundConfig, startTime: number = 0): void {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = config.type;
  oscillator.frequency.value = config.frequency;

  const now = ctx.currentTime + startTime;

  if (config.ramp === 'up') {
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(config.volume, now + config.duration * 0.2);
    gainNode.gain.linearRampToValueAtTime(config.volume * 0.8, now + config.duration);
  } else if (config.ramp === 'down') {
    gainNode.gain.setValueAtTime(config.volume, now);
    gainNode.gain.linearRampToValueAtTime(0, now + config.duration);
  } else if (config.ramp === 'updown') {
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(config.volume, now + config.duration * 0.3);
    gainNode.gain.linearRampToValueAtTime(0, now + config.duration);
  } else {
    gainNode.gain.setValueAtTime(config.volume, now);
    gainNode.gain.linearRampToValueAtTime(0, now + config.duration - 0.01);
  }

  oscillator.start(now);
  oscillator.stop(now + config.duration);
}

export function playSound(type: SoundType): void {
  if (!soundEnabled) return;

  const config = SOUND_CONFIGS[type];

  if (Array.isArray(config)) {
    let time = 0;
    config.forEach((tone) => {
      playTone(tone, time);
      time += tone.duration;
    });
  } else {
    playTone(config);
  }
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  localStorage.setItem('levelup-sounds', enabled ? 'true' : 'false');
}

export function isSoundEnabled(): boolean {
  const stored = localStorage.getItem('levelup-sounds');
  if (stored !== null) {
    soundEnabled = stored === 'true';
  }
  return soundEnabled;
}

isSoundEnabled();

export const sounds = {
  xp: () => playSound('xp'),
  levelUp: () => playSound('levelUp'),
  correct: () => playSound('correct'),
  incorrect: () => playSound('incorrect'),
  complete: () => playSound('complete'),
  click: () => playSound('click'),
  streak: () => playSound('streak'),
  badge: () => playSound('badge'),
};
