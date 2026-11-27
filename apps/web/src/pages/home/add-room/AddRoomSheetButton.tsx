import { useEffect, useRef, useState } from 'react';

import { AddIcon } from '@/pages/home/icons/AddIcon';

import { AddRoomSheet } from './AddRoomSheet';

/** `showModal()`만 부르면 브라우저가 첫 링크에 포커스 테두리를 그려, 포커스를 제목에 둡니다. */
function openAddRoomSheet(sheet: HTMLDialogElement | null) {
  if (!sheet) return;

  sheet.showModal();
  sheet.querySelector('h2')?.focus();
}

interface AddRoomSheetButtonProps {
  /** 속한 방이 하나도 없으면 `true`. 이때는 누르지 않아도 시트를 `시작하기`로 엽니다. */
  isFirstStart: boolean;
}

/**
 * @description 누르면 방 추가 바텀시트를 여는 + 버튼. 촬영 전 홈에서 씁니다.
 *
 * @remarks
 * `isFirstStart`가 `true`가 될 때마다 시트를 스스로 엽니다. 방이 없는 동안에는 홈에 들어올 때마다 다시 열립니다.
 * @internal
 * @name AddRoomSheetButton
 * @tag button
 */
export function AddRoomSheetButton({ isFirstStart }: AddRoomSheetButtonProps) {
  const sheetRef = useRef<HTMLDialogElement>(null);
  const [isOpenedByButton, setIsOpenedByButton] = useState(false);
  const isAutoOpened = isFirstStart && !isOpenedByButton;

  useEffect(() => {
    if (isFirstStart) openAddRoomSheet(sheetRef.current);
  }, [isFirstStart]);

  const openByButton = () => {
    setIsOpenedByButton(true);
    openAddRoomSheet(sheetRef.current);
  };

  return (
    <>
      <button type="button" aria-label="방 추가" aria-haspopup="dialog" onClick={openByButton}>
        <AddIcon />
      </button>
      <AddRoomSheet ref={sheetRef} title={isAutoOpened ? '시작하기' : '방 추가'} />
    </>
  );
}
