import { queryOptions } from '@tanstack/react-query';

import { servFetchTodayMission } from './mission-services';

/** 미션 쿼리의 키와 읽는 함수 */
export const missionQueries = {
  all: ['mission'] as const,
  today: () =>
    queryOptions({
      queryKey: [...missionQueries.all, 'today'] as const,
      queryFn: servFetchTodayMission,
    }),
};
