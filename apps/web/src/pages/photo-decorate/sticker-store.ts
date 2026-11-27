import { create } from 'zustand';

/** 사진에 붙인 이모지 하나. 위치는 찍은 사진 전체(3:4) 폭·높이에 대한 비율(0~1)로, 이모지의 가운데입니다. 화면에서 잘려 보이는 범위와 상관없이 사진 속 같은 자리를 가리킵니다. */
export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

interface StickerState {
  /** 사진(저장소 경로)마다 붙인 이모지들 */
  byPhoto: Record<string, Sticker[]>;
  add: (photoKey: string, emoji: string, x: number, y: number) => void;
  move: (photoKey: string, id: string, x: number, y: number) => void;
  remove: (photoKey: string, id: string) => void;
}

/**
 * @description 사진에 붙인 이모지를 기억하는 저장소.
 *
 * @remarks
 * UT용이라 서버(`reactions`)에 보내지 않고 메모리에만 둡니다. 앱을 쓰는 동안은 화면을 오가도 남고, 새로고침하면 사라집니다. 다른 사람에게는 보이지 않습니다.
 * @internal
 */
export const useStickers = create<StickerState>()((set) => ({
  byPhoto: {},
  add: (photoKey, emoji, x, y) =>
    set(({ byPhoto }) => ({
      byPhoto: {
        ...byPhoto,
        [photoKey]: [...(byPhoto[photoKey] ?? []), { id: crypto.randomUUID(), emoji, x, y }],
      },
    })),
  move: (photoKey, id, x, y) =>
    set(({ byPhoto }) => ({
      byPhoto: {
        ...byPhoto,
        [photoKey]: (byPhoto[photoKey] ?? []).map((sticker) =>
          sticker.id === id ? { ...sticker, x, y } : sticker,
        ),
      },
    })),
  remove: (photoKey, id) =>
    set(({ byPhoto }) => ({
      byPhoto: {
        ...byPhoto,
        [photoKey]: (byPhoto[photoKey] ?? []).filter((sticker) => sticker.id !== id),
      },
    })),
}));
