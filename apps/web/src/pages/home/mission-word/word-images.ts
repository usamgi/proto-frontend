import rockPaperScissorsAfter from './rock-paper-scissors-after.svg';
import rockPaperScissorsBefore from './rock-paper-scissors-before.svg';
import yellowAfter from './yellow-after.svg';
import yellowBefore from './yellow-before.svg';

/** 단어 그림을 쓰는 자리. 촬영 전 홈(`before`)이 촬영 후 홈(`after`)보다 큽니다. */
export type WordPlacement = 'before' | 'after';

/** 디자이너가 단어마다 글꼴을 달리해 그림으로 준 단어들. 여기 없는 단어는 화면이 글자로 그립니다. */
export const WORD_IMAGES: Record<string, Record<WordPlacement, string> | undefined> = {
  노랑: { before: yellowBefore, after: yellowAfter },
  가위바위보: { before: rockPaperScissorsBefore, after: rockPaperScissorsAfter },
};
