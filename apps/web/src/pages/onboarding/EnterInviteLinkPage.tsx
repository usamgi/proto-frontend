import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import link from '@/assets/link.svg';
import { Button } from '@/shared/ui/Button';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { TextField } from '@/shared/ui/TextField';
import { ErrorText } from './ErrorText';
import { joinGroup } from './group-api';
import { useOnboarding } from './onboarding-context';

export function EnterInviteLinkPage() {
  const navigate = useNavigate();
  const { setGroup } = useOnboarding();
  const [searchParams] = useSearchParams();
  // 초대 링크(/join?code=)로 바로 들어오면 코드를 미리 채운다
  const [value, setValue] = useState(searchParams.get('code') ?? '');
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  // 그룹은 멤버만 읽을 수 있어서, 확인 화면에 그룹을 보여 주려면 여기서 먼저 들어간다
  const next = async () => {
    setPending(true);
    setFailed(false);
    try {
      setGroup(await joinGroup(value));
      void navigate('/nickname', { state: { joined: true } });
    } catch {
      setFailed(true);
      setPending(false);
    }
  };

  return (
    <Screen
      header={<Header />}
      footer={
        <Button disabled={!value.trim() || pending} onClick={() => void next()}>
          다음
        </Button>
      }
    >
      <ScreenTitle title={'초대받은 링크를\n입력해주세요'} />
      <div className="mt-[200px] px-4">
        <TextField
          value={value}
          onChange={setValue}
          placeholder="초대 링크를 입력해주세요"
          icon={link}
        />
        {failed && <ErrorText>초대 링크를 다시 확인해 주세요</ErrorText>}
      </div>
    </Screen>
  );
}
