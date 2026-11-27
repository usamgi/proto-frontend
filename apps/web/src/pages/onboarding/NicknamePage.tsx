import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { fetchProfile } from '@/shared/api/profile';
import { useAuth } from '@/shared/auth/auth-context';
import { Button } from '@/shared/ui/Button';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { TextField } from '@/shared/ui/TextField';

import { ErrorText } from './ErrorText';
import { updateGroupNickname } from './group-api';
import { useOnboarding } from './onboarding-context';

/** 방을 만들거나 들어간 뒤 그 방에서만 쓸 닉네임을 정한다 */
export function NicknamePage() {
  const navigate = useNavigate();
  const joined = useLocation().state?.joined === true;
  const { session } = useAuth();
  const { group } = useOnboarding();
  const [nickname, setNickname] = useState('');
  // 입력을 비워 두면 그룹 닉네임을 저장하지 않고, 이 프로필 이름(소셜 로그인 이름)이 보인다
  const [name, setName] = useState('');
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const userId = session?.user.id;
  useEffect(() => {
    if (userId) void fetchProfile(userId).then((profile) => setName(profile?.name ?? ''));
  }, [userId]);

  // 새로고침으로 만들거나 들어간 그룹을 잃으면 저장할 곳이 없다
  if (!group) return <Navigate to="/home" replace />;

  const next = async () => {
    if (!userId) return;

    setPending(true);
    setFailed(false);
    try {
      if (nickname.trim()) await updateGroupNickname(group.id, userId, nickname.trim());
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
        <Button disabled={pending} onClick={() => void next()}>
          다음
        </Button>
      }
    >
      <ScreenTitle title="닉네임을 설정해주세요" subtitle="이 그룹에서만 사용하는 닉네임이에요" />
      <div className="mt-[200px] px-4">
        <TextField value={nickname} onChange={setNickname} placeholder={name} />
        {failed && <ErrorText>닉네임을 저장하지 못했어요. 다시 시도해 주세요</ErrorText>}
      </div>
    </Screen>
  );
}
