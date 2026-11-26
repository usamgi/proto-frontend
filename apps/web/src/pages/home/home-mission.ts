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
