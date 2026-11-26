import { useState, type ReactNode } from 'react';

import { OnboardingContext, type Agreement, type Group } from './onboarding-context';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [agreed, setAgreed] = useState<Agreement[]>([]);
  return (
    <OnboardingContext value={{ group, setGroup, agreed, setAgreed }}>{children}</OnboardingContext>
  );
}
