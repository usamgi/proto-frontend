import { useQuery } from '@tanstack/react-query';

import { photoQueries } from './queries';

/**
 * @description 내가 지금 회차에 사진을 보낸 방이 하나라도 있는지 읽습니다.
 *
 * @remarks
 * 아직 못 읽었거나 읽기에 실패하면 `false`입니다. 사진을 올리면 다시 읽습니다.
 * @public
 * @param userId 로그인한 내 id
 * @param missionId 지금 회차의 미션 id. `null`이면 읽지 않습니다.
 */
export function useHasSentPhoto(userId: string, missionId: string | null) {
  const { data } = useQuery({
    ...photoQueries.hasSent(userId, missionId ?? ''),
    enabled: missionId !== null,
  });

  return data ?? false;
}
