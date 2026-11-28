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
const START_PAGE: Record<AuthStatus, string> = {
  guest: '/login',
  agreement: '/agreement',
  member: '/home',
};

/**
 * 로그인·약관 동의 전에 막힌 주소. 소셜 로그인은 다른 사이트에 다녀와 화면 상태가 사라지므로
 * 로그인 토큰과 같은 localStorage에 둔다
 */
const RETURN_PATH_KEY = 'usagi:return-path';

/** 동의까지 마친 사용자만 들어오는 화면에서 막혔을 때, 끝나고 돌아올 주소를 적어 둔다 */
export function rememberReturnPath(path: string) {
  localStorage.setItem(RETURN_PATH_KEY, path);
}

/** 적어 둔 주소로 돌아왔으면 지운다. 다음 로그인 때 그 주소로 다시 가지 않게 한다 */
export function forgetReturnPath() {
  localStorage.removeItem(RETURN_PATH_KEY);
}

/** 상태의 첫 화면. 동의까지 마쳤고 적어 둔 주소가 있으면(예: QR 초대 링크) 홈 대신 그곳 */
export function startPageOf(status: AuthStatus) {
  if (status !== 'member') return START_PAGE[status];
  return localStorage.getItem(RETURN_PATH_KEY) ?? START_PAGE.member;
}
