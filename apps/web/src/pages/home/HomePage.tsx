import { useWelcomeToast } from '@/shared/auth/use-welcome-toast';
import { useTodayShot } from '@/shared/stores/today-shot';
import { Toast } from '@/shared/ui/Toast';

import { AfterUploadHome } from './AfterUploadHome';
import { BeforeUploadHome } from './BeforeUploadHome';
import { HomeHeader } from './HomeHeader';
import { MOCK_MISSION, MOCK_MY_NICKNAME, MOCK_ROOMS } from './mock/home';

/**
 * @description 오늘의 단어와 참여 현황을 보여 주는 홈 화면.
 *
 * @remarks
 * 오늘 사진을 보냈으면 방 카드가 있는 촬영 후 모습을 보입니다. 보낸 직후 처음 들어오면 칩이 방 카드로 모이는 모션을 한 번 재생합니다.
 * @internal
 * @name HomePage
 * @tag div
 */
export function HomePage() {
  const { word, participants, friends } = MOCK_MISSION;
  const welcome = useWelcomeToast();
  const shot = useTodayShot((state) => state.shot);
  const isIntroPending = useTodayShot((state) => state.isIntroPending);
  const markIntroShown = useTodayShot((state) => state.markIntroShown);

  const beforeUpload = (
    <BeforeUploadHome word={word} participants={participants} friends={friends} />
  );
  const introFrom = isIntroPending ? beforeUpload : null;

  return (
    <div className="relative mx-auto min-h-dvh max-w-100.5 bg-surface pt-[env(safe-area-inset-top)] pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64.25 bg-linear-to-b from-blue/19 to-transparent"
      />
      <div className="relative">
        <HomeHeader addMenu={shot ? 'popover' : 'sheet'} />
        <main>
          {shot ? (
            <AfterUploadHome
              word={word}
              myNickname={MOCK_MY_NICKNAME}
              participants={participants}
              rooms={MOCK_ROOMS}
              shot={shot}
              intro={introFrom}
              onIntroStart={markIntroShown}
            />
          ) : (
            beforeUpload
          )}
        </main>
      </div>
      {welcome && (
        // 하단 탭(TabLayout) 바로 위
        <div className="fixed bottom-[calc(max(31px,env(safe-area-inset-bottom))+96px)] left-1/2 z-10 -translate-x-1/2">
          <Toast message={welcome} />
        </div>
      )}
    </div>
  );
}
