import type { HTMLAttributes, ReactNode, Ref } from 'react';

import type { Sticker } from './sticker-store';

/** 시안의 꾸미기 사진 폭. 이 폭에서 이모지가 시안 크기(52px, 글자 28px)로 보입니다. */
const DESIGN_PHOTO_WIDTH = 370;

/** 칸 크기가 바뀔 때마다 사진 전체(3:4) 폭에 맞는 이모지 배율을 `--sticker-scale`로 적어 둡니다. */
function trackStickerScale(layer: HTMLDivElement | null) {
  if (!layer) return;
  const update = () => {
    const photoWidth = Math.max(layer.offsetWidth, layer.offsetHeight * 0.75);
    layer.style.setProperty('--sticker-scale', String(photoWidth / DESIGN_PHOTO_WIDTH));
  };
  update();
  const observer = new ResizeObserver(update);
  observer.observe(layer);

  return () => observer.disconnect();
}

interface StickerAreaProps {
  /** 사진 전체(3:4) 영역. 끌어 놓은 위치를 이 영역 기준 비율로 바꿀 때 씁니다. */
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
}

/**
 * @description 붙인 이모지를 사진 위에 그리는 층. 부모 칸을 꽉 채워야 합니다.
 *
 * @remarks
 * 찍은 사진은 늘 3:4이고 화면은 칸에 맞춰 `object-cover`로 자릅니다. 이 층도 같은 방식으로 3:4 영역을 칸에 덮어 그려서, 칸 모양이 달라도(꾸미기 화면과 방 상세 칸) 이모지가 사진 속 같은 자리에 옵니다. 이모지는 시안 크기로 그린 뒤 사진 폭에 맞춰 통째로 줄입니다. 글자 크기를 줄이면 이모지 글꼴이 크기마다 조금씩 달리 그려져 동그라미 안에서 어긋나 보입니다. 칸 밖으로 나간 부분은 부모가 잘라야 합니다(`overflow-hidden`). 이 층은 누르기를 받지 않고, 이모지마다 따로 켭니다.
 * @internal
 * @name StickerArea
 * @tag div
 */
export function StickerArea({ ref, children }: StickerAreaProps) {
  return (
    <div
      ref={trackStickerScale}
      className="[container-type:size] pointer-events-none absolute inset-0"
    >
      <div
        ref={ref}
        className="absolute top-1/2 left-1/2 aspect-3/4 w-[max(100cqw,75cqh)] -translate-1/2"
      >
        {children}
      </div>
    </div>
  );
}

interface StickerMarkProps extends HTMLAttributes<HTMLSpanElement> {
  sticker: Sticker;
  /** 동그라미 안 이모지 글자에 붙이는 클래스. 줄인 이모지의 글자 위치를 다듬을 때 씁니다. */
  glyphClassName?: string;
}

/**
 * @description 사진에 붙인 이모지 하나. `StickerArea` 안에서 씁니다.
 *
 * @internal
 * @name StickerMark
 * @tag span
 */
export function StickerMark({
  sticker,
  className = '',
  glyphClassName = '',
  ...rest
}: StickerMarkProps) {
  return (
    <span
      {...rest}
      style={{
        left: `${sticker.x * 100}%`,
        top: `${sticker.y * 100}%`,
        scale: 'var(--sticker-scale, 1)',
      }}
      className={`absolute flex size-13 -translate-1/2 items-center justify-center rounded-full bg-white/40 text-[28px] leading-8 text-[#111] backdrop-blur-[10px] select-none ${className}`}
    >
      <span className={glyphClassName}>{sticker.emoji}</span>
    </span>
  );
}
