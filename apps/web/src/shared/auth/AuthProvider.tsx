import type { Session } from '@supabase/supabase-js';
import { useEffect, useState, type ReactNode } from 'react';

import { supabase } from '@/shared/api/supabase';
import { AuthContext } from './auth-context';

/** 로그인 세션을 앱 전체에 나눠 준다 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 구독하면 저장된 세션으로 INITIAL_SESSION이 먼저 오고,
    // 이후 로그인·로그아웃·토큰 갱신·사용자 정보 변경 때마다 새 세션이 온다
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext value={{ session, loading }}>{children}</AuthContext>;
}
