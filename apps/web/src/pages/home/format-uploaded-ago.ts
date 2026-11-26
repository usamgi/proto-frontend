const MINUTE_MS = 60 * 1000;
const HOUR_MINUTES = 60;

/**
 * @description 사진을 올린 시각을 "방금", "N분 전", "N시간 전"으로 바꿉니다.
 *
 * @param uploadedAt ISO 8601 시각
 */
export function formatUploadedAgo(uploadedAt: string) {
  const minutes = Math.floor((Date.now() - new Date(uploadedAt).getTime()) / MINUTE_MS);

  if (minutes < 1) return '방금';
  if (minutes < HOUR_MINUTES) return `${minutes}분 전`;

  return `${Math.floor(minutes / HOUR_MINUTES)}시간 전`;
}
