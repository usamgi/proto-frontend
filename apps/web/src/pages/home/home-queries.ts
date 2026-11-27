import { queryOptions } from '@tanstack/react-query';

import {
  servCreatePhotoUrls,
  servFetchMissionPhotos,
} from '@/shared/services/photos/photo-services';
import {
  servFetchMyGroups,
  servFetchVisibleMembers,
  servFetchVisibleProfiles,
} from '@/shared/services/rooms/room-services';

import { toHomeData, type HomeRows } from './home-mappers';

async function fetchHomeRows(userId: string, missionId: string): Promise<HomeRows> {
  const [groups, visibleMembers, visiblePhotos, profiles] = await Promise.all([
    servFetchMyGroups(userId),
    servFetchVisibleMembers(),
    servFetchMissionPhotos(missionId),
    servFetchVisibleProfiles(),
  ]);
  const groupIds = new Set(groups.map((group) => group.id));
  const members = visibleMembers.filter((member) => groupIds.has(member.group_id));
  const photos = visiblePhotos.filter((photo) => groupIds.has(photo.group_id));
  const urls = await servCreatePhotoUrls(photos.map((photo) => photo.image_path));

  return { groups, members, photos, profiles, urls };
}

/** 홈 쿼리의 키와 읽는 함수. 방, 멤버, 사진, 프로필을 함께 읽고 사진 주소를 만든 뒤 홈이 그리는 모양으로 바꿉니다. */
export const homeQueries = {
  all: ['home'] as const,
  data: (userId: string, missionId: string) =>
    queryOptions({
      queryKey: [...homeQueries.all, userId, missionId] as const,
      queryFn: async () => toHomeData(userId, await fetchHomeRows(userId, missionId)),
    }),
};
