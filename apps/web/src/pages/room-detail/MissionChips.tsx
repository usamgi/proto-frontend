import { formatMissionDate, type MissionChipData } from './room-detail-data';

interface MissionChipsProps {
  chips: MissionChipData[];
  selectedId: string;
  /** 지금 회차의 미션 id. 이 칩은 날짜 대신 "오늘"이라고 씁니다. */
  currentMissionId: string | null;
  onSelect: (missionId: string) => void;
}

/**
 * @description 방 상세 위쪽의 미션 칩 줄. 칩을 누르면 그 미션의 사진으로 바뀝니다.
 *
 * @internal
 * @name MissionChips
 * @tag div
 */
export function MissionChips({ chips, selectedId, currentMissionId, onSelect }: MissionChipsProps) {
  return (
    <div className="flex [scrollbar-width:none] gap-1 overflow-x-auto px-4 py-3">
      {chips.map((chip) => {
        const isSelected = chip.id === selectedId;

        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(chip.id)}
            className={`flex shrink-0 flex-col items-center rounded-xl border bg-white px-5 py-[7px] ${
              isSelected ? 'border-blue bg-linear-to-r from-blue/12 to-blue/12' : 'border-navy/12'
            }`}
          >
            <span className="text-reading-16 font-medium whitespace-nowrap text-navy">
              {chip.keyword}
            </span>
            <span className="flex items-center gap-1 text-[13px] leading-[18px] tracking-[0.2522px] whitespace-nowrap text-navy/50">
              {chip.id === currentMissionId ? '오늘' : formatMissionDate(chip.missionDate)}
              <span aria-hidden className="size-[3.2px] rounded-full bg-navy/12" />
              {chip.doneCount}명
            </span>
          </button>
        );
      })}
    </div>
  );
}
