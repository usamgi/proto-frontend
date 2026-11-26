import type { Participant } from './home-mission';

/** 아바타 자리는 넷입니다. 다섯 명부터는 마지막 자리가 "+N"으로 바뀝니다. */
const MAX_AVATARS = 4;

const AVATAR_BASE =
  'flex size-7 items-center justify-center overflow-hidden rounded-full border border-white';

/**
 * @description 오늘 올린 사람들의 작은 얼굴을 겹쳐 놓은 묶음.
 *
 * @remarks
 * 넷까지 보이고, 다섯 명부터는 셋과 "+N"을 보입니다.
 * @internal
 * @name ParticipantAvatars
 * @tag div
 */
export function ParticipantAvatars({ participants }: { participants: Participant[] }) {
  const hasOverflow = participants.length > MAX_AVATARS;
  const shown = participants.slice(0, hasOverflow ? MAX_AVATARS - 1 : MAX_AVATARS);
  const hiddenCount = participants.length - shown.length;

  return (
    <div className="flex -space-x-2">
      {shown.map(({ id, nickname, avatarUrl }) =>
        avatarUrl ? (
          <img key={id} src={avatarUrl} alt="" className={`${AVATAR_BASE} object-cover`} />
        ) : (
          <span
            key={id}
            aria-hidden
            className={`${AVATAR_BASE} bg-linear-to-b from-avatar-from to-avatar-to text-label-13 font-medium text-navy/60`}
          >
            {nickname.slice(0, 1)}
          </span>
        ),
      )}
      {hasOverflow && (
        <span aria-hidden className={`${AVATAR_BASE} bg-navy text-label-13 font-medium text-white`}>
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
