import { Navigate, Outlet } from 'react-router';

import { getAuthStatus, START_PAGE, useAuth, type AuthStatus } from './auth-context';

/** 감싼 화면들은 allow 상태의 사용자만 들어온다. 다른 상태면 그 상태의 첫 화면으로 보낸다 */
export function AuthGate({ allow }: { allow: AuthStatus }) {
  const { session, loading } = useAuth();

  // 저장된 세션을 읽기 전에 판단하면 로그인한 사용자도 잠깐 로그인 화면으로 튕긴다
  if (loading) return null;

  const status = getAuthStatus(session);
  return status === allow ? <Outlet /> : <Navigate to={START_PAGE[status]} replace />;
}
