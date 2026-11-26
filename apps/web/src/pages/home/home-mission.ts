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

/** 홈 화면이 그리는 오늘의 미션 */
export interface HomeMission {
  /** 오늘의 단어 */
  word: string;
  /** 오늘 사진을 올린 사람들. 올린 순서입니다. */
  participants: Participant[];
  /** 칩에 보여 줄 친구들. 앞에서부터 세 명까지 칩이 됩니다. */
  friends: Friend[];
}

/** 방 카드 칸에 보이는 사진. 내가 올린 뒤라 블러 없이 보입니다. */
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
  /** 촬영 화면의 그룹 id와 같습니다. 보낸 그룹의 방만 카드로 보입니다. */
  id: string;
  name: string;
  /** 나를 뺀 방 사람들. 카드에는 이 가운데 세 명이 랜덤으로 보입니다. */
  members: RoomMember[];
}
