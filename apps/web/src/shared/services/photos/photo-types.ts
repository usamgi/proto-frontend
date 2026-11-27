import type { TableRow } from '@/shared/services/database-types';

/** 미션 사진을 두는 비공개 버킷. 올리기와 읽기가 이 이름 하나를 함께 씁니다. */
export const PHOTO_BUCKET = 'mission-photos';

/** 화면을 열어 둔 동안 사진이 보이도록 넉넉히 잡은 서명 URL 유효 시간(초) */
export const SIGNED_URL_SECONDS = 60 * 60;

/** `photos` 표에서 읽는 칸 */
export type PhotoRow = Pick<
  TableRow<'photos'>,
  'group_id' | 'user_id' | 'image_path' | 'caption' | 'created_at'
>;

/** 한 방의 지난 사진까지 읽을 때의 칸. 어느 미션 사진인지 함께 읽습니다. */
export type GroupPhotoRow = PhotoRow & Pick<TableRow<'photos'>, 'mission_id'>;

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
