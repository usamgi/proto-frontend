import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/shared/ui/Button';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { TextField } from '@/shared/ui/TextField';
import { ErrorText } from './ErrorText';
import { createGroup } from './group-api';
import { useOnboarding } from './onboarding-context';

export function CreateGroupPage() {
  const navigate = useNavigate();
  const { setGroup } = useOnboarding();
  const [name, setName] = useState('');
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const next = async () => {
    setPending(true);
    setFailed(false);
    try {
      setGroup(await createGroup(name.trim()));
      void navigate('/nickname');
    } catch {
      setFailed(true);
      setPending(false);
    }
  };

  return (
    <Screen
      header={<Header />}
      footer={
        <Button disabled={!name.trim() || pending} onClick={() => void next()}>
          다음
        </Button>
      }
    >
      <ScreenTitle
        title="그룹 이름을 설정해주세요"
        subtitle={'친구들을 초대하고\n함께 미션을 시작해요'}
      />
      <div className="mt-[172px] px-4">
        <TextField value={name} onChange={setName} />
        {failed && <ErrorText>그룹을 만들지 못했어요. 다시 시도해 주세요</ErrorText>}
      </div>
    </Screen>
  );
}
