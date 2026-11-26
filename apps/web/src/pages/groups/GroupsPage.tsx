import add from '../../assets/add.svg';
import avatarJisu from '../../assets/avatar-jisu.jpg';
import avatarMinji from '../../assets/avatar-minji.jpg';
import avatarMore from '../../assets/avatar-more.jpg';
import avatarSeoyeon from '../../assets/avatar-seoyeon.jpg';
import avatarYujin from '../../assets/avatar-yujin.jpg';
import blur1 from '../../assets/room-blur-1.jpg';
import blur2 from '../../assets/room-blur-2.jpg';
import blur3 from '../../assets/room-blur-3.jpg';
import sky1 from '../../assets/room-sky-1.jpg';
import sky2 from '../../assets/room-sky-2.jpg';
import sky3 from '../../assets/room-sky-3.jpg';
import sky4 from '../../assets/room-sky-4.jpg';
import { Header } from '../../shared/ui/Header';
import { Screen } from '../../shared/ui/Screen';

interface Room {
  name: string;
  status: string;
  /** 미니 그리드 4칸. null이면 아직 비어 있는 칸 */
  photos: (string | null)[];
  avatars: string[];
  /** 아바타에 다 못 보여 준 인원 */
  more?: number;
  memberCount: number;
}

// TODO: 그룹 기능을 열면 서버 데이터로 바꾼다. 지금은 준비 중 화면의 배경이다
const ROOMS: Room[] = [
  {
    name: '대학 친구들',
    status: '3명 올렸어요',
    photos: [blur1, blur2, blur3, null],
    avatars: [avatarJisu, avatarMinji, avatarSeoyeon, avatarYujin],
    memberCount: 4,
  },
  {
    name: '우리 가족',
    status: '아직 아무도 안 올렸어요',
    photos: [null, null, null, null],
    avatars: [avatarYujin, avatarJisu, avatarMinji, avatarSeoyeon],
    memberCount: 4,
  },
  {
    name: '회사 동기',
    status: '열렸어요 · 새 반응 2',
    photos: [sky1, sky2, sky3, sky4],
    avatars: [avatarJisu, avatarYujin, avatarMinji],
    more: 2,
    memberCount: 5,
  },
];

const FILTERS = [
  { label: '전체 3', active: true },
  { label: '올리지 않음 2', active: false },
  { label: '올림 1', active: false },
];

const AVATAR = 'size-7 rounded-full border border-white shadow-[0_4px_4px_rgba(31,33,36,0.08)]';

export function GroupsPage() {
  return (
    <div className="relative min-h-dvh bg-[#fafafa] bg-[linear-gradient(180deg,rgba(111,186,254,0.192)_0%,rgba(111,186,254,0)_25.51%)]">
      <Screen header={<Header title="그룹" />}>
        <div className="mt-[26px] flex gap-2 px-4">
          {FILTERS.map(({ label, active }) => (
            <span
              key={label}
              className={`flex h-10 items-center rounded-full px-5 text-[14px] leading-[18px] ${
                active
                  ? 'bg-blue font-semibold text-white'
                  : 'border border-fill bg-white font-medium text-navy'
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        <ul className="mt-6 flex flex-col gap-4 px-4">
          {ROOMS.map((room) => (
            <li
              key={room.name}
              className="flex h-[120px] gap-4 rounded-[28px] border border-fill bg-white p-[15px]"
            >
              <div className="grid size-[88px] shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-[18px]">
                {room.photos.map((photo, index) =>
                  photo ? (
                    <img key={index} src={photo} alt="" className="size-full object-cover" />
                  ) : (
                    <div key={index} className="bg-blue" />
                  ),
                )}
              </div>
              <div className="flex min-w-0 flex-col">
                <p className="text-[20px] leading-[23px] font-semibold text-navy">{room.name}</p>
                <p className="mt-[7px] text-[14px] leading-4 font-medium text-[#9aa0ae]">
                  {room.status}
                </p>
                <div className="mt-2.5 flex items-center">
                  {room.avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt=""
                      className={`${AVATAR} object-cover not-first:-ml-1.5`}
                    />
                  ))}
                  {room.more && (
                    <span
                      className={`${AVATAR} relative -ml-1.5 flex items-center justify-center overflow-hidden text-[10.5px] leading-[14px] font-bold text-white`}
                    >
                      <img
                        src={avatarMore}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                      />
                      <span className="absolute inset-0 bg-navy/60" />
                      <span className="relative">+{room.more}</span>
                    </span>
                  )}
                  <span className="ml-2 text-[14px] leading-4 font-medium text-[#9aa0ae]">
                    {room.memberCount}명
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mx-4 mt-4 flex h-14 items-center justify-center gap-4 rounded-[28px] border border-fill bg-white text-[16px] leading-[22px] font-semibold text-navy">
          <img src={add} alt="" />새 방 만들기
        </div>
      </Screen>

      <div className="absolute inset-x-0 top-[calc(56px+env(safe-area-inset-top))] bottom-0 bg-linear-to-b from-white/0 to-white to-90%" />
      <p className="fixed top-1/2 left-1/2 -translate-1/2 rounded-[52px] bg-navy px-3 py-2 text-[18px] leading-[18px] font-semibold tracking-[-0.36px] whitespace-nowrap text-white backdrop-blur-[25px]">
        준비 중입니다!
      </p>
    </div>
  );
}
