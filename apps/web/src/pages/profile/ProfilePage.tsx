import avatarYujin from '@/assets/avatar-yujin.jpg';
import edit from '@/assets/edit.svg';
import blur1 from '@/assets/room-blur-1.jpg';
import blur2 from '@/assets/room-blur-2.jpg';
import blur3 from '@/assets/room-blur-3.jpg';
import sky1 from '@/assets/room-sky-1.jpg';
import sky2 from '@/assets/room-sky-2.jpg';
import sky3 from '@/assets/room-sky-3.jpg';
import sky4 from '@/assets/room-sky-4.jpg';
import { supabase } from '@/shared/api/supabase';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';

// TODO: 프로필 기능을 열면 서버 데이터로 바꾼다. 지금은 준비 중 화면의 배경이다
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
/** 2026년 11월. 1일이 일요일이라 앞에 빈칸이 없다 */
const DAYS_IN_MONTH = 30;
const TODAY = 22;
const PHOTOS = [sky1, sky2, sky3, sky4, blur1, blur2, blur3];
const PHOTO_DAYS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 20, 21];

function CalendarDay({ day }: { day: number }) {
  const photoIndex = PHOTO_DAYS.indexOf(day);

  if (photoIndex !== -1) {
    return (
      <div className="relative h-[41px] overflow-hidden rounded-[10px]">
        <img src={PHOTOS[photoIndex % PHOTOS.length]} alt="" className="size-full object-cover" />
        <span className="absolute top-[26px] right-1 text-[9px] leading-3 font-bold text-white">
          {day}
        </span>
      </div>
    );
  }
  if (day === TODAY) {
    return (
      <div className="flex h-[41px] items-center justify-center rounded-[10px] border-2 border-blue bg-white text-[13px] leading-[17px] font-bold text-[#2b7fd6]">
        {day}
      </div>
    );
  }
  return (
    <div className="flex h-[41px] items-center justify-center text-[12px] leading-4 text-[#b0b6c2]">
      {day}
    </div>
  );
}

export function ProfilePage() {
  return (
    <div className="relative isolate mx-auto min-h-dvh max-w-100.5 bg-[#fafafa]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[calc(68px+env(safe-area-inset-top))] bg-white" />
      <Screen
        header={
          <div className="px-4 py-2.5">
            <Header title="프로필" />
          </div>
        }
      >
        <div className="mt-6 flex items-start gap-3.5 px-4">
          <img
            src={avatarYujin}
            alt=""
            className="size-16 rounded-full border border-white object-cover shadow-[0_4px_4px_rgba(31,33,36,0.08)]"
          />
          <div className="pt-1.5">
            <p className="flex items-center gap-1 text-[20px] leading-7 font-semibold text-navy">
              유진
              <img src={edit} alt="" />
            </p>
            <p className="mt-0.5 text-[14px] leading-[18px] font-medium text-ink-mute">
              방 3개 · 지금까지 올린 사진 18장
            </p>
          </div>
        </div>

        <section className="mx-4 mt-4 flex flex-col gap-[7px] rounded-3xl border-[0.4px] border-white bg-white p-4">
          <div className="flex h-[22px] items-center justify-between">
            <h2 className="text-[18px] leading-[22px] font-semibold text-navy">11월</h2>
            <p className="text-[14px] leading-[18px] font-medium text-[#2b7fd6]">이번 달 18장</p>
          </div>
          <div className="grid grid-cols-7 gap-x-[8.5px] text-center text-[12px] leading-[15px] font-medium text-ink-mute">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-x-[8.5px] gap-y-[5px]">
            {Array.from({ length: DAYS_IN_MONTH }, (_, index) => (
              <CalendarDay key={index} day={index + 1} />
            ))}
          </div>
        </section>
      </Screen>

      <div className="absolute inset-x-0 top-[calc(142px+env(safe-area-inset-top))] bottom-0 bg-linear-to-b from-white/0 via-white/90 via-33% to-white to-67%" />
      <div className="absolute inset-x-0 top-[calc(172px+env(safe-area-inset-top))] bottom-0 bg-linear-to-b from-white/0 to-white to-90%" />
      <p className="fixed top-1/2 left-1/2 -translate-1/2 text-[24px] leading-[18px] font-semibold tracking-[-0.48px] whitespace-nowrap text-navy opacity-60">
        아직 준비 중입니다 :)
      </p>
      {/* 하단 탭(TabLayout) 위 43px */}
      <button
        type="button"
        onClick={() => void supabase.auth.signOut()}
        className="fixed bottom-[calc(max(31px,env(safe-area-inset-bottom))+123px)] left-1/2 flex h-9 -translate-x-1/2 items-center rounded-full bg-navy px-5 text-[14px] leading-[26px] font-medium tracking-[0.0798px] text-white"
      >
        로그아웃 (임시)
      </button>
    </div>
  );
}
