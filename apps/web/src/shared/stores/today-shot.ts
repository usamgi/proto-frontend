import { create } from 'zustand';

/**
 * @description 사진을 보낸 뒤 홈이 재생할 모션의 종류.
 *
 * @remarks
 * `form`은 지금 회차에 처음 보냈을 때 칩이 방 카드로 모이는 모션입니다. `join`은 이미 보낸 방이 있을 때 방금 보낸 방 카드만 맨 앞에 들어오는 짧은 모션입니다.
 * @public
 */
export type IntroKind = 'form' | 'join';

interface TodayShotState {
  /** 사진을 보낸 뒤 홈이 모션을 시작할 때까지 재생할 모션의 종류입니다. 시작하면 홈이 `null`로 비우므로, 모션 중에 다른 화면에 갔다 와도 다시 재생하지 않습니다. */
  pendingIntro: IntroKind | null;
  /** 촬영 화면이 사진을 다 올린 뒤 부릅니다. */
  markSent: (intro: IntroKind) => void;
  markIntroShown: () => void;
}

/**
 * @description 촬영 화면에서 사진을 보냈다는 것을 홈으로 넘기는 저장소.
 *
 * @remarks
 * 보낸 사진 자체는 홈이 Supabase에서 읽습니다. 이 저장소는 보낸 직후의 모션을 한 번만 재생하기 위해서만 씁니다.
 * @public
 */
export const useTodayShot = create<TodayShotState>()((set) => ({
  pendingIntro: null,
  markSent: (intro) => set({ pendingIntro: intro }),
  markIntroShown: () => set({ pendingIntro: null }),
}));
