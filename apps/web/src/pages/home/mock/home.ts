import roomSky1 from '@/assets/room-sky-1.jpg';
import roomSky2 from '@/assets/room-sky-2.jpg';
import type { HomeMission, Room, RoomMember } from '@/pages/home/home-mission';

const HOUR_MS = 60 * 60 * 1000;

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * HOUR_MS).toISOString();
}

function uploaded(
  id: string,
  nickname: string,
  url: string,
  hours: number,
  caption = '',
): RoomMember {
  return { id, nickname, avatarUrl: null, photo: { url, uploadedAt: hoursAgo(hours), caption } };
}

function notUploaded(id: string, nickname: string): RoomMember {
  return { id, nickname, avatarUrl: null, photo: null };
}

/** Supabase 연동 전까지 홈이 쓰는 mock 데이터 */
export const MOCK_MISSION: HomeMission = {
  word: '노랑',
  participants: [
    { id: 'u2', nickname: '상은', avatarUrl: null },
    { id: 'u3', nickname: '지수', avatarUrl: null },
  ],
  friends: [
    { id: 'u1', nickname: '유진', avatarUrl: null, photo: null },
    {
      id: 'u2',
      nickname: '상은',
      avatarUrl: null,
      photo: { url: roomSky1, uploadedAt: hoursAgo(2) },
    },
  ],
};

export const MOCK_MY_NICKNAME = '나';

/**
 * 방 id는 촬영 화면 mock 그룹 id(g1 ~ g5)와 맞춰 두었습니다.
 * 시안의 인원별 방 카드(1명 ~ 5명 이상)를 확인할 수 있게 g1부터 차례로 나를 포함해 1명, 2명, 3명, 4명, 5명인 방입니다.
 */
export const MOCK_ROOMS: Room[] = [
  { id: 'g1', name: '회사 2팀', members: [] },
  { id: 'g2', name: '공주들의 수다방', members: [notUploaded('u1', '유진')] },
  {
    id: 'g3',
    name: '3-2반 동창',
    members: [notUploaded('u1', '유진'), uploaded('u2', '상은', roomSky1, 2, '개추워 ㄷㄷ')],
  },
  {
    id: 'g4',
    name: '디프만6',
    members: [
      notUploaded('u1', '유진'),
      uploaded('u2', '상은', roomSky1, 2, '개추워 ㄷㄷ'),
      notUploaded('u4', '경현'),
    ],
  },
  {
    id: 'g5',
    name: '동네 러닝',
    members: [
      notUploaded('u1', '유진'),
      uploaded('u2', '상은', roomSky1, 2, '개추워 ㄷㄷ'),
      notUploaded('u4', '경현'),
      uploaded('u3', '지수', roomSky2, 1, '노랑 발견!'),
    ],
  },
];
