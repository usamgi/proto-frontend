import { queryOptions } from '@tanstack/react-query';

import { servFetchMyGroups } from './room-services';

/** 방 쿼리의 키와 읽는 함수 */
export const roomQueries = {
  all: ['rooms'] as const,
  mine: (userId: string) =>
    queryOptions({
      queryKey: [...roomQueries.all, 'mine', userId] as const,
      queryFn: () => servFetchMyGroups(userId),
    }),
};
