import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import { useAuth } from '@/shared/auth/auth-context';
import { Button } from '@/shared/ui/Button';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { ScreenTitle } from '@/shared/ui/ScreenTitle';
import { fetchGroupMembers, type GroupMember } from './group-api';
import { GroupSummary } from './GroupSummary';
import { useOnboarding } from './onboarding-context';

/** 겹쳐 보여 주는 멤버 얼굴 수. 나머지는 +N으로 센다 */
const SHOWN_MEMBERS = 3;

function MemberFace({ member }: { member: GroupMember }) {
  return (
    <span className="-ml-2.5 flex size-8 items-center justify-center rounded-full border-[1.6px] border-white bg-sky text-[12px] leading-4 font-bold text-navy first:ml-0">
      {member.nickname.charAt(0)}
    </span>
  );
}

export function JoinGroupPage() {
  const navigate = useNavigate();
  const { group } = useOnboarding();
  const { session } = useAuth();
  const [allMembers, setAllMembers] = useState<GroupMember[]>([]);
  // 방금 들어간 나는 기다리는 친구에서 뺀다
  const members = allMembers.filter((member) => member.id !== session?.user.id);

  useEffect(() => {
    if (!group) return;
    void fetchGroupMembers(group.id)
      .then(setAllMembers)
      .catch(() => setAllMembers([]));
  }, [group]);

  if (!group) return <Navigate to="/join" replace />;

  // 들어가기는 초대 링크를 입력할 때 이미 했다. 여기서는 홈으로만 간다
  const join = () => navigate('/home');
  const hiddenCount = members.length - SHOWN_MEMBERS;

  return (
    <Screen header={<Header />} footer={<Button onClick={join}>그룹 참여하기</Button>}>
      <ScreenTitle title={`[${group.name}] 그룹에\n참여할까요?`} />
      <div className="mt-[126px]">
        <GroupSummary group={group}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex">
              {members.slice(0, SHOWN_MEMBERS).map((member) => (
                <MemberFace key={member.id} member={member} />
              ))}
              {hiddenCount > 0 && (
                <span className="-ml-2.5 flex size-8 items-center justify-center rounded-full border-[1.5px] border-white bg-[#616264] text-[12px] leading-4 font-bold text-white">
                  +{hiddenCount}
                </span>
              )}
            </div>
            <p className="text-[14px] font-medium tracking-[-0.168px] text-blue">
              {members.length}명의 친구들이 기다리고 있어요
            </p>
          </div>
        </GroupSummary>
      </div>
    </Screen>
  );
}
