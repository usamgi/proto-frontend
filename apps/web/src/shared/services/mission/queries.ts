import { queryOptions } from '@tanstack/react-query';

import { servFetchStartedMissions, servFetchTodayMission } from './mission-services';

/** 미션 쿼리의 키와 읽는 함수 */
export const missionQueries = {
  all: ['mission'] as const,
  today: () =>
    queryOptions({
      queryKey: [...missionQueries.all, 'today'] as const,
      queryFn: servFetchTodayMission,
    }),
  /** 회차가 바뀌면 `all`과 함께 다시 읽습니다. */
  started: () =>
    queryOptions({
      queryKey: [...missionQueries.all, 'started'] as const,
      queryFn: servFetchStartedMissions,
    }),
};
