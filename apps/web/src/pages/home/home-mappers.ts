import type { PhotoRow } from '@/shared/services/photos/photo-types';
import type { GroupRow, MemberRow, ProfileRow } from '@/shared/services/rooms/room-types';

import type { Friend, HomeData, Participant, Room, RoomMember } from './home-mission';

/** 홈 한 화면을 그리려고 읽어 온 표 모양의 묶음 */
export interface HomeTableRows {
  groups: GroupRow[];
  members: MemberRow[];
  photos: PhotoRow[];
  profiles: ProfileRow[];
}

/** 표 모양의 묶음과 사진 주소 */
export interface HomeRows extends HomeTableRows {
  /** 저장소 경로에서 서명 URL로. 아직 만들지 못한 사진은 빠져 있고, 그 사진은 주소가 빈 문자열이 됩니다. */
  urls: Map<string, string>;
}

/** 방 안의 사람은 그 방에서 정한 닉네임으로 부릅니다. 정하지 않았으면 프로필 이름으로 부릅니다. */
function roomsOf(
  userId: string,
  { groups, members, photos }: HomeRows,
  personOf: (id: string) => Participant,
  roomPhotoOf: (photo: PhotoRow) => RoomMember['photo'],
): Room[] {
  const roomPersonOf = (member: MemberRow): Participant => {
    const person = personOf(member.user_id);
    return { ...person, nickname: member.nickname ?? person.nickname };
  };

  return groups.map((group) => {
    const myPhoto = photos.find((photo) => photo.group_id === group.id && photo.user_id === userId);
    const roomMembers = members.filter((member) => member.group_id === group.id);
    const me = roomMembers.find((member) => member.user_id === userId);

    return {
      id: group.id,
      name: group.name,
      myNickname: me ? roomPersonOf(me).nickname : personOf(userId).nickname,
      myPhoto: myPhoto ? roomPhotoOf(myPhoto) : null,
      members: roomMembers
        .filter((member) => member.user_id !== userId)
        .map((member): RoomMember => {
          const photo = photos.find(
            (row) => row.group_id === group.id && row.user_id === member.user_id,
          );

          return { ...roomPersonOf(member), photo: photo ? roomPhotoOf(photo) : null };
        }),
    };
  });
}

/**
 * @description 방을 가리지 않는 자리(칩, 참여자 묶음)에서 부를 방 닉네임을 고릅니다.
 *
 * @remarks
 * 닉네임은 방마다 달라서, 오늘 사진을 보낸 방의 닉네임을 먼저 쓰고 없으면 내가 먼저 들어간 방의 닉네임을 씁니다. 어느 방에도 닉네임이 없으면 `undefined`이고 호출부가 프로필 이름을 씁니다.
 */
function roomNicknameOf(id: string, { groups, members, photos }: HomeTableRows) {
  const nicknameIn = (groupId: string) =>
    members.find((member) => member.user_id === id && member.group_id === groupId)?.nickname;
  const photo = photos.find((row) => row.user_id === id);

  return (
    (photo && nicknameIn(photo.group_id)) ||
    groups.map((group) => nicknameIn(group.id)).find(Boolean)
  );
}

/**
 * @description 표 모양으로 읽어 온 내용을 홈이 그리는 모양으로 바꿉니다. 같은 입력에는 늘 같은 결과를 돌려줍니다.
 *
 * @remarks
 * `rows`는 내 방 것만 담겨 있어야 합니다. 다른 방의 멤버나 사진이 섞이면 친구와 참여자에 그대로 나옵니다. 프로필 사진 주소는 본인이 아무 주소로나 바꿀 수 있어 쓰지 않고, UT 결정대로 첫 글자만 그립니다.
 * @internal
 * @param userId 로그인한 내 id. 나와 친구를 가르는 데 씁니다.
 */
export function toHomeData(userId: string, rows: HomeRows): HomeData {
  const { members, photos, profiles, urls } = rows;
  const profileOf = new Map(profiles.map((profile) => [profile.id, profile]));
  const personOf = (id: string): Participant => ({
    id,
    nickname: profileOf.get(id)?.name ?? '',
    avatarUrl: null,
  });
  const homePersonOf = (id: string): Participant => {
    const person = personOf(id);
    return { ...person, nickname: roomNicknameOf(id, rows) || person.nickname };
  };
  const roomPhotoOf = (photo: PhotoRow) => ({
    url: urls.get(photo.image_path) ?? '',
    uploadedAt: photo.created_at ?? '',
    caption: photo.caption ?? '',
  });

  const friendPhotos = photos.filter((photo) => photo.user_id !== userId);
  const participantIds = [...new Set(friendPhotos.map((photo) => photo.user_id))];
  const memberIds = members.map((member) => member.user_id).filter((id) => id !== userId);
  const friendIds = [...new Set([...participantIds, ...memberIds])];

  const friends: Friend[] = friendIds.map((id) => {
    const photo = friendPhotos.find((friendPhoto) => friendPhoto.user_id === id);

    return { ...homePersonOf(id), photo: photo ? roomPhotoOf(photo) : null };
  });

  return {
    myNickname: homePersonOf(userId).nickname,
    hasSent: photos.some((photo) => photo.user_id === userId),
    participants: participantIds.map(homePersonOf),
    friends,
    rooms: roomsOf(userId, rows, personOf, roomPhotoOf),
  };
}
