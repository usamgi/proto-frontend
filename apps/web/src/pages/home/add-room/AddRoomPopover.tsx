import type { Ref } from 'react';
import { Link } from 'react-router';

import { GroupAddIcon } from '@/pages/home/icons/GroupAddIcon';
import { LinkIcon } from '@/pages/home/icons/LinkIcon';

const ITEMS = [
  { to: '/group/new', label: '방 만들기', Icon: GroupAddIcon },
  { to: '/join', label: '초대 링크로 참여하기', Icon: LinkIcon },
];

interface AddRoomPopoverProps {
  id: string;
  ref: Ref<HTMLDivElement>;
}

/**
 * @description 촬영 후 홈의 + 버튼 아래에 뜨는 방 추가 메뉴.
 *
 * @remarks
 * 브라우저 popover로 띄웁니다. 호출부가 버튼의 `popoverTarget`에 `id`를 걸고, 열기 전에 `style.top`과 `style.right`로 자리를 잡습니다. 바깥을 누르거나 Esc를 누르면 닫힙니다.
 * @internal
 * @name AddRoomPopover
 * @tag div
 */
export function AddRoomPopover({ id, ref }: AddRoomPopoverProps) {
  return (
    <div
      id={id}
      ref={ref}
      popover="auto"
      // check-style-disable-next-line — 브라우저가 popover에 주는 기본 margin(auto)을 지워야 호출부가 잡은 자리에 뜬다
      className="fixed [inset:auto] [margin:0] w-50 rounded-2xl bg-white p-1.5 drop-shadow-menu"
    >
      <ul className="flex flex-col">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.75 text-menu-15 font-semibold text-navy"
            >
              <Icon className="size-6" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
