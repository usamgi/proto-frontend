import type { Session } from '@supabase/supabase-js';
import { createContext, use } from 'react';

interface AuthState {
  session: Session | null;
  /** 저장된 세션을 아직 읽는 중이면 true. 이때는 로그인 여부를 판단하지 않는다 */
  loading: boolean;
}

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const state = use(AuthContext);
  if (!state) throw new Error('AuthProvider 안에서만 쓸 수 있다');
  return state;
}

/**
 * 사용자 상태
 * - guest: 로그아웃
 * - agreement: 로그인했지만 약관 동의 전
 * - member: 약관 동의까지 마침
 */
export type AuthStatus = 'guest' | 'agreement' | 'member';

export function getAuthStatus(session: Session | null): AuthStatus {
  if (!session) return 'guest';
  // 약관 동의 시각은 auth 사용자 metadata에 저장한다 (AgreementPage)
  return session.user.user_metadata.agreed_at ? 'member' : 'agreement';
}

/** 상태마다 들어갈 수 있는 첫 화면. 들어올 수 없는 화면에 오면 여기로 보낸다 */
export const START_PAGE: Record<AuthStatus, string> = {
  guest: '/login',
  agreement: '/agreement',
  member: '/home',
};
