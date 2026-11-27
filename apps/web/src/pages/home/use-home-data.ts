import { useQuery } from '@tanstack/react-query';

import type { HomeData } from './home-mission';
import { homeQueries } from './home-queries';

type HomeDataResult =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready';
      data: HomeData;
      /** 전에 읽어 둔 내용을 보이는 중이고 새로 읽기가 아직 안 끝났으면 `true`입니다. */
      isRemembered: boolean;
    };

/**
 * @description 내 방들과 지금 회차의 사진을 읽습니다.
 *
 * @remarks
 * 같은 회차를 전에 읽은 적이 있으면 그 내용을 먼저 돌려주고 새로 읽은 내용이 오면 바꿉니다. 그래서 `data`는 화면에 있는 동안 한 번 더 바뀔 수 있습니다. 사진 주소는 1시간 뒤에 만료됩니다.
 * @param userId 로그인한 내 id
 * @param missionId 지금 회차의 미션 id. 아직 모르면 `null`이고 읽지 않습니다.
 * @returns 읽는 중이면 `loading`, 처음 읽기에 실패하면 `error`, 그 밖에는 `ready`와 `data`. 전에 읽은 내용이 있으면 실패해도 그 내용으로 `ready`입니다.
 */
export function useHomeData(userId: string, missionId: string | null): HomeDataResult {
  const { data, isError, isFetching } = useQuery({
    ...homeQueries.data(userId, missionId ?? ''),
    enabled: missionId !== null,
  });
  if (data) return { status: 'ready', data, isRemembered: isFetching };

  return isError ? { status: 'error' } : { status: 'loading' };
}
