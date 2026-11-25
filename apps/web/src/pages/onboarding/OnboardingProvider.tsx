import { useState, type ReactNode } from 'react';

import { OnboardingContext, type Group } from './onboarding-context';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [group, setGroup] = useState<Group | null>(null);
  return <OnboardingContext value={{ group, setGroup }}>{children}</OnboardingContext>;
}
