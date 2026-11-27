import { useEffect, useRef, useState } from 'react';

/** 방금 찍은 사진과 그 미리보기 주소 */
export interface Shot {
  photo: Blob;
  /** 미리보기에 쓰는 object URL */
  url: string;
}

/**
 * @description 방금 찍은 사진 한 장을 들고 있고, 미리보기 주소를 바꾸거나 화면을 떠날 때 해제합니다.
 *
 * @remarks
 * 주소는 effect가 아니라 `replaceShot`에서 바로 해제합니다. effect에서 만들고 지우면 개발 모드의 StrictMode가 보이는 중인 주소를 지웁니다.
 * @returns 지금 사진 `shot`(없으면 `null`)과, 새 사진으로 바꾸거나 `null`로 비우는 `replaceShot`
 */
export function useShot() {
  const [shot, setShot] = useState<Shot | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  function replaceShot(photo: Blob | null) {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);

    const next = photo ? { photo, url: URL.createObjectURL(photo) } : null;
    urlRef.current = next?.url ?? null;
    setShot(next);
  }

  return { shot, replaceShot };
}
