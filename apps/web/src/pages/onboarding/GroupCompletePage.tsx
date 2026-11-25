import { Navigate, useNavigate } from 'react-router';

import { Button } from '../../shared/ui/Button';
import { Header } from '../../shared/ui/Header';
import { Screen } from '../../shared/ui/Screen';
import { ScreenTitle } from '../../shared/ui/ScreenTitle';
import { GroupSummary } from './GroupSummary';
import { useOnboarding } from './onboarding-context';

export function GroupCompletePage() {
  const navigate = useNavigate();
  const { group } = useOnboarding();

  if (!group) return <Navigate to="/group" replace />;

  // TODO: 홈 화면을 만들면 홈으로 보낸다
  const finish = () => navigate('/login');

  return (
    <Screen header={<Header onClose={finish} />} footer={<Button onClick={finish}>완료</Button>}>
      <ScreenTitle
        title="그룹이 만들어졌어요"
        subtitle={'친구들을 기다리며\n오늘의 미션을 기록해보세요'}
      />
      <div className="mt-[98px]">
        <GroupSummary group={group}>
          <p className="text-[14px] font-medium tracking-[-0.168px] text-blue">
            아직 친구들을 기다리고 있어요
          </p>
        </GroupSummary>
      </div>
    </Screen>
  );
}
