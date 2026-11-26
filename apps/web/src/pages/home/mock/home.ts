import type { HomeMission } from '@/pages/home/home-mission';

/** Supabase 연동 전까지 홈이 쓰는 mock 데이터 */
export const MOCK_MISSION: HomeMission = {
  word: '노랑',
  participants: [
    { id: 'u1', nickname: '유진', avatarUrl: null },
    { id: 'u2', nickname: '상은', avatarUrl: null },
  ],
};
