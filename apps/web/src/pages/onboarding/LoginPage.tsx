import { useNavigate } from 'react-router';

import googleLogo from '../../assets/google-logo.svg';
import kakaoLogo from '../../assets/kakao-logo.svg';
import { supabase } from '../../shared/api/supabase';
import { BrandHero } from '../../shared/ui/BrandHero';
import { Button } from '../../shared/ui/Button';
import { Screen } from '../../shared/ui/Screen';

export function LoginPage() {
  const navigate = useNavigate();
  // TODO: 카카오 로그인 연동
  const login = () => navigate('/group');

  const loginWithGoogle = () => {
    void supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <Screen
      footer={
        <div className="flex flex-col gap-4 pb-[52px]">
          <Button variant="kakao" icon={kakaoLogo} onClick={login}>
            카카오로 계속하기
          </Button>
          <Button variant="white" icon={googleLogo} onClick={loginWithGoogle}>
            Google로 계속하기
          </Button>
        </div>
      }
    >
      <BrandHero />
    </Screen>
  );
}
