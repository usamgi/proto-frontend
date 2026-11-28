import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import {
  forgetReturnPath,
  getAuthStatus,
  rememberReturnPath,
  startPageOf,
  useAuth,
  type AuthStatus,
} from './auth-context';

/** 감싼 화면들은 allow 상태의 사용자만 들어온다. 다른 상태면 그 상태의 첫 화면으로 보낸다 */
export function AuthGate({ allow }: { allow: AuthStatus }) {
  const { session, loading } = useAuth();
  const { pathname, search } = useLocation();
  const status = loading ? null : getAuthStatus(session);
  const isAllowed = status === allow;

  // 동의까지 마친 사용자가 보호된 화면에 들어왔으면 적어 둔 주소는 쓸 일이 끝났다
  useEffect(() => {
    if (isAllowed && allow === 'member') forgetReturnPath();
  }, [isAllowed, allow]);

  // 저장된 세션을 읽기 전에 판단하면 로그인한 사용자도 잠깐 로그인 화면으로 튕긴다
  if (status === null) return null;
  if (isAllowed) return <Outlet />;

  // 로그인·약관 동의 전이라 막혔으면 원래 주소(예: /join?code=)를 적어 두고, 끝나면 돌아온다
  if (allow === 'member') rememberReturnPath(pathname + search);
  return <Navigate to={startPageOf(status)} replace />;
}
