import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { CameraView } from './CameraView';
import { BackIcon } from './icons/BackIcon';
import { MOCK_GROUPS, MOCK_WORD } from './mock/camera';
import { PhotoPreview } from './PhotoPreview';

const CHIP = 'flex items-center justify-center rounded-full bg-white/20';

/**
 * @description 카메라로 찍고, 찍은 사진에 캡션과 보낼 그룹을 정하는 촬영 화면.
 *
 * @remarks
 * 셔터를 누르면 같은 주소에서 미리보기로 바뀌고 카메라는 꺼집니다. `?group=`은 내 그룹 목록에 있을 때만 방 안에서 찍은 것으로 봅니다. 연동 전이라 보내기는 사진을 버리고 홈으로 갑니다.
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
          onSend={() => void navigate('/home')}
        />
      ) : (
        <CameraView onCapture={handleCapture} />
      )}
    </main>
  );
}
