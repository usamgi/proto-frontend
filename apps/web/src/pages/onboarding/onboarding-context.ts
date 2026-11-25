import { createContext, use } from 'react';

export interface Group {
  name: string;
  createdAt: Date;
}

interface OnboardingState {
  /** 만들었거나 참여하기로 한 그룹 */
  group: Group | null;
  setGroup: (group: Group) => void;
}

export const OnboardingContext = createContext<OnboardingState | null>(null);

export function useOnboarding() {
  const state = use(OnboardingContext);
  if (!state) throw new Error('OnboardingProvider 안에서만 쓸 수 있다');
  return state;
}
