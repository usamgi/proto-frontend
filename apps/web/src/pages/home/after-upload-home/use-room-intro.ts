import { useLayoutEffect, type RefObject } from 'react';

import type { IntroKind } from '@/shared/stores/today-shot';

import { buildRoomIntro } from './build-room-intro';

/**
 * @description 보낸 직후 홈의 모션을 한 번 재생합니다. 처음 보냈으면 칩이 방 카드로 모이고, 이미 보낸 방이 있으면 방금 보낸 방 카드만 들어옵니다.
 *
 * @remarks
 * 친구 수와 화면 폭에 상관없이 같은 흐름입니다. 모션 줄이기 설정이면 재생하지 않고 바로 `onEnd`를 부릅니다. 화면을 떠나면 재생 중인 모션을 취소하고 `onEnd`는 부르지 않습니다.
 * @param root 촬영 후 화면을 담은 요소. `form`이면 촬영 전 칩 보드도 함께 담겨 있어야 합니다.
 * @param kind 재생할 모션. `null`이면 재생하지 않습니다.
 * @param onEnd 모션이 끝나면 한 번 불립니다. 호출부는 여기서 `kind`를 `null`로 바꿉니다.
 */
export function useRoomIntro(
  root: RefObject<HTMLElement | null>,
  kind: IntroKind | null,
  onEnd: () => void,
) {
  useLayoutEffect(() => {
    if (!kind || !root.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onEnd();
      return;
    }

    const animations = buildRoomIntro(root.current, kind);
    let isCancelled = false;

    Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        if (!isCancelled) onEnd();
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
      animations.forEach((animation) => animation.cancel());
    };
  }, [root, kind, onEnd]);
}
