import type { Participant } from '@/pages/home/home-mission';
import { MissionWord } from '@/pages/home/mission-word';
import { ParticipantAvatars } from '@/pages/home/ParticipantAvatars';

interface TodaySummaryProps {
  word: string;
  /** 지금 회차에 사진을 올린 사람들. 나를 포함합니다. */
  doneToday: Participant[];
}

/**
 * @description 촬영 후 홈 위쪽의 오늘의 단어와 오늘 올린 사람 묶음.
 *
 * @remarks
 * 방 형성 모션이 `data-intro="today"`로 이 부분을 찾아 마지막에 나타나게 합니다.
 * @internal
 * @name TodaySummary
 * @tag section
 */
export function TodaySummary({ word, doneToday }: TodaySummaryProps) {
  return (
    <section data-intro="today" className="flex flex-col gap-3 px-4">
      <div className="flex flex-col gap-1">
        <p className="text-body-18 font-semibold text-navy/40">오늘의 단어</p>
        <MissionWord word={word} placement="after" />
      </div>
      <div className="flex items-center gap-1.75">
        <ParticipantAvatars participants={doneToday} />
        <p className="text-body-14 font-medium tracking-normal text-ink-mute">
          {doneToday.length}명 완료
        </p>
      </div>
    </section>
  );
}
