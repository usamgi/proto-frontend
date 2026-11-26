/** 이 글자 수부터는 82px로 화면 폭에 여유가 없어 작은 크기로 그립니다. */
const LONG_WORD_LENGTH = 5;

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
  const wordSize = word.length >= LONG_WORD_LENGTH ? 'text-word-sm' : 'text-word';

  return (
    <div className="flex flex-col items-center gap-1.75">
      <p className="text-body-18 font-semibold text-navy/40">오늘의 단어</p>
      <p className={`font-word font-normal text-navy ${wordSize}`}>{word}</p>
    </div>
  );
}
