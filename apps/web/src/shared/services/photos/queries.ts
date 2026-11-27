import { queryOptions } from '@tanstack/react-query';

import { servHasSentPhoto } from './photo-services';
import { SIGNED_URL_SECONDS } from './photo-types';

/** 서명 URL을 다시 쓰는 시간. 만료(1시간)보다 10분 일찍 새로 만들어, 화면에 둔 사이 사진이 만료되지 않게 합니다. */
export const PHOTO_URL_REUSE_MS = 50 * 60 * 1000;

/** 사진 쿼리의 키와 읽는 함수 */
export const photoQueries = {
  all: ['photos'] as const,
  hasSent: (userId: string, missionId: string) =>
    queryOptions({
      queryKey: [...photoQueries.all, 'has-sent', userId, missionId] as const,
      queryFn: () => servHasSentPhoto(userId, missionId),
    }),
  /**
   * @description 사진 한 장의 서명 URL을 두는 자리. 만드는 일은 여러 장을 한 번에 만드는 호출부가 합니다.
   *
   * @remarks
   * 같은 주소를 다시 써야 브라우저가 받아 둔 사진을 그대로 씁니다. 같은 회차에 다시 보내면 저장소 경로가 같아서, 보낸 시각(`version`)을 키에 넣어 새 사진은 새 주소를 받게 합니다.
   * @param imagePath 저장소 경로
   * @param version 사진을 보낸 시각
   */
  url: (imagePath: string, version: string) =>
    queryOptions<string>({
      queryKey: [...photoQueries.all, 'url', imagePath, version] as const,
      gcTime: SIGNED_URL_SECONDS * 1000,
    }),
};
