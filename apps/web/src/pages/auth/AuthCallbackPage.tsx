import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { supabase } from '../../shared/api/supabase';

/** 소셜 로그인 뒤 돌아오는 곳. URL의 code를 세션으로 바꾼 뒤 다음 화면으로 보낸다 */
export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // getSession은 클라이언트가 URL의 code를 교환할 때까지 기다린다
    void supabase.auth.getSession().then(({ data }) => {
      navigate(data.session ? '/group' : '/login', { replace: true });
    });
  }, [navigate]);

  return null;
}
