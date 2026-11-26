import { create } from 'zustand';

/** 오늘 내가 찍어서 보낸 사진 */
export interface TodayShot {
  /** 찍은 사진의 object URL. 다음 사진을 보낼 때 저장소가 이전 URL을 해제합니다. */
  photoUrl: string;
  caption: string;
  /** 보낸 그룹 id */
  groupIds: string[];
  /** ISO 8601 시각 */
  takenAt: string;
}

interface TodayShotState {
  /** 오늘 아직 안 보냈으면 `null`입니다. */
  shot: TodayShot | null;
  /** 보낸 뒤 홈이 방 형성 모션을 시작할 때까지 `true`입니다. 시작하면 홈이 끄므로, 모션 중에 다른 화면에 갔다 와도 다시 재생하지 않습니다. */
  isIntroPending: boolean;
  send: (shot: TodayShot) => void;
  markIntroShown: () => void;
}

/**
 * @description 촬영 화면에서 보낸 사진을 홈으로 넘기는 저장소.
 *
 * @remarks
 * Supabase 연동 전까지만 씁니다. 새로고침하면 비워집니다. 연동하면 홈은 Supabase에서 오늘 올렸는지를 읽습니다.
 * @internal
 */
export const useTodayShot = create<TodayShotState>()((set, get) => ({
  shot: null,
  isIntroPending: false,
  send: (shot) => {
    const previous = get().shot;
    if (previous && previous.photoUrl !== shot.photoUrl) URL.revokeObjectURL(previous.photoUrl);
    set({ shot, isIntroPending: true });
  },
  markIntroShown: () => set({ isIntroPending: false }),
}));
