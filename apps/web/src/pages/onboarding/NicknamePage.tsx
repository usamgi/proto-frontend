import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Button } from '../../shared/ui/Button';
import { Header } from '../../shared/ui/Header';
import { Screen } from '../../shared/ui/Screen';
import { ScreenTitle } from '../../shared/ui/ScreenTitle';
import { TextField } from '../../shared/ui/TextField';

export function NicknamePage() {
  const navigate = useNavigate();
  const joined = useLocation().state?.joined === true;
  const [nickname, setNickname] = useState('');

  // TODO: 참여한 사람은 홈으로 보낸다. 홈 화면이 생기기 전까지는 로그인으로 돌아간다
  const next = () => navigate(joined ? '/login' : '/group/done');

  return (
    <Screen
      header={<Header />}
      footer={
        <Button disabled={!nickname.trim()} onClick={next}>
          다음
        </Button>
      }
    >
      <ScreenTitle title="닉네임을 설정해주세요" subtitle="이 그룹에서만 사용하는 닉네임이에요" />
      <div className="mt-[200px] px-4">
        <TextField value={nickname} onChange={setNickname} />
      </div>
    </Screen>
  );
}
