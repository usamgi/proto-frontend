import { useQuery } from '@tanstack/react-query';

import type { GroupRow } from './room-types';
import { roomQueries } from './queries';

/** `empty`는 읽었지만 속한 방이 하나도 없을 때입니다. */
export type MyGroupsStatus = 'loading' | 'ready' | 'empty' | 'error';

function statusOf(groups: GroupRow[] | undefined, isError: boolean): MyGroupsStatus {
  if (groups) return groups.length > 0 ? 'ready' : 'empty';

  return isError ? 'error' : 'loading';
}

/**
 * @description 내가 속한 방을 들어간 순서로 읽습니다.
 *
 * @remarks
 * 다시 읽기에 실패해도 전에 읽은 방이 있으면 그대로 씁니다.
 * @public
 * @param userId 로그인한 내 id
 * @returns 내 방 `groups`(읽기 전이거나 실패하면 빈 배열)와 상태 `status`
 */
export function useMyGroups(userId: string) {
  const { data, isError } = useQuery(roomQueries.mine(userId));

  return { groups: data ?? [], status: statusOf(data, isError) };
}
