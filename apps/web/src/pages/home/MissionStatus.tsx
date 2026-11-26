import type { Participant } from './home-mission';
import { ParticipantAvatars } from './ParticipantAvatars';
import { useCountdown } from './use-countdown';

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;

function formatCountdown(totalSeconds: number) {
  const pad = (value: number) => String(value).padStart(2, '0');
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)} 남음`;
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
