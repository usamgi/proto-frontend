import { useId } from 'react';

import type { GroupRow } from '@/shared/services/rooms/room-types';

/** 그룹 데이터에 색이 없어 id로 다섯 그라데이션 가운데 하나를 고릅니다. 가운데 색과 가장자리 색 순입니다. */
const AVATAR_PALETTES = [
  ['var(--color-group-1-center)', 'var(--color-group-1-edge)'],
  ['var(--color-group-2-center)', 'var(--color-group-2-edge)'],
  ['var(--color-group-3-center)', 'var(--color-group-3-edge)'],
  ['var(--color-group-4-center)', 'var(--color-group-4-edge)'],
  ['var(--color-group-5-center)', 'var(--color-group-5-edge)'],
] as const;

function paletteOf(groupId: string) {
  const sum = [...groupId].reduce((total, char) => total + char.charCodeAt(0), 0);

  return AVATAR_PALETTES[sum % AVATAR_PALETTES.length];
}

function GroupAvatar({ groupId, isSelected }: { groupId: string; isSelected: boolean }) {
  const gradientId = useId();
  const [center, edge] = paletteOf(groupId);

  return (
    <svg viewBox="0 0 36 36" aria-hidden className="size-9">
      <defs>
        <radialGradient id={gradientId}>
          <stop style={{ stopColor: center }} />
          <stop offset="1" style={{ stopColor: edge }} />
        </radialGradient>
      </defs>
      <circle
        cx="18"
        cy="18"
        r="17.3"
        fill="none"
        stroke="currentColor"
        strokeWidth={isSelected ? 1.4 : 1.2}
        className={isSelected ? 'text-sky' : 'text-white/20'}
      />
      <circle cx="18" cy="18" r="15" fill={`url(#${gradientId})`} />
    </svg>
  );
}

interface GroupPickerProps {
  groups: GroupRow[];
  /** 고른 그룹 id. 호출부가 소유합니다. */
  selectedIds: ReadonlySet<string>;
  /** 그룹을 누를 때마다 그 그룹 id로 불립니다. 고르기와 풀기는 호출부가 정합니다. */
  onToggle: (groupId: string) => void;
}

/**
 * @description 사진을 올릴 그룹을 여러 개 고르는 가로 목록.
 *
 * @remarks
 * 상태를 내부에 두지 않는 제어 컴포넌트입니다. 고른 그룹은 `aria-pressed`로 읽힙니다.
 * @internal
 * @name GroupPicker
 * @tag ul
 */
export function GroupPicker({ groups, selectedIds, onToggle }: GroupPickerProps) {
  return (
    <ul className="flex [scrollbar-width:none] gap-3 overflow-x-auto pr-4 pl-[calc(50%-25px)]">
      {groups.map(({ id, name }) => {
        const isSelected = selectedIds.has(id);

        return (
          <li key={id} className="shrink-0">
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(id)}
              className="flex w-12.5 flex-col items-center gap-1.5"
            >
              <GroupAvatar groupId={id} isSelected={isSelected} />
              <span
                className={`w-full truncate text-center font-logo text-body-14 leading-normal font-bold tracking-[0.14px] ${isSelected ? 'text-sky' : 'text-white/50'}`}
              >
                {name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
