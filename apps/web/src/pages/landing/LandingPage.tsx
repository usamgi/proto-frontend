import { Link, useNavigate } from 'react-router';

import { BrandHero } from '@/shared/ui/BrandHero';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';

/** 로그인 전 첫 화면. 구글 OAuth 앱 홈페이지라 앱 설명과 약관 링크를 함께 둔다 */
export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Screen
      footer={
        <div className="flex flex-col items-center gap-4 break-keep">
          <p className="text-center text-[14px] leading-normal text-ink-sub">
            매일 주어지는 키워드에 맞춰 사진을 찍고,
            <br />
            그룹 친구들과 같은 주제의 사진을 나란히 모아 봐요
          </p>
          <Button onClick={() => navigate('/login')}>시작하기</Button>
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
