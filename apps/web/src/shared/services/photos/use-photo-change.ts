import { useEffect, useEffectEvent } from 'react';

import { servSubscribePhotoChange } from './photo-services';

/**
 * @description 화면에 있는 동안 내 방의 사진이 올라오거나 바뀌면 `onChange`를 부릅니다. 화면을 떠나면 구독을 끕니다.
 *
 * @remarks
 * 다른 사람이 보낸 사진도, 내가 보낸 사진도 알립니다. 무엇을 다시 읽을지는 호출부가 정합니다.
 * @public
 * @param onChange 사진이 바뀔 때마다 불립니다. 렌더마다 새 함수를 넘겨도 구독을 다시 켜지 않습니다.
 */
export function usePhotoChange(onChange: () => void) {
  const handleChange = useEffectEvent(onChange);

  useEffect(() => servSubscribePhotoChange(() => handleChange()), []);
}
