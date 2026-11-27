import { useState } from 'react';

interface FadeInPhotoProps {
  /** 사진 주소. 바뀌면 새 사진이 올 때까지 다시 숨깁니다. */
  src: string;
  alt: string;
  className: string;
  /** 방 형성 모션이 이 사진을 찾을 때 쓰는 `data-intro` 값. 모션 대상이 아니면 비웁니다. */
  intro?: string;
}

/**
 * @description 다 받은 뒤에 살짝 나타나는 사진. 받는 동안에는 부모의 배경이 보입니다.
 *
 * @remarks
 * 브라우저에 이미 받아 둔 사진은 그리기 전에 바로 보여서 깜빡이지 않습니다. 모션 줄이기 설정에서는 나타나는 효과 없이 바로 보입니다.
 * @internal
 * @name FadeInPhoto
 * @tag img
 */
export function FadeInPhoto({ src, alt, className, intro }: FadeInPhotoProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  const markIfCached = (image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) setLoadedSrc(src);
  };

  return (
    <img
      ref={markIfCached}
      src={src}
      alt={alt}
      data-intro={intro}
      onLoad={() => setLoadedSrc(src)}
      className={`${className} motion-safe:transition-opacity motion-safe:duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
