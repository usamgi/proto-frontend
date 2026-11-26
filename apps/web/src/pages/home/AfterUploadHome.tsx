import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import type { TodayShot } from '@/shared/stores/today-shot';

import type { Participant, Room, RoomMember } from './home-mission';
import { ParticipantAvatars } from './ParticipantAvatars';
import { RoomCard } from './RoomCard';
import { RoomCarousel } from './RoomCarousel';
import { useRoomIntro } from './use-room-intro';

/** 11/25 회의: 방 카드는 최대 4개입니다. */
const MAX_ROOMS = 4;
/** 방 카드 네 칸 가운데 내 칸을 뺀 친구 칸 수 */
const FRIEND_CELLS = 3;

function pickRandom<T>(items: T[], count: number) {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swap]] = [pool[swap], pool[index]];
  }

  return pool.slice(0, count);
}

function cellsOf(me: RoomMember, friends: RoomMember[]) {
  return [me, ...friends, ...Array.from({ length: FRIEND_CELLS - friends.length }, () => null)];
}

interface AfterUploadHomeProps {
  word: string;
  /** 내 칸과 얼굴 묶음에 쓰는 내 닉네임 */
  myNickname: string;
  /** 나를 뺀, 오늘 사진을 올린 사람들 */
  participants: Participant[];
  rooms: Room[];
  shot: TodayShot;
  /** 방 형성 모션의 출발 화면(촬영 전 칩 보드). 처음 그려질 때 있으면 모션을 한 번 재생하고, 없으면 바로 끝 모습입니다. */
  intro: ReactElement | null;
  /** 모션을 시작할 때 한 번 불립니다. 호출부는 다음부터 `intro`를 `null`로 넘깁니다. */
  onIntroStart: () => void;
}

/**
 * @description 사진을 보낸 뒤의 홈. 오늘의 단어와 오늘 올린 사람, 보낸 방의 카드를 보입니다.
 *
 * @remarks
 * 방 카드의 친구 칸 셋은 방 사람 가운데 랜덤으로 고르고, 화면을 새로 열 때까지 그대로 둡니다(11/25 회의).
 * 모션 출발 화면은 처음 그려질 때의 `intro`만 기억해 재생하고 끝나면 치웁니다. 모션 중에는 출발 화면을 `inert`로 두어 누르거나 포커스할 수 없고, 칸이 화면 밖으로 넘쳐도 가로 스크롤이 생기지 않게 자릅니다.
 * @internal
 * @name AfterUploadHome
 * @tag div
 */
export function AfterUploadHome({
  word,
  myNickname,
  participants,
  rooms,
  shot,
  intro,
  onIntroStart,
}: AfterUploadHomeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [introFrom, setIntroFrom] = useState(intro);
  const isIntroPlaying = introFrom !== null;
  const endIntro = useCallback(() => setIntroFrom(null), []);
  const sentRooms = rooms.filter((room) => shot.groupIds.includes(room.id)).slice(0, MAX_ROOMS);
  const [friendCells] = useState(
    () => new Map(sentRooms.map((room) => [room.id, pickRandom(room.members, FRIEND_CELLS)])),
  );
  const me: RoomMember = {
    id: 'me',
    nickname: myNickname,
    avatarUrl: null,
    photo: { url: shot.photoUrl, uploadedAt: shot.takenAt, caption: shot.caption },
  };
  const doneToday = [me, ...participants];

  useEffect(() => {
    if (isIntroPlaying) onIntroStart();
  }, [isIntroPlaying, onIntroStart]);
  useRoomIntro(rootRef, isIntroPlaying, endIntro);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-x-clip ${isIntroPlaying ? 'pointer-events-none' : ''}`}
    >
      {introFrom && (
        <div data-intro="before" inert className="absolute inset-x-0 top-0">
          {introFrom}
        </div>
      )}
      <div className="relative flex flex-col gap-4 pt-4.5">
        <section data-intro="today" className="flex flex-col gap-3 px-4">
          <div className="flex flex-col gap-1">
            <p className="text-body-18 font-semibold text-navy/40">오늘의 단어</p>
            <p className="font-word text-word-md font-normal text-navy">{word}</p>
          </div>
          <div className="flex items-center gap-1.75">
            <ParticipantAvatars participants={doneToday} />
            <p className="text-body-14 font-medium tracking-normal text-ink-mute">
              {doneToday.length}명 완료
            </p>
          </div>
        </section>
        <RoomCarousel
          isIntroPlaying={isIntroPlaying}
          cards={sentRooms.map((room, index) => (
            <RoomCard
              key={room.id}
              name={room.name}
              cells={cellsOf(me, friendCells.get(room.id) ?? [])}
              doneCount={room.members.filter((member) => member.photo).length + 1}
              isIntroTarget={index === 0}
            />
          ))}
        />
      </div>
    </div>
  );
}
