import { AddIcon } from './icons/AddIcon';
import { BellIcon } from './icons/BellIcon';
import { LogoIcon } from './icons/LogoIcon';
import { PersonIcon } from './icons/PersonIcon';

/**
 * @description 홈 상단의 로고와 방 추가, 알림, 프로필 버튼.
 *
 * @remarks
 * 세 버튼이 가는 화면은 아직 없어 눌러도 아무 일이 없습니다.
 * @internal
 * @name HomeHeader
 * @tag header
 */
export function HomeHeader() {
  return (
    <header className="flex h-17 items-center justify-between px-4 py-2.5">
      <h1 className="text-blue">
        <LogoIcon title="USAGI" />
      </h1>
      <div className="flex items-center gap-2 text-navy">
        <button type="button" aria-label="방 추가">
          <AddIcon />
        </button>
        <button type="button" aria-label="알림">
          <BellIcon />
        </button>
        <button type="button" aria-label="프로필">
          <PersonIcon />
        </button>
      </div>
    </header>
  );
}
