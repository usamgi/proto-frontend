import { queryOptions } from '@tanstack/react-query';

import { servHasSentPhoto } from './photo-services';

/** 사진 쿼리의 키와 읽는 함수 */
export const photoQueries = {
  all: ['photos'] as const,
  hasSent: (userId: string, missionId: string) =>
    queryOptions({
      queryKey: [...photoQueries.all, 'has-sent', userId, missionId] as const,
      queryFn: () => servHasSentPhoto(userId, missionId),
    }),
};
