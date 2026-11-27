import { Link } from 'react-router';

import type { RoomMember } from '@/pages/home/home-mission';

import { RoomCell } from './RoomCell';

interface RoomCardProps {
  name: string;
  /** 네 칸. 첫 칸은 나이고, 사람이 모자라면 `null`로 빈칸을 둡니다. */
  cells: (RoomMember | null)[];
  /** 방 전체에서 오늘 올린 사람 수(나 포함) */
  doneCount: number;
  /** 보낸 직후의 모션이 주인공으로 삼는 카드(방금 보낸 방)면 `true`. 나머지 카드는 옆에서 밀려 들어옵니다. */
  isIntroTarget: boolean;
  /** 네 칸을 누르면 가는 방 상세 주소 */
  detailTo: string;
  /** 내가 이 방에 아직 안 보냈으면 `true`. 친구 사진을 가립니다. */
  isLocked: boolean;
}

/**
 * @description 방 하나의 사진 네 칸과 방 이름, 오늘 올린 사람 수를 붙인 카드.
 *
 * @remarks
 * 네 칸을 누르면 방 상세로 갑니다. `isLocked`인 카드의 친구 사진은 화면에서만 가립니다. 사진 주소는 그대로 브라우저에 오므로 보안이 아닙니다.
 * @internal
 * @name RoomCard
 * @tag article
 */
export function RoomCard({
  name,
  cells,
  doneCount,
  isIntroTarget,
  detailTo,
  isLocked,
}: RoomCardProps) {
  const grid = (
    <div data-intro={isIntroTarget ? 'card' : undefined} className="grid grid-cols-2">
      {cells.map((member, index) => (
        <RoomCell
          key={member?.id ?? `empty-${index}`}
          member={member}
          index={index}
          isIntroTarget={isIntroTarget}
          isLocked={isLocked}
        />
      ))}
    </div>
  );

  return (
    <article
      aria-label={name}
      data-intro={isIntroTarget ? 'target' : 'next'}
      className="flex w-77 shrink-0 snap-start flex-col gap-3"
    >
      <Link to={detailTo} aria-label={`${name} 자세히 보기`}>
        {grid}
      </Link>
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
