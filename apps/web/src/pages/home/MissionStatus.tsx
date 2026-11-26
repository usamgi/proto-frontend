import type { Participant } from './home-mission';
import { useCountdown } from './use-countdown';

/** 아바타 자리는 넷입니다. 다섯 명부터는 마지막 자리가 "+N"으로 바뀝니다. */
const MAX_AVATARS = 4;

function formatCountdown(totalSeconds: number) {
  const pad = (value: number) => String(value).padStart(2, '0');
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)} 남음`;
}

const AVATAR_BASE =
  'flex size-7 items-center justify-center overflow-hidden rounded-full border border-white';

function ParticipantAvatars({ participants }: { participants: Participant[] }) {
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

interface MissionStatusProps {
  /** 오늘 사진을 올린 사람들. 비어 있으면 타이머만 그립니다. */
  participants: Participant[];
}

/**
 * @description 오늘 올린 사람 수와 단어가 바뀔 때까지 남은 시간.
 *
 * @internal
 * @name MissionStatus
 * @tag div
 */
export function MissionStatus({ participants }: MissionStatusProps) {
  const seconds = useCountdown();

  return (
    <div className="flex items-center gap-1.5">
      {participants.length > 0 && (
        <>
          <div className="flex items-center gap-1.75">
            <ParticipantAvatars participants={participants} />
            <p className="text-body-14 font-medium tracking-normal text-ink-mute">
              {participants.length}명 참여
            </p>
          </div>
          <span aria-hidden className="size-0.75 rounded-full bg-ink-mute" />
        </>
      )}
      <p
        role="timer"
        className="rounded-full bg-blue/12 px-3 py-1.5 text-body-14 font-semibold text-blue tabular-nums"
      >
        {formatCountdown(seconds)}
      </p>
    </div>
  );
}
