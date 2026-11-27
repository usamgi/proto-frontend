import type { Participant, Room, RoomMember } from '@/pages/home/home-mission';

/** 11/25 회의: 방 카드는 최대 4개입니다. */
const MAX_ROOMS = 4;
/** 방 카드 네 칸 가운데 내 칸을 뺀 친구 칸 수 */
const FRIEND_CELLS = 3;

function pickRandom<T>(items: T[], count: number) {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swap]] = [pool[swap], pool[index]];
  }

  return pool.slice(0, count);
}

/**
 * @description 카드로 보일 방을 고릅니다. 내가 보낸 방이 최근에 보낸 순서로 앞에, 아직 안 보낸 방이 뒤에 옵니다.
 *
 * @remarks
 * 한 번에 여러 방에 보내면 보낸 시각이 같아서, 그 방들끼리는 받은 순서 그대로입니다.
 * @internal
 */
export function orderRooms(rooms: Room[]) {
  const sentAtOf = (room: Room) => room.myPhoto?.uploadedAt ?? '';
  const sent = rooms
    .filter((room) => room.myPhoto)
    .sort((a, b) => sentAtOf(b).localeCompare(sentAtOf(a)));

  return [...sent, ...rooms.filter((room) => !room.myPhoto)].slice(0, MAX_ROOMS);
}

/**
 * @description 방마다 친구 칸에 보일 사람을 랜덤으로 골라 id로 돌려줍니다. 사진을 올린 친구를 먼저 고릅니다.
 *
 * @remarks
 * 부를 때마다 결과가 다릅니다. 화면에서는 처음 그릴 때 한 번만 부르고 기억해 둡니다. 그 뒤에 사진을 올린 친구는 다시 열 때 앞자리로 옵니다.
 * @internal
 * @returns 방 id에서 고른 사람 id들로 가는 표
 */
export function pickFriendIds(rooms: Room[]) {
  return new Map(
    rooms.map((room) => {
      const shot = room.members.filter((member) => member.photo);
      const notShot = room.members.filter((member) => !member.photo);
      const picked = [...pickRandom(shot, FRIEND_CELLS), ...pickRandom(notShot, FRIEND_CELLS)];

      return [room.id, picked.slice(0, FRIEND_CELLS).map((member) => member.id)];
    }),
  );
}

function friendsOf(room: Room, pickedIds: string[]) {
  const picked = pickedIds.flatMap((id) => room.members.find((member) => member.id === id) ?? []);
  const rest = room.members.filter((member) => !pickedIds.includes(member.id));

  return [...picked, ...rest].slice(0, FRIEND_CELLS);
}

/**
 * @description 방 카드의 네 칸을 만듭니다. 첫 칸은 나이고, 사람이 모자란 칸은 `null`입니다.
 *
 * @remarks
 * 고른 사람이 방에서 빠졌거나 처음부터 셋보다 적게 골랐으면 방의 다른 사람으로 채웁니다.
 * @internal
 * @param me 내 닉네임과 아바타. 내 칸의 사진은 `room.myPhoto`를 씁니다.
 * @param pickedIds `pickFriendIds`가 이 방에 고른 사람 id들
 */
export function cellsOf(me: Participant, room: Room, pickedIds: string[]): (RoomMember | null)[] {
  const friends = friendsOf(room, pickedIds);

  return [
    { ...me, photo: room.myPhoto },
    ...friends,
    ...Array.from({ length: FRIEND_CELLS - friends.length }, () => null),
  ];
}

/**
 * @description 방에서 지금 회차에 사진을 올린 사람 수. 내가 보냈으면 나도 셉니다.
 *
 * @internal
 */
export function doneCountOf(room: Room) {
  return room.members.filter((member) => member.photo).length + (room.myPhoto ? 1 : 0);
}
