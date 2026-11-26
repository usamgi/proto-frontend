/** 오늘 사진을 올린 사람 한 명 */
export interface Participant {
  id: string;
  nickname: string;
  /** 프로필 사진이 없으면 `null`이고, 화면은 닉네임 첫 글자를 그립니다. */
  avatarUrl: string | null;
}

/** 홈 화면이 그리는 오늘의 미션 */
export interface HomeMission {
  /** 오늘의 단어 */
  word: string;
  /** 오늘 사진을 올린 사람들. 올린 순서입니다. */
  participants: Participant[];
}
