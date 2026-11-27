import type { MouseEvent, Ref } from 'react';
import { Link } from 'react-router';

import { ArrowForwardIcon } from '@/pages/home/icons/ArrowForwardIcon';

const OPTIONS = [
  {
    to: '/group/new',
    title: '방 만들기',
    description: '새로운 방을 만들고 친구들을 초대해요',
    tone: 'bg-blue/20',
  },
  {
    to: '/join',
    title: '초대 링크로 참여하기',
    description: '친구가 보낸 링크로 방에 참여해요',
    tone: 'bg-fill',
  },
];

function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target === event.currentTarget) event.currentTarget.close();
}

interface AddRoomSheetProps {
  ref: Ref<HTMLDialogElement>;
}

/**
 * @description 홈의 + 버튼이 여는 방 추가 바텀시트.
 *
 * @remarks
 * 호출부가 `ref`로 받은 dialog의 `showModal()`을 불러 엽니다. 딤을 누르거나 Esc를 누르면 닫힙니다.
 * @internal
 * @name AddRoomSheet
 * @tag dialog
 */
export function AddRoomSheet({ ref }: AddRoomSheetProps) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="add-room-title"
      onClick={closeOnBackdrop}
      className="inset-x-0 top-auto bottom-0 mx-auto w-full max-w-100.5 rounded-t-[28px] bg-white backdrop:bg-navy/40 motion-safe:backdrop:animate-fade-in motion-safe:open:animate-sheet-up"
    >
      <div className="flex flex-col items-center gap-5 px-4 pt-3 pb-10">
        <span aria-hidden className="h-1 w-10 rounded-xs bg-handle" />
        <h2
          id="add-room-title"
          className="self-stretch text-body-18 leading-5.5 font-bold tracking-normal text-ink"
        >
          방 추가
        </h2>
        <ul className="flex w-full flex-col gap-6">
          {OPTIONS.map(({ to, title, description, tone }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-1.5 rounded-3xl p-5 text-ink ${tone}`}
              >
                <span className="flex flex-1 flex-col gap-1.5">
                  <span className="text-heading leading-9.5 font-bold tracking-normal">
                    {title}
                  </span>
                  <span className="text-body-16 leading-[1.4] font-medium tracking-normal">
                    {description}
                  </span>
                </span>
                <ArrowForwardIcon className="size-6 text-navy" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
