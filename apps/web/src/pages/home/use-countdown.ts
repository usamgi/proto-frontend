import { useEffect, useState } from 'react';

const SECOND_MS = 1000;
const DAY_MS = 24 * 60 * 60 * SECOND_MS;
/** 한국은 서머타임이 없어 UTC와의 차이가 늘 9시간입니다. */
const KST_OFFSET_MS = 9 * 60 * 60 * SECOND_MS;

function secondsUntilKstMidnight() {
  const elapsedToday = (Date.now() + KST_OFFSET_MS) % DAY_MS;

  return Math.ceil((DAY_MS - elapsedToday) / SECOND_MS);
}

/**
 * @description 오늘의 단어가 바뀌는 KST 자정까지 남은 시간을 1초마다 갱신합니다.
 *
 * @remarks
 * 기기의 시간대와 무관하게 KST 기준입니다. 자정이 지나면 다시 24시간부터 줄어듭니다.
 * @returns 남은 시간(초)
 */
export function useCountdown() {
  const [seconds, setSeconds] = useState(secondsUntilKstMidnight);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(secondsUntilKstMidnight()), SECOND_MS);

    return () => clearInterval(timer);
  }, []);

  return seconds;
}
