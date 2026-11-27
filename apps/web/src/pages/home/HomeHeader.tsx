import { Link } from 'react-router';

import { AddRoomPopoverButton, AddRoomSheetButton } from './add-room';
import { BellIcon } from './icons/BellIcon';
import { LogoIcon } from './icons/LogoIcon';
import { PersonIcon } from './icons/PersonIcon';

interface HomeHeaderProps {
  /** 방 추가 메뉴 모양. 촬영 전 홈은 바텀시트, 촬영 후 홈은 + 아래 팝오버입니다(시안). */
  addMenu: 'sheet' | 'popover';
  /** 속한 방이 하나도 없으면 `true`. 바텀시트일 때만 쓰고, 시트를 스스로 엽니다. */
  isFirstStart: boolean;
}

/**
 * @description 홈 상단의 로고와 방 추가, 알림, 프로필 버튼.
 *
 * @remarks
 * 알림은 가는 화면이 아직 없어 눌러도 아무 일이 없습니다.
 * @internal
 * @name HomeHeader
 * @tag header
 */
export function HomeHeader({ addMenu, isFirstStart }: HomeHeaderProps) {
  return (
    <header className="flex h-17 items-center justify-between px-4 py-2.5">
      <h1 className="text-blue">
        <LogoIcon title="USAGI" />
      </h1>
      <div className="flex items-center gap-2 text-navy">
        {addMenu === 'sheet' ? (
          <AddRoomSheetButton isFirstStart={isFirstStart} />
        ) : (
          <AddRoomPopoverButton />
        )}
        <button type="button" aria-label="알림">
          <BellIcon />
        </button>
        <Link to="/profile" aria-label="프로필">
          <PersonIcon />
        </Link>
      </div>
    </header>
  );
}
