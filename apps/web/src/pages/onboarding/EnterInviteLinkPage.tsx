import { useState } from 'react';
import { useNavigate } from 'react-router';

import link from '../../assets/link.svg';
import { Button } from '../../shared/ui/Button';
import { Header } from '../../shared/ui/Header';
import { Screen } from '../../shared/ui/Screen';
import { ScreenTitle } from '../../shared/ui/ScreenTitle';
import { TextField } from '../../shared/ui/TextField';

export function EnterInviteLinkPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  return (
    <Screen
      header={<Header />}
      footer={
        <Button
          disabled={!value.trim()}
          onClick={() => navigate('/nickname', { state: { joined: true } })}
        >
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
      </div>
    </Screen>
  );
}
