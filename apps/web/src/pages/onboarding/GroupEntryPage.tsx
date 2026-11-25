import { useNavigate } from 'react-router';

import arrowForward from '../../assets/arrow-forward-ios.svg';
import { Header } from '../../shared/ui/Header';
import { Screen } from '../../shared/ui/Screen';
import { ScreenTitle } from '../../shared/ui/ScreenTitle';

const CHOICES = [
  {
    title: '그룹 만들기',
    description: '새로운 그룹을 만들고 친구들을 초대해요',
    to: '/group/new',
    className: 'bg-blue/20',
  },
  {
    title: '초대 링크로 참여하기',
    description: '친구가 보낸 링크로 그룹에 참여해요',
    to: '/join',
    className: 'bg-fill',
  },
];

export function GroupEntryPage() {
  const navigate = useNavigate();

  return (
    <Screen header={<Header />}>
      <ScreenTitle title={'친구들과 함께\n사진 미션을 시작해보세요'} />
      <div className="mt-[119px] flex flex-col gap-6 px-5">
        {CHOICES.map(({ title, description, to, className }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            className={`flex items-center gap-1.5 rounded-3xl p-5 text-left ${className}`}
          >
            <span className="flex flex-1 flex-col gap-1.5">
              <span className="text-[20px] leading-[38px] font-bold">{title}</span>
              <span className="text-[16px] leading-[1.4] font-medium">{description}</span>
            </span>
            <img src={arrowForward} alt="" />
          </button>
        ))}
      </div>
    </Screen>
  );
}
