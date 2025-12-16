import { useOnboardingStore } from '@/stores/onboardingStore';
import { WelcomeScreen, LevelTestQuestion, LevelResult } from '@/components/onboarding';

export function Onboarding() {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'test':
      return <LevelTestQuestion />;
    case 'result':
      return <LevelResult />;
    default:
      return <WelcomeScreen />;
  }
}
