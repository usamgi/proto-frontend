import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import type { Participant, Room } from '@/pages/home/home-mission';
import { RoomCard, RoomCarousel } from '@/pages/home/room-card';
import type { IntroKind } from '@/shared/stores/today-shot';

import { cellsOf, doneCountOf, orderRooms, pickFriendIds } from './room-cells';
import { TodaySummary } from './TodaySummary';
import { useRoomIntro } from './use-room-intro';

interface AfterUploadHomeProps {
  word: string;
  /** 내 칸과 얼굴 묶음에 쓰는 내 닉네임 */
  myNickname: string;
  /** 나를 뺀, 오늘 사진을 올린 사람들 */
  participants: Participant[];
  /** 내 방 전부. 내가 지금 회차에 사진을 보낸 방이 앞에 오고, 아직 안 보낸 방은 뒤에 가려진 카드로 붙습니다. */
  rooms: Room[];
  /** 보낸 직후에 재생할 모션. 처음 그려질 때 값이 있으면 한 번 재생하고, `null`이면 바로 끝 모습입니다. */
  intro: IntroKind | null;
  /** `form` 모션의 출발 화면(촬영 전 칩 보드) */
  introFrom: ReactElement;
  /** 모션을 시작할 때 한 번 불립니다. 호출부는 다음부터 `intro`를 `null`로 넘깁니다. */
  onIntroStart: () => void;
  /** 모션이 끝나면 한 번 불립니다. 모션 줄이기 설정이면 시작하자마자 불립니다. */
  onIntroEnd: () => void;
}

/** 보낸 직후 모션을 처음 그려질 때 한 번만 재생합니다. 재생을 시작하면 `onIntroStart`를, 끝나면 `onIntroEnd`를 부릅니다. */
function useIntroPlayback(
  intro: IntroKind | null,
  onIntroStart: () => void,
  onIntroEnd: () => void,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [playingIntro, setPlayingIntro] = useState(intro);
  const isIntroPlaying = playingIntro !== null;
  const endIntro = useCallback(() => {
    setPlayingIntro(null);
    onIntroEnd();
  }, [onIntroEnd]);

  useEffect(() => {
    if (isIntroPlaying) onIntroStart();
  }, [isIntroPlaying, onIntroStart]);
  useRoomIntro(rootRef, playingIntro, endIntro);

  return { rootRef, playingIntro, isIntroPlaying };
}

/**
 * @description 사진을 보낸 뒤의 홈. 오늘의 단어와 오늘 올린 사람, 내 방 카드를 보입니다.
 *
 * @remarks
 * 방 카드의 친구 칸 셋은 처음 그릴 때 랜덤으로 고르고 화면을 새로 열 때까지 그대로 둡니다(11/25 회의). `rooms`가 새 내용으로 바뀌어도 다시 고르지 않습니다.
 * `intro`는 처음 그려질 때의 값만 씁니다. 나중에 바꿔 넘겨도 모션을 다시 재생하지 않습니다.
 * @internal
 * @name AfterUploadHome
 * @tag div
 */
export function AfterUploadHome({
  word,
  myNickname,
  participants,
  rooms,
  intro,
  introFrom,
  onIntroStart,
  onIntroEnd,
}: AfterUploadHomeProps) {
  const { rootRef, playingIntro, isIntroPlaying } = useIntroPlayback(
    intro,
    onIntroStart,
    onIntroEnd,
  );
  const shownRooms = orderRooms(rooms);
  const [pickedFriendIds] = useState(() => pickFriendIds(shownRooms));
  const me: Participant = { id: 'me', nickname: myNickname, avatarUrl: null };
  const meIn = (room: Room): Participant => ({ ...me, nickname: room.myNickname });

  return (
    <div
      ref={rootRef}
      className={`relative overflow-x-clip ${isIntroPlaying ? 'pointer-events-none' : ''}`}
    >
      {playingIntro === 'form' && (
        <div data-intro="before" inert className="absolute inset-x-0 top-0">
          {introFrom}
        </div>
      )}
      <div className="relative flex flex-col gap-4 pt-4.5">
        <TodaySummary word={word} doneToday={[me, ...participants]} />
        <RoomCarousel
          isIntroPlaying={isIntroPlaying}
          cards={shownRooms.map((room, index) => (
            <RoomCard
              key={room.id}
              name={room.name}
              cells={cellsOf(meIn(room), room, pickedFriendIds.get(room.id) ?? [])}
              doneCount={doneCountOf(room)}
              detailTo={`/rooms/${room.id}`}
              isLocked={!room.myPhoto}
              isIntroTarget={index === 0}
            />
          ))}
        />
      </div>
    </div>
  );
}
