import { ChipBoard } from './ChipBoard';
import type { Friend, Participant } from './home-mission';
import { MissionStatus } from './MissionStatus';
import { MissionTitle } from './MissionTitle';

interface BeforeUploadHomeProps {
  word: string;
  participants: Participant[];
  friends: Friend[];
}

/**
 * @description 오늘 아직 사진을 보내지 않은 홈. 오늘의 단어, 참여 현황, 칩 보드를 보입니다.
 *
 * @remarks
 * 보낸 직후에는 `AfterUploadHome`이 방 형성 모션의 출발 화면으로도 씁니다.
 * @internal
 * @name BeforeUploadHome
 * @tag div
 */
export function BeforeUploadHome({ word, participants, friends }: BeforeUploadHomeProps) {
  return (
    <div className="flex flex-col items-center gap-3.25 pt-4.5">
      <MissionTitle word={word} />
      <MissionStatus participants={participants} />
      <ChipBoard friends={friends} />
    </div>
  );
}
