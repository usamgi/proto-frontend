import { useAuth } from '@/shared/auth/auth-context';
import { useWelcomeToast } from '@/shared/auth/use-welcome-toast';
import { useTodayMission, useTodayMissionSync } from '@/shared/services/mission/use-today-mission';
import { useTodayShot } from '@/shared/stores/today-shot';
import { Toast } from '@/shared/ui/Toast';

import { AfterUploadHome } from './after-upload-home';
import { BeforeUploadHome } from './BeforeUploadHome';
import type { HomeData } from './home-mission';
import { HomeHeader } from './HomeHeader';
import { useHomeData } from './use-home-data';

function HomeBody({ word, data }: { word: string; data: HomeData }) {
  const isIntroPending = useTodayShot((state) => state.isIntroPending);
  const markIntroShown = useTodayShot((state) => state.markIntroShown);

  const beforeUpload = (
    <BeforeUploadHome word={word} participants={data.participants} friends={data.friends} />
  );

  if (!data.hasSent) return beforeUpload;

  return (
    <AfterUploadHome
      word={word}
      myNickname={data.myNickname}
      participants={data.participants}
      rooms={data.rooms}
      intro={isIntroPending ? beforeUpload : null}
      onIntroStart={markIntroShown}
    />
  );
}

function StatusMessage({ children }: { children: string }) {
  return <p className="pt-40 text-center text-body-16 font-medium text-ink-mute">{children}</p>;
}

/**
 * @description 오늘 지금 회차의 단어와 내 방들의 사진을 보여 주는 홈 화면.
 *
 * @remarks
 * 같은 회차에 다른 방으로 또 보낸 직후에는 새로 읽은 내용이 올 때까지 비워 둡니다. 전에 읽어 둔 방 카드로 모션을 시작하면 도중에 카드가 바뀌기 때문입니다.
 * @internal
 * @name HomePage
 * @tag div
 */
export function HomePage() {
  const welcome = useWelcomeToast();
  const { session } = useAuth();
  const { mission, status: missionStatus } = useTodayMission();
  const home = useHomeData(session?.user.id ?? '', mission?.id ?? null);
  const isIntroPending = useTodayShot((state) => state.isIntroPending);
  useTodayMissionSync();

  function renderBody() {
    if (missionStatus === 'missing')
      return <StatusMessage>오늘의 단어가 아직 없어요</StatusMessage>;
    if (missionStatus === 'error' || home.status === 'error') {
      return <StatusMessage>불러오지 못했어요. 잠시 뒤 다시 열어 주세요</StatusMessage>;
    }
    if (!mission || home.status === 'loading') return null;
    if (isIntroPending && home.isRemembered && home.data.hasSent) return null;

    return <HomeBody key={mission.id} word={mission.keyword} data={home.data} />;
  }

  return (
    <div className="relative mx-auto min-h-dvh max-w-100.5 bg-surface pt-[env(safe-area-inset-top)] pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64.25 bg-linear-to-b from-blue/19 to-transparent"
      />
      <div className="relative">
        <HomeHeader addMenu={home.status === 'ready' && home.data.hasSent ? 'popover' : 'sheet'} />
        <main>{renderBody()}</main>
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
