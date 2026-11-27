import { create } from 'zustand';

interface TodayShotState {
  /** 사진을 보낸 뒤 홈이 방 형성 모션을 시작할 때까지 `true`입니다. 시작하면 홈이 끄므로, 모션 중에 다른 화면에 갔다 와도 다시 재생하지 않습니다. */
  isIntroPending: boolean;
  /** 촬영 화면이 사진을 다 올린 뒤 부릅니다. */
  markSent: () => void;
  markIntroShown: () => void;
}

/**
 * @description 촬영 화면에서 사진을 보냈다는 것을 홈으로 넘기는 저장소.
 *
 * @remarks
 * 보낸 사진 자체는 홈이 Supabase에서 읽습니다. 이 저장소는 방 형성 모션을 한 번만 재생하기 위해서만 씁니다.
 * @public
 */
export const useTodayShot = create<TodayShotState>()((set) => ({
  isIntroPending: false,
  markSent: () => set({ isIntroPending: true }),
  markIntroShown: () => set({ isIntroPending: false }),
}));
