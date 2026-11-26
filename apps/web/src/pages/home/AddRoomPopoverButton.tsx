import { useId, useRef } from 'react';

import { AddRoomPopover } from './AddRoomPopover';
import { AddIcon } from './icons/AddIcon';

/** 시안에서 팝오버는 + 버튼 아래 11px에 뜨고, 오른쪽 끝을 상단 여백(16px)에 맞춥니다. */
const POPOVER_GAP_PX = 11;
const HEADER_PADDING_PX = 16;

function placePopover(button: HTMLButtonElement, popover: HTMLElement) {
  const header = button.closest('header');
  if (!header) return;

  popover.style.top = `${button.getBoundingClientRect().bottom + POPOVER_GAP_PX}px`;
  popover.style.right = `${window.innerWidth - header.getBoundingClientRect().right + HEADER_PADDING_PX}px`;
}

/**
 * @description 누르면 바로 아래에 방 추가 팝오버를 여는 + 버튼. 촬영 후 홈에서 씁니다.
 *
 * @remarks
 * 열 때마다 버튼과 감싸는 `header`의 위치를 재서 팝오버 자리를 잡습니다. `header` 안에 두어야 합니다.
 * @internal
 * @name AddRoomPopoverButton
 * @tag button
 */
export function AddRoomPopoverButton() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  return (
    <>
      <button
        type="button"
        aria-label="방 추가"
        popoverTarget={popoverId}
        onClick={(event) => {
          if (popoverRef.current) placePopover(event.currentTarget, popoverRef.current);
        }}
      >
        <AddIcon />
      </button>
      <AddRoomPopover id={popoverId} ref={popoverRef} />
    </>
  );
}
