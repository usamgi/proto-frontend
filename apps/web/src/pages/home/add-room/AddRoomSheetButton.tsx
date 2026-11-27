import { useRef } from 'react';

import { AddIcon } from '@/pages/home/icons/AddIcon';

import { AddRoomSheet } from './AddRoomSheet';

/**
 * @description 누르면 방 추가 바텀시트를 여는 + 버튼. 촬영 전 홈에서 씁니다.
 *
 * @internal
 * @name AddRoomSheetButton
 * @tag button
 */
export function AddRoomSheetButton() {
  const sheetRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-label="방 추가"
        aria-haspopup="dialog"
        onClick={() => sheetRef.current?.showModal()}
      >
        <AddIcon />
      </button>
      <AddRoomSheet ref={sheetRef} />
    </>
  );
}
