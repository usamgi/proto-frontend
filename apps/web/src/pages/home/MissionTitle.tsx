import { MissionWord } from './mission-word';

interface MissionTitleProps {
  /** 오늘의 단어 */
  word: string;
}

/**
 * @description "오늘의 단어" 라벨과 단어.
 *
 * @internal
 * @name MissionTitle
 * @tag div
 */
export function MissionTitle({ word }: MissionTitleProps) {
  return (
    <div className="flex max-w-full flex-col items-center gap-1.75">
      <p className="text-body-18 font-semibold text-navy/40">오늘의 단어</p>
      <MissionWord word={word} placement="before" />
    </div>
  );
}
