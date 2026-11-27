import { useState } from 'react';

import { FlipCameraIcon } from '@/pages/camera/icons/FlipCameraIcon';
import { GalleryIcon } from '@/pages/camera/icons/GalleryIcon';
import { ShutterIcon } from '@/pages/camera/icons/ShutterIcon';
import { VIEWFINDER } from '@/pages/camera/viewfinder';
import { Button } from '@/shared/ui/Button';

import { capturePhoto } from './capture-photo';
import { useCamera, type CameraStatus, type Facing } from './use-camera';

const NOTICES: Record<
  Exclude<CameraStatus, 'starting' | 'ready'>,
  { title: string; description: string }
> = {
  denied: {
    title: '카메라 권한이 필요해요',
    description: '설정에서 카메라 접근을 허용한 뒤 다시 시도해 주세요',
  },
  unavailable: {
    title: '카메라를 열 수 없어요',
    description: '다른 앱이 카메라를 쓰고 있지 않은지 확인해 주세요',
  },
};

function CameraNotice({
  status,
  onRetry,
}: {
  status: 'denied' | 'unavailable';
  onRetry: () => void;
}) {
  const { title, description } = NOTICES[status];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-heading font-semibold text-white">{title}</p>
        <p className="text-body-14 leading-5 text-white/60">{description}</p>
      </div>
      <Button variant="white" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

interface CameraViewProps {
  /** 셔터를 눌러 만든 4:3 JPEG로 불립니다. 이 컴포넌트가 사라지면 카메라가 꺼집니다. */
  onCapture: (photo: Blob) => void;
}

interface CameraSessionProps extends CameraViewProps {
  facing: Facing;
  onFlip: () => void;
  onRetry: () => void;
}

/** 카메라 한 번을 켜서 찍는 동안의 화면입니다. 방향이나 다시 시도가 바뀌면 호출부가 `key`로 새로 그립니다. */
function CameraSession({ facing, onFlip, onRetry, onCapture }: CameraSessionProps) {
  const { videoRef, status } = useCamera(facing);
  const [isCapturing, setIsCapturing] = useState(false);
  const isMirrored = facing === 'user';
  const isBlocked = status === 'denied' || status === 'unavailable';

  async function handleCapture() {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      onCapture(await capturePhoto(videoRef.current, isMirrored));
    } catch {
      setIsCapturing(false);
    }
  }

  return (
    <>
      <div className="px-4">
        <div className={VIEWFINDER}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`size-full object-cover ${isMirrored ? '-scale-x-100' : ''}`}
          />
          {isBlocked && <CameraNotice status={status} onRetry={onRetry} />}
        </div>
      </div>

      <div className="flex items-center justify-center gap-15 px-4">
        <button type="button" disabled aria-label="사진첩" className="opacity-50">
          <GalleryIcon className="size-13 text-white" />
        </button>
        <button
          type="button"
          aria-label="사진 찍기"
          disabled={status !== 'ready' || isCapturing}
          onClick={() => void handleCapture()}
          className="disabled:opacity-50"
        >
          <ShutterIcon />
        </button>
        <button type="button" aria-label="카메라 바꾸기" onClick={onFlip}>
          <FlipCameraIcon className="size-13 text-white" />
        </button>
      </div>
    </>
  );
}

/**
 * @description 카메라 영상을 뷰파인더에 띄우고 셔터, 사진첩(비활성), 카메라 바꾸기를 두는 촬영 부분.
 *
 * @remarks
 * 처음 그려질 때 카메라 권한을 묻고, 사라지면 카메라를 끕니다. 카메라를 바꾸거나 다시 시도하면 새 카메라가 준비될 때까지 셔터가 꺼집니다.
 * @internal
 * @name CameraView
 * @tag div
 */
export function CameraView({ onCapture }: CameraViewProps) {
  const [facing, setFacing] = useState<Facing>('environment');
  const [attempt, setAttempt] = useState(0);

  return (
    <CameraSession
      key={`${facing}-${attempt}`}
      facing={facing}
      onFlip={() => setFacing((current) => (current === 'user' ? 'environment' : 'user'))}
      onRetry={() => setAttempt((count) => count + 1)}
      onCapture={onCapture}
    />
  );
}
