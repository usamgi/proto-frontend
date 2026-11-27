import { queryOptions } from '@tanstack/react-query';

import {
  servCreatePhotoUrls,
  servFetchMissionPhotos,
} from '@/shared/services/photos/photo-services';
import type { PhotoRow } from '@/shared/services/photos/photo-types';
import { PHOTO_URL_REUSE_MS, photoQueries } from '@/shared/services/photos/queries';
import { queryClient } from '@/shared/services/query-client';
import {
  servFetchMyGroups,
  servFetchVisibleMembers,
  servFetchVisibleProfiles,
} from '@/shared/services/rooms/room-services';

import type { HomeTableRows } from './home-mappers';

/** 사진을 보낸 뒤 모든 쿼리를 다시 읽게 해도(무효화) 주소는 다시 쓰도록, 무효화가 아니라 만든 시각만 봅니다. */
function reusableUrlOf(photo: PhotoRow) {
  const state = queryClient.getQueryState(
    photoQueries.url(photo.image_path, photo.created_at ?? '').queryKey,
  );
  if (!state?.data || Date.now() - state.dataUpdatedAt > PHOTO_URL_REUSE_MS) {
    return undefined;
  }

  return state.data;
}

/**
 * @description 기억해 둔 주소는 다시 쓰고, 없는 것만 한 번에 만들어 기억합니다.
 *
 * @remarks
 * 만들지 못한 사진은 기억하지 않아 다음에 다시 만듭니다. 기억할 때 `setQueryData`가 아니라 `fetchQuery`를 씁니다. `setQueryData`는 보관 시간(`gcTime`)을 기본값 5분으로 만들어, 홈을 떠나고 5분 뒤 주소가 지워집니다.
 */
async function photoUrlsOf(photos: PhotoRow[]) {
  const reused = photos.map((photo) => [photo, reusableUrlOf(photo)] as const);
  const missing = reused.filter(([, url]) => url === undefined).map(([photo]) => photo);
  const created = await servCreatePhotoUrls(missing.map((photo) => photo.image_path));

  await Promise.all(
    missing
      .filter((photo) => created.get(photo.image_path))
      .map((photo) =>
        queryClient.fetchQuery({
          ...photoQueries.url(photo.image_path, photo.created_at ?? ''),
          queryFn: () => created.get(photo.image_path) ?? '',
        }),
      ),
  );

  return new Map(
    photos.map((photo, index) => [
      photo.image_path,
      reused[index][1] ?? created.get(photo.image_path) ?? '',
    ]),
  );
}

async function fetchHomeRows(userId: string, missionId: string): Promise<HomeTableRows> {
  const [groups, visibleMembers, visiblePhotos, profiles] = await Promise.all([
    servFetchMyGroups(userId),
    servFetchVisibleMembers(),
    servFetchMissionPhotos(missionId),
    servFetchVisibleProfiles(),
  ]);
  const groupIds = new Set(groups.map((group) => group.id));
  const members = visibleMembers.filter((member) => groupIds.has(member.group_id));
  const photos = visiblePhotos.filter((photo) => groupIds.has(photo.group_id));

  return { groups, members, photos, profiles };
}

/**
 * @description 홈 쿼리의 키와 읽는 함수. 방, 멤버, 사진, 프로필을 함께 읽고, 사진 주소는 따로 만듭니다.
 *
 * @remarks
 * 사진 주소를 기다리지 않고 홈을 먼저 그리려고 둘을 나눴습니다. 사진 주소는 만든 지 50분이 안 됐으면 전에 만든 것을 다시 씁니다. 다시 읽을 때마다 새로 만들면 주소가 바뀌어 브라우저가 같은 사진을 처음부터 다시 받습니다.
 */
export const homeQueries = {
  all: ['home'] as const,
  rows: (userId: string, missionId: string) =>
    queryOptions({
      queryKey: [...homeQueries.all, userId, missionId] as const,
      queryFn: () => fetchHomeRows(userId, missionId),
    }),
  photoUrls: (photos: PhotoRow[]) =>
    queryOptions({
      queryKey: [
        ...homeQueries.all,
        'photo-urls',
        photos.map((photo) => `${photo.image_path}@${photo.created_at ?? ''}`),
      ] as const,
      queryFn: () => photoUrlsOf(photos),
    }),
};
