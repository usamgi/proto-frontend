import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { useTodayShot } from '@/shared/stores/today-shot';

import { CameraView } from './CameraView';
import { BackIcon } from './icons/BackIcon';
import { MOCK_GROUPS, MOCK_WORD } from './mock/camera';
import { PhotoPreview } from './PhotoPreview';

const CHIP = 'flex items-center justify-center rounded-full bg-white/20';

/**
 * @description 카메라로 찍고, 찍은 사진에 캡션과 보낼 그룹을 정하는 촬영 화면.
 *
 * @remarks
 * 셔터를 누르면 같은 주소에서 미리보기로 바뀌고 카메라는 꺼집니다. `?group=`은 내 그룹 목록에 있을 때만 방 안에서 찍은 것으로 봅니다. 보내면 사진을 `useTodayShot`에 넘기고 홈으로 갑니다. 넘긴 URL은 저장소가 해제하므로 이 화면이 사라질 때 해제하지 않습니다. 연동 전이라 어디에도 올리지 않습니다.
 * @internal
 * @name CameraPage
 * @tag main
 */
export function CameraPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomGroup = MOCK_GROUPS.find((group) => group.id === searchParams.get('group')) ?? null;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const photoUrlRef = useRef<string | null>(null);
  const sendShot = useTodayShot((state) => state.send);

  useEffect(
    () => () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    },
    [],
  );

  function handleCapture(photo: Blob) {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);

    const url = URL.createObjectURL(photo);
    photoUrlRef.current = url;
    setPhotoUrl(url);
  }

  function handleSend(caption: string, groupIds: string[]) {
    if (!photoUrl) return;

    sendShot({ photoUrl, caption, groupIds, takenAt: new Date().toISOString() });
    photoUrlRef.current = null;
    void navigate('/home');
  }

  function handleRetake() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrlRef.current = null;
    setPhotoUrl(null);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-100.5 flex-col gap-8 bg-navy pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <header className="flex items-center justify-between px-4 py-3">
        <Link to="/home" aria-label="뒤로 가기" className={`${CHIP} size-11`}>
          <BackIcon className="size-6 text-white" />
        </Link>
        <p className={`${CHIP} h-11 px-4 text-reading-16 font-medium text-white`}>{MOCK_WORD}</p>
        <span aria-hidden className="size-11" />
      </header>

      {photoUrl ? (
        <PhotoPreview
          photoUrl={photoUrl}
          groups={MOCK_GROUPS}
          roomGroup={roomGroup}
          onRetake={handleRetake}
          onSend={handleSend}
        />
      ) : (
        <CameraView onCapture={handleCapture} />
      )}
    </main>
  );
}
