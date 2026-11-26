import { useId } from 'react';

import type { CameraGroup } from './mock/camera';

/** 시안의 그룹 아바타 다섯 가지 그라데이션입니다. 그룹 데이터에 색이 없어 id로 하나를 고릅니다. */
const AVATAR_PALETTES = [
  ['#FFB668', '#FFE5FB'],
  ['#68F7FF', '#F1FFE5'],
  ['#FF689A', '#FFE5EE'],
  ['#FFF768', '#FFE5EE'],
  ['#68C5FF', '#EDFFE5'],
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
          <stop stopColor={center} />
          <stop offset="1" stopColor={edge} />
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
  groups: CameraGroup[];
  /** 고른 그룹 id. 호출부가 소유합니다. */
  selectedIds: ReadonlySet<string>;
  /** 그룹을 누를 때마다 그 그룹 id로 불립니다. 고르기와 풀기는 호출부가 정합니다. */
  onToggle: (groupId: string) => void;
}

/**
 * @description 사진을 올릴 그룹을 여러 개 고르는 가로 목록.
 *
 * @remarks
 * 상태를 내부에 두지 않는 제어 컴포넌트입니다. 고른 그룹은 이름이 하늘색이 되고 `aria-pressed`로 읽힙니다.
 * 첫 그룹이 보내기 버튼 바로 아래(화면 가운데)에서 시작해 오른쪽으로 넘어갑니다. 왼쪽 여백은 화면 가운데에서 항목 폭(50)의 절반을 뺀 값입니다.
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
