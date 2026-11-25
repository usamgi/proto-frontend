import { Link, useNavigate } from 'react-router';

import { Button } from '../../shared/ui/Button';
import { Screen } from '../../shared/ui/Screen';
import { CONTACT_EMAIL, OPERATOR } from '../legal/legal-info';

const STEPS = [
  '친구들과 그룹을 만들거나 초대 링크로 참여해요',
  '매일 주어지는 오늘의 키워드에 맞춰 사진을 찍어요',
  '그룹 친구들이 같은 주제로 찍은 사진을 나란히 봐요',
];

/** 로그인하지 않아도 서비스를 소개하는 홈페이지. 구글 OAuth 앱 홈페이지로 등록한다 */
export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Screen footer={<Button onClick={() => navigate('/login')}>시작하기</Button>}>
      <div className="flex flex-col gap-10 px-5 pt-16 pb-10 break-keep">
        <header className="flex flex-col items-center text-center">
          <p className="text-[16px] leading-[38px] font-light text-navy">우리들의 사진 기록</p>
          <h1 className="-mt-[3px] font-logo text-[56px] leading-[72px] font-bold tracking-[-1.7864px] text-black">
            USAGI
          </h1>
        </header>

        <p className="text-[16px] leading-[1.6] font-medium">
          USAGI는 매일 주어지는 오늘의 키워드에 맞춰 사진을 찍고, 그룹 친구들이 같은 주제로 찍은
          사진을 나란히 모아 보는 서비스예요.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="text-heading font-semibold">이렇게 사용해요</h2>
          <ol className="flex flex-col gap-3">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-3xl bg-white p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue/20 text-[14px] font-bold text-blue">
                  {index + 1}
                </span>
                <span className="text-[15px] font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="text-[14px] leading-[1.6] text-ink-sub">
          지금은 사용성 테스트(UT)를 진행하는 프로토타입이에요. 구글 또는 카카오 계정으로 로그인해
          이용할 수 있어요.
        </p>

        <footer className="flex flex-col gap-2 text-[13px] text-ink-sub">
          <nav className="flex gap-3">
            <Link to="/privacy" className="font-semibold underline">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="underline">
              이용약관
            </Link>
          </nav>
          <p>
            운영: {OPERATOR} · 문의: {CONTACT_EMAIL}
          </p>
        </footer>
      </div>
    </Screen>
  );
}
