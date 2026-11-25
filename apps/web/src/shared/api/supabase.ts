import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  // 소셜 로그인에서 돌아올 때 토큰 대신 일회용 code를 받아 교환한다
  { auth: { flowType: 'pkce' } },
);
