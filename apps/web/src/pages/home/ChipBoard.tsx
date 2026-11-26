import type { ReactElement } from 'react';
import { Link } from 'react-router';

import type { Friend, FriendPhoto } from './home-mission';
import { AddCircleIcon } from './icons/AddCircleIcon';
import { LockIcon } from './icons/LockIcon';

/** 칩 자리는 넷이고 그중 하나는 내 사진 칩이라 친구는 셋까지 보입니다. */
const MAX_FRIEND_CHIPS = 3;
/** 친구가 이보다 적으면 빈자리를 친구 초대 칩으로 채웁니다. 시안의 친구 0명, 1명 화면이 칩 둘입니다. */
const MIN_FRIEND_SLOTS = 2;

const MINUTE_MS = 60 * 1000;
const HOUR_MINUTES = 60;

/** 친구 칩 자리. 칩 가운데의 위치이고, 세로는 보드 위쪽에서 잽니다. */
const FRIEND_SLOTS = [
  'left-[29.73%] top-[128.6px] rotate-[3.31deg]',
  'left-[29.18%] top-[371.1px] -rotate-[6.1deg]',
  'left-[74.3%] top-[429.3px] rotate-[3.31deg]',
];
const MY_SLOT = 'left-[72.71%] top-[191.3px] -rotate-[0.21deg]';

/**
 * 칩마다 박자가 달라 보이도록 둥둥의 시작점을 어긋나게 둡니다.
 * `animate-float` 단축 속성이 지연을 0으로 덮어써서 클래스가 아니라 인라인 스타일로 줍니다.
 */
const FLOAT_DELAYS = ['0s', '-1.6s', '-0.8s'];
const MY_FLOAT_DELAY = '-2.3s';

const CARD =
  'relative flex h-51 w-[153.8px] flex-col items-center justify-center overflow-hidden rounded-3xl border-[0.4px] border-blue bg-white bg-linear-to-r from-blue/16 to-blue/16 drop-shadow-[0_9px_2px_rgba(98,131,160,0.12)]';
const LABEL = 'text-body-18 leading-8 font-medium text-navy/50';

function formatUploadedAgo(uploadedAt: string) {
  const minutes = Math.floor((Date.now() - new Date(uploadedAt).getTime()) / MINUTE_MS);

  if (minutes < 1) return '방금';
  if (minutes < HOUR_MINUTES) return `${minutes}분 전`;

  return `${Math.floor(minutes / HOUR_MINUTES)}시간 전`;
}

function InviteChip() {
  return (
    <div className={CARD}>
      <div className="flex flex-col items-center gap-3">
        <p className={LABEL}>친구 초대</p>
        <AddCircleIcon />
      </div>
    </div>
  );
}

function FriendChip({ nickname, avatarUrl }: Pick<Friend, 'nickname' | 'avatarUrl'>) {
  const avatarClass = 'size-[57.6px] rounded-full border-[2.16px] border-white';

  return (
    <div className={`${CARD} gap-2.5`}>
      <p className={LABEL}>{nickname}</p>
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className={`${avatarClass} object-cover`} />
      ) : (
        <span
          aria-hidden
          className={`${avatarClass} flex items-center justify-center bg-linear-to-b from-avatar-from/52 to-avatar-to/52 text-chip-initial font-semibold text-navy/50`}
        >
          {nickname.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

function LockedChip({ nickname, photo }: { nickname: string; photo: FriendPhoto }) {
  return (
    <div className={CARD}>
      <img
        src={photo.url}
        alt=""
        className="absolute inset-0 size-full scale-110 object-cover blur-md"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-navy/24 bg-linear-to-b from-navy/32 to-transparent"
      />
      <p className="absolute inset-x-0 top-4 flex justify-center gap-1.75 font-medium text-white">
        <span className="text-body-16">{nickname}</span>
        <span className="text-body-14 opacity-50">{formatUploadedAgo(photo.uploadedAt)}</span>
      </p>
      <LockIcon className="relative size-10 text-white" title="내 사진을 올리면 열려요" />
    </div>
  );
}

function MyChip({ hasFriendPhotos }: { hasFriendPhotos: boolean }) {
  return (
    <Link to="/camera" className={CARD}>
      <span className="flex h-24 flex-col items-center justify-between">
        <span className={LABEL}>{hasFriendPhotos ? '친구 사진 보려면' : '내 사진'}</span>
        <span className="rounded-full bg-navy px-6 py-3 text-heading leading-5 font-semibold tracking-[-0.4px] text-white">
          사진 찍기
        </span>
      </span>
    </Link>
  );
}

function ChipSlot({
  slot,
  delay,
  children,
}: {
  slot: string;
  delay: string;
  children: ReactElement;
}) {
  return (
    <div className={`absolute -translate-x-1/2 -translate-y-1/2 ${slot}`}>
      <div className="motion-safe:animate-float" style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}

interface ChipBoardProps {
  /** 앞에서부터 세 명까지 칩이 됩니다. 사진을 올린 친구는 블러로 가린 칩이 됩니다. */
  friends: Friend[];
}

/**
 * @description 친구 칩과 내 사진 칩이 둥둥 떠 있는 홈의 칩 영역.
 *
 * @remarks
 * 친구가 둘보다 적으면 빈자리에 친구 초대 칩이 나옵니다. 내 사진 칩을 누르면 `/camera`로 갑니다.
 * @internal
 * @name ChipBoard
 * @tag div
 */
export function ChipBoard({ friends }: ChipBoardProps) {
  const shownFriends = friends.slice(0, MAX_FRIEND_CHIPS);
  const inviteCount = Math.max(0, MIN_FRIEND_SLOTS - shownFriends.length);
  const hasFriendPhotos = friends.some((friend) => friend.photo);

  const chips = [
    ...Array.from({ length: inviteCount }, (_, index) => <InviteChip key={`invite-${index}`} />),
    ...shownFriends.map(({ id, nickname, avatarUrl, photo }) =>
      photo ? (
        <LockedChip key={id} nickname={nickname} photo={photo} />
      ) : (
        <FriendChip key={id} nickname={nickname} avatarUrl={avatarUrl} />
      ),
    ),
  ];

  return (
    <div className="relative h-135 w-full">
      {chips.map((chip, index) => (
        <ChipSlot key={chip.key} slot={FRIEND_SLOTS[index]} delay={FLOAT_DELAYS[index]}>
          {chip}
        </ChipSlot>
      ))}
      <ChipSlot slot={MY_SLOT} delay={MY_FLOAT_DELAY}>
        <MyChip hasFriendPhotos={hasFriendPhotos} />
      </ChipSlot>
    </div>
  );
}
