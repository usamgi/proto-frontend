/** 뷰파인더와 같은 세로 4:3(가로 3, 세로 4)입니다. 11/25 회의에서 모든 사진 영역을 4:3으로 정했습니다. */
const PHOTO_ASPECT = 3 / 4;
/** 올릴 원본의 긴 변 상한입니다. 상한이 없으면 기기 원본 크기가 그대로 올라갑니다. */
const MAX_LONG_EDGE = 1600;
const JPEG_QUALITY = 0.9;

/**
 * @description 영상의 지금 장면을 뷰파인더처럼 가운데 4:3으로 잘라 JPEG로 만듭니다.
 *
 * @remarks
 * 화면의 `object-cover`와 같은 영역을 자릅니다. 긴 변은 1600px까지 줄입니다.
 * @param video 재생 중인 카메라 영상
 * @param isMirrored 전면 카메라처럼 화면에서 좌우를 뒤집어 보여 줬으면 `true`. 저장되는 사진도 화면과 같게 뒤집습니다.
 * @throws 캔버스를 쓸 수 없거나 JPEG를 만들지 못하면 `Error`
 */
export function capturePhoto(video: HTMLVideoElement, isMirrored: boolean): Promise<Blob> {
  const { videoWidth, videoHeight } = video;
  const cropWidth = Math.min(videoWidth, videoHeight * PHOTO_ASPECT);
  const cropHeight = cropWidth / PHOTO_ASPECT;
  const scale = Math.min(1, MAX_LONG_EDGE / cropHeight);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(cropWidth * scale);
  canvas.height = Math.round(cropHeight * scale);

  const context = canvas.getContext('2d');
  if (!context) return Promise.reject(new Error('캔버스를 쓸 수 없음'));

  if (isMirrored) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  context.drawImage(
    video,
    (videoWidth - cropWidth) / 2,
    (videoHeight - cropHeight) / 2,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('JPEG를 만들지 못함'))),
      'image/jpeg',
      JPEG_QUALITY,
    );
  });
}
