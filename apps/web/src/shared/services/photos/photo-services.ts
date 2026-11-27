import { supabase } from '@/shared/api/supabase';

import {
  PHOTO_BUCKET,
  SIGNED_URL_SECONDS,
  type PhotoRow,
  type UploadPhotoRequest,
} from './photo-types';

/** 찍은 사진은 긴 변 1600px JPEG라 보통 1MB 안쪽입니다. 원본이 실수로 올라가지 않게 막는 상한입니다. */
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/**
 * @description 한 회차에 올라온 사진 가운데 내가 볼 수 있는 것을 올린 순서로 읽습니다(`photos`).
 *
 * @remarks
 * 방 id로 거르지 않습니다. 정책(RLS)이 내 방의 사진만 돌려줍니다. 정책이 넓어질 때를 대비해 호출부가 내 방 id로 한 번 더 거릅니다.
 * @public
 * @throws 읽기에 실패하면 Supabase 오류
 */
export async function servFetchMissionPhotos(missionId: string): Promise<PhotoRow[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('group_id, user_id, image_path, caption, created_at')
    .eq('mission_id', missionId)
    .order('created_at')
    .returns<PhotoRow[]>();
  if (error) throw error;

  return data;
}

/**
 * @description 내가 한 회차에 사진을 보낸 방이 하나라도 있는지 읽습니다(`photos`).
 *
 * @public
 * @param userId 로그인한 내 id
 * @throws 읽기에 실패하면 Supabase 오류
 */
export async function servHasSentPhoto(userId: string, missionId: string) {
  const { count, error } = await supabase
    .from('photos')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('mission_id', missionId);
  if (error) throw error;

  return (count ?? 0) > 0;
}

/**
 * @description 저장소 경로들을 1시간짜리 서명 URL로 바꿉니다. 버킷이 비공개라 이 주소로만 사진이 보입니다.
 *
 * @public
 * @returns 저장소 경로에서 서명 URL로 가는 표. 경로가 없으면 요청하지 않고 빈 표를 돌려줍니다.
 * @throws 만들기에 실패하면 Supabase 오류
 */
export async function servCreatePhotoUrls(imagePaths: string[]) {
  if (imagePaths.length === 0) return new Map<string, string>();

  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(imagePaths, SIGNED_URL_SECONDS);
  if (error) throw error;

  return new Map(data.map((signed) => [signed.path ?? '', signed.signedUrl ?? '']));
}

/**
 * @description 찍은 사진을 고른 방마다 저장소에 올리고 `photos`에 기록합니다.
 *
 * @remarks
 * 저장소 경로는 `<방>/<나>/<미션>.jpg`입니다. 저장소 정책이 첫 폴더(방 멤버인지)와 둘째 폴더(나인지)를 봅니다. 같은 회차에 다시 보내면 그 방의 사진과 캡션, 보낸 시각을 덮어씁니다.
 * @public
 * @throws JPEG가 아니거나 너무 크면, 또는 올리기나 기록에 실패하면 `Error`
 */
export async function servUploadPhoto({
  photo,
  caption,
  groupIds,
  userId,
  missionId,
}: UploadPhotoRequest) {
  if (photo.type !== 'image/jpeg' || photo.size > MAX_PHOTO_BYTES) {
    throw new Error('올릴 수 없는 사진');
  }

  const sentAt = new Date().toISOString();

  await Promise.all(
    groupIds.map(async (groupId) => {
      const path = `${groupId}/${userId}/${missionId}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, photo, { contentType: 'image/jpeg', upsert: true });
      if (uploadError) throw uploadError;

      const { error } = await supabase.from('photos').upsert(
        {
          group_id: groupId,
          user_id: userId,
          mission_id: missionId,
          image_path: path,
          caption: caption || null,
          created_at: sentAt,
        },
        { onConflict: 'group_id,user_id,mission_id' },
      );
      if (error) throw error;
    }),
  );
}
