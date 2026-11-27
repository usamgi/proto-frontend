import { formatUploadedAgo } from '@/pages/home/format-uploaded-ago';
import type { RoomMember, RoomPhoto } from '@/pages/home/home-mission';
import { LockIcon } from '@/pages/home/icons/LockIcon';
import { InitialAvatar } from '@/pages/home/InitialAvatar';

const CELL =
  'relative flex h-51 w-38.5 flex-col items-center overflow-hidden border-[0.4px] border-white';
const EMPTY_BACKGROUND = 'bg-white bg-linear-to-r from-blue/16 to-blue/16';
/** 네 칸이 한 장처럼 보이도록 바깥 모서리만 둥글게 합니다. 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래 순입니다. */
const CORNERS = ['rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl'];
const LABEL = 'text-body-18 leading-8 font-medium text-navy/50';

interface CellProps {
  /** 카드의 네 귀 가운데 이 칸이 맡는 귀를 둥글게 하는 클래스 */
  corner: string;
  /** 방 형성 모션이 칸을 찾을 때 쓰는 순서. 모션 대상 카드가 아니면 비웁니다. */
  introIndex?: number;
}

function PhotoCell({
  nickname,
  photo,
  isMine,
  corner,
  introIndex,
}: CellProps & { nickname: string; photo: RoomPhoto; isMine: boolean }) {
  return (
    <div data-intro-cell={introIndex} className={`${CELL} ${corner} justify-between py-4`}>
      <img
        src={photo.url}
        alt={`${nickname} 사진`}
        data-intro={isMine && introIndex !== undefined ? 'my-photo' : undefined}
        className="absolute inset-0 size-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-navy/50 from-[3.4%] to-transparent to-[47.3%]"
      />
      <p className="relative flex gap-1.75 font-medium text-white">
        <span className="text-body-16">{nickname}</span>
        <span className="text-body-14 opacity-50">{formatUploadedAgo(photo.uploadedAt)}</span>
      </p>
      {photo.caption && (
        <p className="relative max-w-[calc(100%-16px)] truncate rounded-full bg-navy/24 px-3 py-2 text-body-16 font-medium text-white backdrop-blur-[25px]">
          {photo.caption}
        </p>
      )}
    </div>
  );
}

function LockedCell({
  nickname,
  photo,
  corner,
}: Pick<CellProps, 'corner'> & { nickname: string; photo: RoomPhoto }) {
  return (
    <div className={`${CELL} ${corner} justify-center`}>
      <img
        src={photo.url}
        alt=""
        className="absolute inset-0 size-full scale-110 object-cover blur-md"
      />
      <div aria-hidden className="absolute inset-0 bg-navy/24" />
      <LockIcon
        className="relative size-10 text-white"
        title={`${nickname} 사진은 내 사진을 올리면 열려요`}
      />
    </div>
  );
}

function WaitingCell({ member, corner, introIndex }: CellProps & { member: RoomMember }) {
  return (
    <div
      data-intro-cell={introIndex}
      className={`${CELL} ${corner} ${EMPTY_BACKGROUND} justify-center`}
    >
      <div className="flex h-24 flex-col items-center justify-between">
        <p className={LABEL}>{member.nickname}</p>
        <InitialAvatar nickname={member.nickname} avatarUrl={member.avatarUrl} />
      </div>
    </div>
  );
}

interface RoomCellProps {
  /** 이 칸의 사람. 사람이 모자라 비는 칸이면 `null`입니다. */
  member: RoomMember | null;
  /** 네 칸 가운데 몇 번째인지. 0이 내 칸이고, 왼쪽 위에서 오른쪽 아래 순입니다. */
  index: number;
  /** 방 형성 모션이 모으는 카드의 칸이면 `true` */
  isIntroTarget: boolean;
  /** `true`면 올린 사진을 가려서 그립니다. 내가 이 방에 아직 안 보냈을 때입니다. */
  isLocked: boolean;
}

/**
 * @description 방 카드의 한 칸. 사람과 사진이 있는지에 따라 사진, 가린 사진, 이름, 빈칸 가운데 하나를 그립니다.
 *
 * @internal
 * @name RoomCell
 * @tag div
 */
export function RoomCell({ member, index, isIntroTarget, isLocked }: RoomCellProps) {
  const corner = CORNERS[index];
  const introIndex = isIntroTarget ? index : undefined;

  if (!member) {
    return <div data-intro-cell={introIndex} className={`${CELL} ${corner} ${EMPTY_BACKGROUND}`} />;
  }
  if (!member.photo) {
    return <WaitingCell member={member} corner={corner} introIndex={introIndex} />;
  }
  if (isLocked) {
    return <LockedCell nickname={member.nickname} photo={member.photo} corner={corner} />;
  }

  return (
    <PhotoCell
      nickname={member.nickname}
      photo={member.photo}
      isMine={index === 0}
      corner={corner}
      introIndex={introIndex}
    />
  );
}
