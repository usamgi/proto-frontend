import googleLogo from '@/assets/google-logo.svg';
import kakaoLogo from '@/assets/kakao-logo.svg';
import { supabase } from '@/shared/api/supabase';
import { BrandHero } from '@/shared/ui/BrandHero';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';

const login = (provider: 'kakao' | 'google') => {
  void supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
};

export function LoginPage() {
  return (
    <Screen
      footer={
        <div className="flex flex-col gap-4 pb-[52px]">
          <Button variant="kakao" icon={kakaoLogo} onClick={() => login('kakao')}>
            카카오로 계속하기
          </Button>
          <Button variant="white" icon={googleLogo} onClick={() => login('google')}>
            Google로 계속하기
          </Button>
        </div>
      }
    >
      <BrandHero />
    </Screen>
  );
}
