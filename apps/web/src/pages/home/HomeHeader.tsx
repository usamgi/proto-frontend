import { Link } from 'react-router';

import { useSwitchMissionRound } from '@/shared/services/mission/use-today-mission';

import { AddRoomPopoverButton, AddRoomSheetButton } from './add-room';
import { BellIcon } from './icons/BellIcon';
import { LogoIcon } from './icons/LogoIcon';
import { PersonIcon } from './icons/PersonIcon';

interface HomeHeaderProps {
  /** 방 추가 메뉴 모양. 촬영 전 홈은 바텀시트, 촬영 후 홈은 + 아래 팝오버입니다(시안). */
  addMenu: 'sheet' | 'popover';
}

/**
 * @description 홈 상단의 로고와 방 추가, 알림, 프로필 버튼.
 *
 * @remarks
 * UT에서는 알림 버튼이 모든 사람의 회차(오늘의 단어)를 바꿉니다. 하루에 두 단어를 쓰기 때문입니다.
 * @internal
 * @name HomeHeader
 * @tag header
 */
export function HomeHeader({ addMenu }: HomeHeaderProps) {
  const { switchRound, isSwitching } = useSwitchMissionRound();

  return (
    <header className="flex h-17 items-center justify-between px-4 py-2.5">
      <h1 className="text-blue">
        <LogoIcon title="USAGI" />
      </h1>
      <div className="flex items-center gap-2 text-navy">
        {addMenu === 'sheet' ? <AddRoomSheetButton /> : <AddRoomPopoverButton />}
        <button
          type="button"
          aria-label="단어 바꾸기"
          disabled={isSwitching}
          onClick={() => void switchRound()}
        >
          <BellIcon />
        </button>
        <Link to="/profile" aria-label="프로필">
          <PersonIcon />
        </Link>
      </div>
    </header>
  );
}
