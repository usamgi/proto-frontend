import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { useHasSentPhoto } from '@/shared/services/photos/use-has-sent-photo';
import { useUploadPhoto } from '@/shared/services/photos/use-upload-photo';
import { useTodayShot } from '@/shared/stores/today-shot';

/**
 * @description 찍은 사진을 올리고, 다 올리면 홈으로 옮깁니다.
 *
 * @remarks
 * 화면에 들어올 때 지금 회차에 이미 보낸 방이 있는지 읽어 두고, 그 값으로 홈이 재생할 모션의 종류를 정합니다. 올리는 동안 화면을 떠났으면 다 올린 뒤에도 홈으로 옮기지 않습니다. 실패하면 `hasSendError`가 켜지고 다시 보낼 수 있습니다.
 * @param userId 로그인한 내 id
 * @param missionId 지금 회차의 미션 id. 아직 모르면 `null`이고 `send`는 아무 일도 하지 않습니다.
 * @returns 올리는 중인지 `isSending`, 마지막 시도가 실패했는지 `hasSendError`, 사진과 캡션과 그룹 id로 올리는 `send`
 */
export function useSendPhoto(userId: string, missionId: string | null) {
  const navigate = useNavigate();
  const markSent = useTodayShot((state) => state.markSent);
  const { mutateAsync: uploadPhoto } = useUploadPhoto();
  const hadSent = useHasSentPhoto(userId, missionId);
  const [isSending, setIsSending] = useState(false);
  const [hasSendError, setHasSendError] = useState(false);
  const hasLeftRef = useRef(false);

  useEffect(() => {
    hasLeftRef.current = false;

    return () => {
      hasLeftRef.current = true;
    };
  }, []);

  async function send(photo: Blob, caption: string, groupIds: string[]) {
    if (!missionId) return;

    setIsSending(true);
    setHasSendError(false);
    try {
      await uploadPhoto({ photo, caption, groupIds, userId, missionId });
      if (hasLeftRef.current) return;

      markSent(hadSent ? 'join' : 'form');
      void navigate('/home');
    } catch {
      setHasSendError(true);
      setIsSending(false);
    }
  }

  return { isSending, hasSendError, send };
}
