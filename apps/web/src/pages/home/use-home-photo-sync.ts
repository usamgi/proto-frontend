import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { usePhotoChange } from '@/shared/services/photos/use-photo-change';

import { homeQueries } from './home-queries';

/**
 * @description 홈에 있는 동안 친구가 사진을 올리면 새로고침 없이 홈을 다시 읽습니다.
 *
 * @remarks
 * 방 형성 모션 도중에 다시 읽으면 움직이던 칸이 바뀌어 모션이 끊깁니다. 그래서 `isPaused`인 동안 온 알림은 기억해 두었다가 모션이 끝나면 한 번 다시 읽습니다.
 * @internal
 * @param isPaused 방 형성 모션이 재생 중이면 `true`
 */
export function useHomePhotoSync(isPaused: boolean) {
  const queryClient = useQueryClient();
  const hasMissedRef = useRef(false);

  usePhotoChange(() => {
    if (isPaused) {
      hasMissedRef.current = true;
      return;
    }

    void queryClient.invalidateQueries({ queryKey: homeQueries.all });
  });

  useEffect(() => {
    if (isPaused || !hasMissedRef.current) return;

    hasMissedRef.current = false;
    void queryClient.invalidateQueries({ queryKey: homeQueries.all });
  }, [isPaused, queryClient]);
}
