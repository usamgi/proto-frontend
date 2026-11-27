import { Link } from 'react-router';

import type { RoomMember } from '@/pages/home/home-mission';

import { RoomCell } from './RoomCell';

interface RoomCardProps {
  name: string;
  /** 네 칸. 첫 칸은 나이고, 사람이 모자라면 `null`로 빈칸을 둡니다. */
  cells: (RoomMember | null)[];
  /** 방 전체에서 오늘 올린 사람 수(나 포함) */
  doneCount: number;
  /** 방 형성 모션이 칩에서 모아 만드는 카드면 `true`. 나머지 카드는 옆에서 밀려 들어옵니다. */
  isIntroTarget: boolean;
  /** 내가 이 방에 아직 안 보냈을 때 주는 촬영 화면 주소. 주면 친구 사진을 가리고, 네 칸을 누르면 이 주소로 갑니다. */
  sendTo?: string;
}

/**
 * @description 방 하나의 사진 네 칸과 방 이름, 오늘 올린 사람 수를 붙인 카드.
 *
 * @remarks
 * 내가 보낸 방의 카드는 눌러도 아무 일이 없습니다. `sendTo`를 준 카드의 친구 사진은 화면에서만 가립니다. 사진 주소는 그대로 브라우저에 오므로 보안이 아닙니다.
 * @internal
 * @name RoomCard
 * @tag article
 */
export function RoomCard({ name, cells, doneCount, isIntroTarget, sendTo }: RoomCardProps) {
  const grid = (
    <div data-intro={isIntroTarget ? 'card' : undefined} className="grid grid-cols-2">
      {cells.map((member, index) => (
        <RoomCell
          key={member?.id ?? `empty-${index}`}
          member={member}
          index={index}
          isIntroTarget={isIntroTarget}
          isLocked={sendTo !== undefined}
        />
      ))}
    </div>
  );

  return (
    <article
      aria-label={name}
      data-intro={isIntroTarget ? undefined : 'next'}
      className="flex w-77 shrink-0 snap-start flex-col gap-3"
    >
      {sendTo ? (
        <Link to={sendTo} aria-label={`${name}에 사진 보내기`}>
          {grid}
        </Link>
      ) : (
        grid
      )}
      <p
        data-intro={isIntroTarget ? 'info' : undefined}
        className="flex items-center gap-1 text-navy"
      >
        <span className="text-heading leading-5 font-semibold tracking-normal">{name}</span>
        <span className="text-body-14 font-medium tracking-normal opacity-40">
          {doneCount}명 완료
        </span>
      </p>
    </article>
  );
}
