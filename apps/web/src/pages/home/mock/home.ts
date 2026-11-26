import roomSky from '@/assets/room-sky-1.jpg';
import type { HomeMission } from '@/pages/home/home-mission';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

/** Supabase 연동 전까지 홈이 쓰는 mock 데이터 */
export const MOCK_MISSION: HomeMission = {
  word: '노랑',
  participants: [{ id: 'u2', nickname: '상은', avatarUrl: null }],
  friends: [
    { id: 'u1', nickname: '유진', avatarUrl: null, photo: null },
    {
      id: 'u2',
      nickname: '상은',
      avatarUrl: null,
      photo: { url: roomSky, uploadedAt: new Date(Date.now() - TWO_HOURS_MS).toISOString() },
    },
  ],
};
