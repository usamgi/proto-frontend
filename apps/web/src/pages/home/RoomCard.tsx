import { formatUploadedAgo } from './format-uploaded-ago';
import type { RoomMember, RoomPhoto } from './home-mission';
import { InitialAvatar } from './InitialAvatar';

const CELL =
  'relative flex h-51 w-38.5 flex-col items-center overflow-hidden border-[0.4px] border-white';
const EMPTY_BACKGROUND = 'bg-white bg-linear-to-r from-blue/16 to-blue/16';
/** 네 칸이 한 장처럼 보이도록 바깥 모서리만 둥글게 합니다. 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래 순입니다. */
const CORNERS = ['rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl'];
const LABEL = 'text-body-18 leading-8 font-medium text-navy/50';

interface CellProps {
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

interface RoomCardProps {
  name: string;
  /** 네 칸. 첫 칸은 나이고, 사람이 모자라면 `null`로 빈칸을 둡니다. */
  cells: (RoomMember | null)[];
  /** 방 전체에서 오늘 올린 사람 수(나 포함) */
  doneCount: number;
  /** 방 형성 모션이 칩에서 모아 만드는 카드면 `true`. 나머지 카드는 옆에서 밀려 들어옵니다. */
  isIntroTarget: boolean;
}

/**
 * @description 방 하나의 사진 네 칸과 방 이름, 오늘 올린 사람 수를 붙인 카드.
 *
 * @remarks
 * 올린 칸은 사진과 이름, 올린 시각, 캡션을 보이고, 안 올린 칸은 이름과 첫 글자를 보입니다. 눌러도 아무 일이 없습니다(방 화면은 아직 없음).
 * @internal
 * @name RoomCard
 * @tag article
 */
export function RoomCard({ name, cells, doneCount, isIntroTarget }: RoomCardProps) {
  return (
    <article
      aria-label={name}
      data-intro={isIntroTarget ? undefined : 'next'}
      className="flex w-77 shrink-0 snap-start flex-col gap-3"
    >
      <div data-intro={isIntroTarget ? 'card' : undefined} className="grid grid-cols-2">
        {cells.map((member, index) => {
          const corner = CORNERS[index];
          const introIndex = isIntroTarget ? index : undefined;

          if (!member) {
            return (
              <div
                key={`empty-${index}`}
                data-intro-cell={introIndex}
                className={`${CELL} ${corner} ${EMPTY_BACKGROUND}`}
              />
            );
          }
          if (!member.photo) {
            return (
              <WaitingCell
                key={member.id}
                member={member}
                corner={corner}
                introIndex={introIndex}
              />
            );
          }

          return (
            <PhotoCell
              key={member.id}
              nickname={member.nickname}
              photo={member.photo}
              isMine={index === 0}
              corner={corner}
              introIndex={introIndex}
            />
          );
        })}
      </div>
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
