import { useNavigate } from 'react-router';

import avatarJisu from '../../assets/avatar-jisu.jpg';
import avatarMinji from '../../assets/avatar-minji.jpg';
import avatarSeoyeon from '../../assets/avatar-seoyeon.jpg';
import { Button } from '../../shared/ui/Button';
import { Header } from '../../shared/ui/Header';
import { Screen } from '../../shared/ui/Screen';
import { ScreenTitle } from '../../shared/ui/ScreenTitle';
import { GroupSummary } from './GroupSummary';
import { INVITED_GROUP } from './onboarding-context';

/** 서버 연동 전까지 쓰는 가짜 멤버 */
const MEMBER_AVATARS = [avatarJisu, avatarMinji, avatarSeoyeon];
const MEMBER_COUNT = 5;

export function JoinGroupPage() {
  const navigate = useNavigate();
  const join = () => navigate('/home');

  return (
    <Screen header={<Header />} footer={<Button onClick={join}>그룹 참여하기</Button>}>
      <ScreenTitle title={`[${INVITED_GROUP.name}] 그룹에\n참여할까요?`} />
      <div className="mt-[126px]">
        <GroupSummary group={INVITED_GROUP}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex">
              {MEMBER_AVATARS.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="-ml-2.5 size-8 rounded-full border-[1.6px] border-white object-cover first:ml-0"
                />
              ))}
              <span className="-ml-2.5 flex size-8 items-center justify-center rounded-full border-[1.5px] border-white bg-[#616264] text-[12px] leading-4 font-bold text-white">
                +{MEMBER_COUNT - MEMBER_AVATARS.length}
              </span>
            </div>
            <p className="text-[14px] font-medium tracking-[-0.168px] text-blue">
              {MEMBER_COUNT}명의 친구들이 기다리고 있어요
            </p>
          </div>
        </GroupSummary>
      </div>
    </Screen>
  );
}
