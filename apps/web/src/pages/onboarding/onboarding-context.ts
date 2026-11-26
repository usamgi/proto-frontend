import { createContext, use } from 'react';

export interface Group {
  name: string;
  createdAt: Date;
}

export type Agreement = 'age' | 'terms' | 'privacy' | 'marketing';

interface OnboardingState {
  /** 만들었거나 참여하기로 한 그룹 */
  group: Group | null;
  setGroup: (group: Group) => void;
  /** 약관 동의 화면에서 체크한 항목. 약관 상세 화면을 다녀와도 유지한다 */
  agreed: Agreement[];
  setAgreed: (agreed: Agreement[]) => void;
}

export const OnboardingContext = createContext<OnboardingState | null>(null);

export function useOnboarding() {
  const state = use(OnboardingContext);
  if (!state) throw new Error('OnboardingProvider 안에서만 쓸 수 있다');
  return state;
}

/** 서버 연동 전까지 초대 링크로 들어오는 그룹을 대신한다 */
export const INVITED_GROUP: Group = { name: '우3기', createdAt: new Date(2026, 10, 24) };

export function formatDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}
