import { queryOptions, useQuery } from '@tanstack/react-query';

import type { StartedMission } from '@/shared/services/mission/mission-types';
import { missionQueries } from '@/shared/services/mission/queries';
import { servFetchGroupPhotos } from '@/shared/services/photos/photo-services';
import {
  servFetchMyGroups,
  servFetchVisibleMembers,
  servFetchVisibleProfiles,
} from '@/shared/services/rooms/room-services';

import type { RoomDetailRows } from './room-detail-data';

const roomDetailQuery = (userId: string, groupId: string) =>
  queryOptions({
    queryKey: ['room-detail', userId, groupId] as const,
    queryFn: async (): Promise<RoomDetailRows> => {
      const [groups, members, profiles, photos] = await Promise.all([
        servFetchMyGroups(userId),
        servFetchVisibleMembers(),
        servFetchVisibleProfiles(),
        servFetchGroupPhotos(groupId),
      ]);

      return { groups, members, profiles, photos };
    },
  });

type RoomDetailResult =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'missing' }
  | {
      status: 'ready';
      name: string;
      rows: RoomDetailRows;
      missions: StartedMission[];
    };

/**
 * @description 방 하나의 이름, 멤버, 모든 미션의 사진과 지금까지 열린 미션을 읽습니다.
 *
 * @remarks
 * 사진을 보내면 촬영 화면이 모든 쿼리를 다시 읽게 해서, 돌아왔을 때 새 사진이 보입니다.
 * @param userId 로그인한 내 id
 * @param groupId 주소의 방 id
 * @returns 내 방이 아니면 `missing`
 */
export function useRoomDetail(userId: string, groupId: string): RoomDetailResult {
  const rows = useQuery(roomDetailQuery(userId, groupId));
  const missions = useQuery(missionQueries.started());

  // 다시 읽기에 실패해도 전에 읽은 내용이 있으면 그대로 씁니다
  if (!rows.data || !missions.data) {
    return rows.isError || missions.isError ? { status: 'error' } : { status: 'loading' };
  }

  const group = rows.data.groups.find((row) => row.id === groupId);
  if (!group) return { status: 'missing' };

  return { status: 'ready', name: group.name, rows: rows.data, missions: missions.data };
}
