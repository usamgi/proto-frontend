import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/shared/ui/Button';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { TextField } from '@/shared/ui/TextField';
import { useOnboarding } from './onboarding-context';

export function CreateGroupPage() {
  const navigate = useNavigate();
  const { setGroup } = useOnboarding();
  const [name, setName] = useState('');

  const next = () => {
    setGroup({ name: name.trim(), createdAt: new Date() });
    navigate('/group/invite');
  };

  return (
    <Screen
      header={<Header />}
      footer={
        <Button disabled={!name.trim()} onClick={next}>
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
      </div>
    </Screen>
  );
}
