import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import checkCircleOff from '@/assets/check-circle-off.svg';
import checkCircleOn from '@/assets/check-circle-on.svg';
import checkOff from '@/assets/check-off.svg';
import checkOn from '@/assets/check-on.svg';
import chevronRight from '@/assets/chevron-right.svg';
import { Button } from '@/shared/ui/Button';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { Toast } from '@/shared/ui/Toast';
import { useOnboarding, type Agreement } from './onboarding-context';

const ITEMS: { id: Agreement; label: string; required: boolean; detail?: string }[] = [
  { id: 'age', label: '만 14세 이상입니다. (필수)', required: true },
  {
    id: 'terms',
    label: '서비스 이용약관에 동의 (필수)',
    required: true,
    detail: '/agreement/terms',
  },
  {
    id: 'privacy',
    label: '개인정보 수집 및 이용에 동의 (필수)',
    required: true,
    detail: '/agreement/privacy',
  },
  // TODO: 마케팅 수신 약관 상세 화면은 시안이 나오면 연결한다
  { id: 'marketing', label: '광고 및 마케팅 수신에 동의 (선택)', required: false },
];

const LABEL = 'text-[16px] leading-[26px] tracking-[0.0912px]';
const TOAST_DURATION = 2000;

export function AgreementPage() {
  const navigate = useNavigate();
  const { agreed, setAgreed } = useOnboarding();
  const location = useLocation();
  // 로그인 직후 콜백이 넘겨 준 닉네임. null이면 토스트를 띄우지 않는다
  const [welcome, setWelcome] = useState<string | null>(
    () => (location.state as { welcome?: string } | null)?.welcome ?? null,
  );

  useEffect(() => {
    if (welcome === null) return;
    // 약관 상세를 다녀오거나 새로고침해도 다시 뜨지 않게 history state를 비운다
    void navigate('.', { replace: true, state: null });
    const timer = setTimeout(() => setWelcome(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [welcome, navigate]);

  const allAgreed = agreed.length === ITEMS.length;
  const canNext = ITEMS.every(({ id, required }) => !required || agreed.includes(id));

  const toggleAll = () => setAgreed(allAgreed ? [] : ITEMS.map(({ id }) => id));
  const toggle = (id: Agreement) =>
    setAgreed(agreed.includes(id) ? agreed.filter((item) => item !== id) : [...agreed, id]);

  return (
    <Screen
      header={<Header />}
      footer={
        <>
          {welcome !== null && (
            <div className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2">
              <Toast message={welcome ? `${welcome}님 환영합니다` : '환영합니다'} />
            </div>
          )}
          <Button disabled={!canNext} onClick={() => navigate('/home')}>
            다음
          </Button>
        </>
      }
    >
      <ScreenTitle title="서비스 이용 약관" />
      <div className="mt-5 flex flex-col gap-6 px-4">
        <button type="button" className="flex items-center gap-2 text-left" onClick={toggleAll}>
          <img src={allAgreed ? checkCircleOn : checkCircleOff} alt="" />
          <span className={`${LABEL} font-bold`}>모두 동의(선택 정보 포함)</span>
        </button>
        <ul className="flex flex-col gap-4">
          {ITEMS.map(({ id, label, detail }) => (
            <li key={id} className="flex items-center justify-between">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreed.includes(id)}
                className="flex items-center gap-2 text-left"
                onClick={() => toggle(id)}
              >
                <img src={agreed.includes(id) ? checkOn : checkOff} alt="" />
                <span className={`${LABEL} font-medium`}>{label}</span>
              </button>
              {detail && (
                <button type="button" aria-label="약관 보기" onClick={() => navigate(detail)}>
                  <img src={chevronRight} alt="" />
                </button>
              )}
              {id === 'marketing' && <img src={chevronRight} alt="" />}
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}
