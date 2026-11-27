import { useEffect, useRef, useState } from 'react';

/** 카메라 방향. 후면(`environment`)과 전면(`user`)입니다. */
export type Facing = 'environment' | 'user';
/** 카메라 상태. `denied`는 권한을 거부했을 때, `unavailable`은 그 밖의 이유로 켜지 못했을 때입니다. */
export type CameraStatus = 'starting' | 'ready' | 'denied' | 'unavailable';

/** 4:3으로 잘라도 1600px을 넘게 남도록 넉넉히 요청합니다. 기기가 못 주면 가까운 값을 줍니다. */
const IDEAL_LONG_EDGE = 1920;

function toStatus(error: unknown): CameraStatus {
  const isDenied =
    error instanceof DOMException &&
    (error.name === 'NotAllowedError' || error.name === 'SecurityError');

  return isDenied ? 'denied' : 'unavailable';
}

function openStream(facing: Facing) {
  if (!navigator.mediaDevices?.getUserMedia) {
    return Promise.reject(new Error('getUserMedia를 쓸 수 없는 환경'));
  }

  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: facing, width: { ideal: IDEAL_LONG_EDGE } },
  });
}

/**
 * @description 카메라를 켜서 `videoRef`에 연결하고, 이 훅을 쓰는 컴포넌트가 사라지면 트랙을 모두 멈춥니다.
 *
 * @remarks
 * 권한은 처음 켤 때 OS 모달로 묻습니다. 영상 크기를 알게 된 뒤에 `ready`가 됩니다. 방향을 바꾸거나 다시 시도할 때는 호출부가 이 훅을 쓰는 컴포넌트를 새로 그려 `starting`부터 다시 시작합니다.
 * @param facing 후면(`environment`) 또는 전면(`user`)
 * @returns 영상을 붙일 `videoRef`와 카메라 상태 `status`
 */
export function useCamera(facing: Facing) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>('starting');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isCancelled = false;

    openStream(facing)
      .then((opened) => {
        const video = videoRef.current;
        if (isCancelled || !video) {
          opened.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = opened;
        video.onloadedmetadata = () => {
          if (!isCancelled) setStatus('ready');
        };
        video.srcObject = opened;
      })
      .catch((error: unknown) => {
        if (!isCancelled) setStatus(toStatus(error));
      });

    return () => {
      isCancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facing]);

  return { videoRef, status };
}
