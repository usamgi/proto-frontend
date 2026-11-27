import { WORD_IMAGES, type WordPlacement } from './word-images';

/** 이 글자 수부터는 큰 글자로 화면 폭에 여유가 없어 작은 크기로 그립니다. 그림이 없는 단어에만 씁니다. */
const LONG_WORD_LENGTH = 5;

/** 단어를 그리는 자리. 방 상세(`detail`)는 촬영 후 홈의 그림을 줄여서 씁니다. */
type Placement = WordPlacement | 'detail';

/** 시안에서 글자로 그렸을 때의 줄 높이입니다. 그림은 이보다 낮아서, 이 높이를 잡아 두어야 아래 내용이 시안 자리에 옵니다. */
const BOX: Record<Placement, string> = {
  before: 'h-[84.933px] justify-center',
  after: 'h-[65.948px]',
  detail: 'h-[53.077px]',
};

function textSize(word: string, placement: Placement) {
  if (placement === 'detail') return 'text-[48px] leading-[53.077px] tracking-[-0.6449px]';
  if (placement === 'after') return 'text-word-md';

  return word.length >= LONG_WORD_LENGTH ? 'text-word-sm' : 'text-word';
}

interface MissionWordProps {
  /** 오늘의 단어. 그림이 있어도 화면 읽기 프로그램에는 이 글자로 읽힙니다. */
  word: string;
  /** 단어를 그리는 자리. 자리에 따라 크기와 정렬이 달라집니다. */
  placement: Placement;
}

/**
 * @description 오늘의 단어. 디자이너가 준 그림이 있으면 그림으로, 없으면 글자로 그립니다.
 *
 * @remarks
 * 그림은 단어마다 높이가 달라 SVG에 적힌 크기 그대로 그립니다.
 * @internal
 * @name MissionWord
 * @tag p
 */
export function MissionWord({ word, placement }: MissionWordProps) {
  const image = WORD_IMAGES[word]?.[placement === 'detail' ? 'after' : placement];

  return (
    <p className={`flex max-w-full items-center font-bold text-navy ${BOX[placement]}`}>
      {image ? (
        <img
          src={image}
          alt={word}
          className={placement === 'detail' ? 'h-full w-auto' : 'h-auto max-w-full'}
        />
      ) : (
        <span className={textSize(word, placement)}>{word}</span>
      )}
    </p>
  );
}
