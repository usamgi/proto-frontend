import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { servSubscribeRoundChange, servSwitchMissionRound } from './mission-services';
import type { TodayMission } from './mission-types';
import { missionQueries } from './queries';

/** `missing`은 오늘 날짜와 회차에 넣어 둔 단어가 없을 때입니다. */
export type TodayMissionStatus = 'loading' | 'ready' | 'missing' | 'error';

function statusOf(mission: TodayMission | null | undefined, isError: boolean): TodayMissionStatus {
  if (mission) return 'ready';
  if (isError) return 'error';

  return mission === null ? 'missing' : 'loading';
}

/**
 * @description 오늘 지금 회차의 미션. 홈과 촬영 화면이 같은 내용을 함께 씁니다.
 *
 * @remarks
 * 다른 사람이 바꾼 회차를 받으려면 화면에서 `useTodayMissionSync`도 함께 부릅니다. 다시 읽기에 실패해도 전에 읽은 미션이 있으면 그대로 `ready`입니다.
 * @public
 * @returns 지금 미션 `mission`(없거나 아직 모르면 `null`)과 상태 `status`
 */
export function useTodayMission() {
  const { data, isError } = useQuery(missionQueries.today());

  return { mission: data ?? null, status: statusOf(data, isError) };
}

/**
 * @description 화면에 있는 동안 회차가 바뀌면 미션을 다시 읽게 합니다. 화면을 떠나면 구독을 끕니다.
 *
 * @public
 */
export function useTodayMissionSync() {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      servSubscribeRoundChange(() => {
        void queryClient.invalidateQueries({ queryKey: missionQueries.all });
      }),
    [queryClient],
  );
}

/**
 * @description 모든 사람의 회차를 바꿉니다. UT에서 하루에 두 단어를 쓰기 위한 것입니다.
 *
 * @public
 * @returns 회차를 바꾸는 `switchRound`와, 바꾸는 중인지 `isSwitching`. 바꾼 뒤 미션을 다시 읽습니다.
 */
export function useSwitchMissionRound() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: servSwitchMissionRound,
    onSettled: () => queryClient.invalidateQueries({ queryKey: missionQueries.all }),
  });

  return { switchRound: () => mutate(), isSwitching: isPending };
}
