const STORAGE_PREFIX = 'levelup_';

export const StorageKeys = {
  USER: `${STORAGE_PREFIX}user`,
  ONBOARDING_COMPLETED: `${STORAGE_PREFIX}onboarding_completed`,
  EXERCISE_RESULTS: `${STORAGE_PREFIX}exercise_results`,
  DAILY_PROGRESS: `${STORAGE_PREFIX}daily_progress`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
} as const;

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
}

export function clearAll(): void {
  try {
    Object.values(StorageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}

export function isOnboardingCompleted(): boolean {
  return getItem<boolean>(StorageKeys.ONBOARDING_COMPLETED) === true;
}

export function setOnboardingCompleted(): void {
  setItem(StorageKeys.ONBOARDING_COMPLETED, true);
}
