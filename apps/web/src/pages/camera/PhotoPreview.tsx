import { useState } from 'react';

import { GroupPicker } from './GroupPicker';
import { RetakeIcon } from './icons/RetakeIcon';
import { SendIcon } from './icons/SendIcon';
import type { CameraGroup } from './mock/camera';
import { VIEWFINDER } from './viewfinder';

const MAX_CAPTION_LENGTH = 20;

interface PhotoPreviewProps {
  /** 방금 찍은 사진의 object URL. 만들고 해제하는 것은 호출부가 맡습니다. */
  photoUrl: string;
  /** 고를 수 있는 내 그룹들 */
  groups: CameraGroup[];
  /** 방 안에서 찍었으면 그 그룹. 있으면 그룹 목록 없이 이 그룹으로 보냅니다. */
  roomGroup: CameraGroup | null;
  onRetake: () => void;
  /** 보내기를 누르면 캡션과 보낼 그룹 id로 불립니다. 그룹이 하나 이상일 때만 불립니다. */
  onSend: (caption: string, groupIds: string[]) => void;
}

/**
 * @description 찍은 사진을 확인하고 캡션과 보낼 그룹을 정하는 미리보기 부분.
 *
 * @remarks
 * 캡션은 20자까지입니다. 방 안에서 찍지 않았으면 그룹을 하나 이상 골라야 보내기가 켜집니다.
 * @internal
 * @name PhotoPreview
 * @tag div
 */
export function PhotoPreview({ photoUrl, groups, roomGroup, onRetake, onSend }: PhotoPreviewProps) {
  const [caption, setCaption] = useState('');
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const targetIds = roomGroup ? [roomGroup.id] : [...selectedIds];
  const canSend = targetIds.length > 0;

  function toggleGroup(groupId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);

      return next;
    });
  }

  return (
    <>
      <div className="px-4">
        <div className={VIEWFINDER}>
          <img src={photoUrl} alt="방금 찍은 사진" className="size-full object-cover" />
          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={MAX_CAPTION_LENGTH}
            placeholder="텍스트를 입력하세요.."
            aria-label="캡션"
            enterKeyHint="done"
            className="absolute bottom-5 left-1/2 field-sizing-content h-11 max-w-[calc(100%-32px)] min-w-24 -translate-x-1/2 rounded-full bg-navy/24 px-4 text-center text-reading-16 font-medium text-white backdrop-blur-[25px] outline-none placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center gap-15 px-4">
          <button
            type="button"
            aria-label="다시 찍기"
            onClick={onRetake}
            className="flex size-13 items-center justify-center"
          >
            <RetakeIcon className="size-9 text-white" />
          </button>
          <button
            type="button"
            aria-label="보내기"
            disabled={!canSend}
            onClick={() => onSend(caption.trim(), targetIds)}
            className="group flex size-21 items-center justify-center rounded-full bg-white/20"
          >
            <SendIcon className="size-10 text-white group-disabled:opacity-50" />
          </button>
          <span aria-hidden className="size-13" />
        </div>
        {!roomGroup && (
          <GroupPicker groups={groups} selectedIds={selectedIds} onToggle={toggleGroup} />
        )}
      </div>
    </>
  );
}
