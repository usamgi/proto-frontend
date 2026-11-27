import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAuth } from '@/shared/auth/auth-context';
import { Button } from '@/shared/ui/Button';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { TextField } from '@/shared/ui/TextField';
import { ErrorText } from './ErrorText';
import { updateNickname } from './group-api';

export function NicknamePage() {
  const navigate = useNavigate();
  const joined = useLocation().state?.joined === true;
  const { session } = useAuth();
  const [nickname, setNickname] = useState('');
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const next = async () => {
    if (!session) return;

    setPending(true);
    setFailed(false);
    try {
      await updateNickname(session.user.id, nickname.trim());
      void navigate(joined ? '/join/confirm' : '/group/done');
    } catch {
      setFailed(true);
      setPending(false);
    }
  };

  return (
    <Screen
      header={<Header />}
      footer={
        <Button disabled={!nickname.trim() || pending} onClick={() => void next()}>
          다음
        </Button>
      }
    >
      <ScreenTitle title="닉네임을 설정해주세요" subtitle="이 그룹에서만 사용하는 닉네임이에요" />
      <div className="mt-[200px] px-4">
        <TextField value={nickname} onChange={setNickname} />
        {failed && <ErrorText>닉네임을 저장하지 못했어요. 다시 시도해 주세요</ErrorText>}
      </div>
    </Screen>
  );
}
