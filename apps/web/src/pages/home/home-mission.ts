/** 오늘 사진을 올린 사람 한 명 */
export interface Participant {
  id: string;
  nickname: string;
  /** 프로필 사진이 없으면 `null`이고, 화면은 닉네임 첫 글자를 그립니다. */
  avatarUrl: string | null;
}

/** 친구가 오늘 올린 사진 */
export interface FriendPhoto {
  url: string;
  /** ISO 8601 시각. 칩에 "2시간 전"처럼 지난 시간으로 그립니다. */
  uploadedAt: string;
}

/** 홈 칩에 나오는 친구 한 명 */
export interface Friend extends Participant {
  /** 오늘 아직 안 올렸으면 `null`입니다. */
  photo: FriendPhoto | null;
}

/** 방 카드 칸에 보이는 사진. 내가 그 방에 아직 안 보냈으면 화면이 가려서 그립니다. */
export interface RoomPhoto extends FriendPhoto {
  /** 캡션이 없으면 빈 문자열입니다. */
  caption: string;
}

/** 방 카드 한 칸에 보이는 방 사람 */
export interface RoomMember extends Participant {
  /** 오늘 아직 안 올렸으면 `null`입니다. */
  photo: RoomPhoto | null;
}

/** 촬영 후 홈의 방 하나 */
export interface Room {
  /** 촬영 화면의 그룹 id와 같습니다. */
  id: string;
  name: string;
  /** 내가 이 방에 보낸 사진. 이 방에 아직 안 보냈으면 `null`입니다. */
  myPhoto: RoomPhoto | null;
  /** 나를 뺀 방 사람들. 카드에는 이 가운데 세 명이 랜덤으로 보입니다. */
  members: RoomMember[];
}

/** 홈이 그리는 오늘 지금 회차의 데이터 */
export interface HomeData {
  myNickname: string;
  /** 지금 회차에 내 방 가운데 한 곳에라도 사진을 보냈으면 `true`입니다. */
  hasSent: boolean;
  /** 내 방들에서 지금 회차에 올린 사람들(나 제외). 올린 순서입니다. */
  participants: Participant[];
  /** 칩에 보일 친구들. 올린 친구가 앞에 옵니다. */
  friends: Friend[];
  rooms: Room[];
}
