import { NavLink, Outlet } from 'react-router';

import tabCamera from '@/assets/tab-camera.svg';
import tabGroupsFill from '@/assets/tab-groups-fill.svg';
import tabGroups from '@/assets/tab-groups.svg';
import tabHomeFill from '@/assets/tab-home-fill.svg';
import tabHome from '@/assets/tab-home.svg';

const TAB = 'flex flex-1 flex-col items-center gap-0.5 rounded-[40px] px-5 py-3';
const LABEL = 'text-[13px] leading-[14px] font-medium tracking-[-0.26px] text-navy';

/** 하단 탭이 붙는 화면들의 레이아웃 */
export function TabLayout() {
  return (
    <>
      <Outlet />
      <nav className="fixed bottom-[max(31px,env(safe-area-inset-bottom))] left-1/2 z-10 flex w-[calc(100%-32px)] max-w-[370px] -translate-x-1/2 gap-1.5 rounded-[36px] bg-white p-1.5 drop-shadow-[0_0_6px_rgba(31,33,36,0.08)]">
        <NavLink
          to="/home"
          className={({ isActive }) => `${TAB} ${isActive || isProfile ? 'bg-navy/8' : ''}`}
        >
          {({ isActive }) => (
            <>
              <img src={isActive || isProfile ? tabHomeFill : tabHome} alt="" className="size-7" />
              <span className={LABEL}>홈</span>
            </>
          )}
        </NavLink>
        <NavLink to="/camera" className={TAB}>
          <img src={tabCamera} alt="" className="size-7" />
          <span className={LABEL}>카메라</span>
        </NavLink>
        <NavLink to="/groups" className={({ isActive }) => `${TAB} ${isActive ? 'bg-navy/8' : ''}`}>
          {({ isActive }) => (
            <>
              <img src={isActive ? tabGroupsFill : tabGroups} alt="" className="size-7" />
              <span className={LABEL}>그룹</span>
            </>
          )}
        </NavLink>
      </nav>
    </>
  );
}
