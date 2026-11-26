/** 카메라 화면이 쓰는 그룹 하나 */
export interface CameraGroup {
  id: string;
  name: string;
}

/** Supabase 연동 전까지 촬영 화면이 쓰는 mock 데이터 */
export const MOCK_WORD = '노랑';

export const MOCK_GROUPS: CameraGroup[] = [
  { id: 'g1', name: '회사 2팀' },
  { id: 'g2', name: '공주들의 수다방' },
  { id: 'g3', name: '3-2반 동창' },
  { id: 'g4', name: '디프만6' },
  { id: 'g5', name: '동네 러닝' },
];
