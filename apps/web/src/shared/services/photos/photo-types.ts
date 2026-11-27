import type { TableRow } from '@/shared/services/database-types';

/** 미션 사진을 두는 비공개 버킷. 올리기와 읽기가 이 이름 하나를 함께 씁니다. */
export const PHOTO_BUCKET = 'mission-photos';

/** `photos` 표에서 읽는 칸 */
export type PhotoRow = Pick<
  TableRow<'photos'>,
  'group_id' | 'user_id' | 'image_path' | 'caption' | 'created_at'
>;

/** 사진 한 장을 여러 방에 올릴 때 넘기는 값 */
export interface UploadPhotoRequest {
  /** 올릴 JPEG. 5MB를 넘으면 거절합니다. */
  photo: Blob;
  /** 캡션. 없으면 빈 문자열입니다. */
  caption: string;
  /** 올릴 방 id들. 방마다 한 장씩 올라갑니다. */
  groupIds: string[];
  userId: string;
  missionId: string;
}
