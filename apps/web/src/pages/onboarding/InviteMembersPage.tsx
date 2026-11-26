import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import close from '@/assets/close-24.svg';
import contentCopy from '@/assets/content-copy.svg';
import inviteQr from '@/assets/invite-qr.svg';
import kakaoLogo from '@/assets/kakao-logo.svg';
import qrCode from '@/assets/qr-code.svg';
import { Button } from '@/shared/ui/Button';
import { GroupAvatar } from '@/shared/ui/GroupAvatar';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { Toast } from '@/shared/ui/Toast';
import { useOnboarding } from './onboarding-context';

/** 서버 연동 전까지 쓰는 가짜 초대 링크 */
const INVITE_LINK = `${window.location.origin}/invite/u3k9x2`;
const TOAST_DURATION = 2000;

export function InviteMembersPage() {
  const navigate = useNavigate();
  const { group } = useOnboarding();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!group) return <Navigate to="/group/new" replace />;

  const copyLink = () => {
    void navigator.clipboard.writeText(INVITE_LINK).then(() => setCopied(true));
  };

  return (
    <Screen
      header={<Header />}
      footer={
        <>
          {copied && (
            <div className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2">
              <Toast message="링크 복사 완료" />
            </div>
          )}
          <Button onClick={() => navigate('/nickname')}>닉네임 설정하기</Button>
        </>
      }
    >
      <ScreenTitle
        title={`‘${group.name}’ 그룹이\n만들어졌어요`}
        subtitle={'친구들을 초대하고\n함께 미션을 시작해요'}
      />
      <div className="mt-[68px] flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-2">
          <p className="text-[13px] leading-[18px] font-semibold text-ink-sub">초대 링크</p>
          <div className="flex h-[54px] items-center gap-1.5 rounded-full bg-fill px-5">
            <p className="flex-1 truncate text-[16px] leading-[38px] font-medium text-ink/40">
              {INVITE_LINK}
            </p>
            <button type="button" aria-label="초대 링크 복사" onClick={copyLink}>
              <img src={contentCopy} alt="" />
            </button>
          </div>
        </div>
        {/* TODO: 카카오 SDK 연동 */}
        <Button variant="kakao" size="md" icon={kakaoLogo}>
          카카오톡으로 공유하기
        </Button>
        <Button variant="outline" size="md" icon={qrCode} onClick={() => setQrOpen(true)}>
          QR코드로 초대하기
        </Button>
      </div>

      {qrOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-navy/40"
          onClick={() => setQrOpen(false)}
        >
          <div
            role="dialog"
            aria-modal
            aria-label="QR코드로 초대하기"
            className="relative flex h-[280px] w-[254px] flex-col items-center gap-4 rounded-3xl bg-[#fafafa] pt-[34px]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="닫기"
              className="absolute top-4 right-4"
              onClick={() => setQrOpen(false)}
            >
              <img src={close} alt="" />
            </button>
            <div className="flex flex-col items-center">
              <GroupAvatar name={group.name} />
              <p className="text-[16px] leading-[28px] font-semibold tracking-[-0.192px]">
                {group.name}
              </p>
            </div>
            {/* TODO: 실제 초대 링크로 QR 생성 */}
            <img src={inviteQr} alt="초대 QR코드" />
          </div>
        </div>
      )}
    </Screen>
  );
}
