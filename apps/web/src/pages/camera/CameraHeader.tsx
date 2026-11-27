import { Link } from 'react-router';

import { BackIcon } from './icons/BackIcon';

const CHIP = 'flex items-center justify-center rounded-full bg-white/20';

interface CameraHeaderProps {
  /** 오늘의 단어. 아직 못 읽었으면 비워 둡니다. */
  keyword: string | undefined;
  /** `true`면 뒤로 가기를 막습니다. 사진을 올리는 동안 씁니다. */
  isLeaveBlocked: boolean;
}

/**
 * @description 촬영 화면 위쪽의 뒤로 가기와 오늘의 단어.
 *
 * @internal
 * @name CameraHeader
 * @tag header
 */
export function CameraHeader({ keyword, isLeaveBlocked }: CameraHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      {isLeaveBlocked ? (
        <span aria-hidden className={`${CHIP} size-11 opacity-50`}>
          <BackIcon className="size-6 text-white" />
        </span>
      ) : (
        <Link to="/home" aria-label="뒤로 가기" className={`${CHIP} size-11`}>
          <BackIcon className="size-6 text-white" />
        </Link>
      )}
      <p className={`${CHIP} h-11 px-4 text-reading-16 font-medium text-white`}>{keyword}</p>
      <span aria-hidden className="size-11" />
    </header>
  );
}
