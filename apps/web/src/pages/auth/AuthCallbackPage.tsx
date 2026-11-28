import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { fetchProfile } from '@/shared/api/profile';
import { supabase } from '@/shared/api/supabase';
import { getAuthStatus, startPageOf } from '@/shared/auth/auth-context';

/** 소셜 로그인 뒤 돌아오는 곳. URL의 code를 세션으로 바꾼 뒤 다음 화면으로 보낸다 */
export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // getSession은 클라이언트가 URL의 code를 교환할 때까지 기다린다
    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return navigate('/login', { replace: true });

      const profile = await fetchProfile(session.user.id);
      // 처음이면 약관 동의, 동의를 마쳤으면 홈(로그인 전에 막힌 주소가 있으면 그곳)으로 간다.
      // 도착한 화면이 이 이름으로 환영 토스트를 띄운다
      await navigate(startPageOf(getAuthStatus(session)), {
        replace: true,
        state: { welcome: profile?.name ?? '' },
      });
    });
  }, [navigate]);

  return null;
}
