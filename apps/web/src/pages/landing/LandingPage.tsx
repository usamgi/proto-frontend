import { Link, useNavigate } from 'react-router';

import { getAuthStatus, startPageOf, useAuth } from '@/shared/auth/auth-context';
import { BrandHero } from '@/shared/ui/BrandHero';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';

/**
 * 첫 화면. 구글 OAuth 앱 홈페이지라 앱 설명과 약관 링크를 함께 두고, 로그인 상태와 상관없이 보인다.
 * 시작하기는 상태에 맞는 첫 화면(로그인·약관 동의·홈)으로 보낸다
 */
export function LandingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  return (
    <Screen
      footer={
        <div className="flex flex-col items-center gap-4 break-keep">
          <p className="text-center text-[14px] leading-normal text-ink-sub">
            매일 주어지는 키워드에 맞춰 사진을 찍고,
            <br />
            그룹 친구들과 같은 주제의 사진을 나란히 모아 봐요
          </p>
          <Button onClick={() => navigate(startPageOf(getAuthStatus(session)))}>시작하기</Button>
          <nav className="flex gap-3 text-[13px] text-ink-sub">
            <Link to="/privacy" className="font-semibold underline">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="underline">
              이용약관
            </Link>
          </nav>
        </div>
      }
    >
      <BrandHero />
    </Screen>
  );
}
