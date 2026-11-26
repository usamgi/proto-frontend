import { HomeHeader } from './HomeHeader';
import { MissionStatus } from './MissionStatus';
import { MissionTitle } from './MissionTitle';
import { MOCK_MISSION } from './mock/home';

/**
 * @description 오늘의 단어와 참여 현황을 보여 주는 홈 화면.
 *
 * @internal
 * @name HomePage
 * @tag div
 */
export function HomePage() {
  const { word, participants } = MOCK_MISSION;

  return (
    <div className="relative mx-auto min-h-dvh max-w-100.5 bg-surface pt-[env(safe-area-inset-top)] pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64.25 bg-linear-to-b from-blue/19 to-transparent"
      />
      <div className="relative">
        <HomeHeader />
        <main className="flex flex-col items-center gap-3.25 pt-4.5">
          <MissionTitle word={word} />
          <MissionStatus participants={participants} />
        </main>
      </div>
    </div>
  );
}
