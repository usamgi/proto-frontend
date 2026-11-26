import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const TOAST_DURATION = 2000;

/**
 * 로그인 직후 콜백(AuthCallbackPage)이 넘겨 준 닉네임으로 환영 문구를 2초간 돌려준다.
 * 로그인 직후가 아니거나 시간이 지나면 null
 */
export function useWelcomeToast() {
  const navigate = useNavigate();
  const location = useLocation();
  const [welcome, setWelcome] = useState<string | null>(
    () => (location.state as { welcome?: string } | null)?.welcome ?? null,
  );

  useEffect(() => {
    if (welcome === null) return;
    // 다른 화면을 다녀오거나 새로고침해도 다시 뜨지 않게 history state를 비운다
    void navigate('.', { replace: true, state: null });
    const timer = setTimeout(() => setWelcome(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [welcome, navigate]);

  if (welcome === null) return null;
  return welcome ? `${welcome}님 환영합니다` : '환영합니다';
}
