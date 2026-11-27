import { useState } from 'react';

import { VIEWFINDER } from '@/pages/camera/viewfinder';
import type { GroupRow } from '@/shared/services/rooms/room-types';

import { CaptionInput } from './CaptionInput';
import { GroupPicker } from './GroupPicker';
import { PreviewActions } from './PreviewActions';

interface PhotoPreviewProps {
  /** 방금 찍은 사진의 object URL. 만들고 해제하는 것은 호출부가 맡습니다. */
  photoUrl: string;
  /** 고를 수 있는 내 그룹들 */
  groups: GroupRow[];
  /** 방 안에서 찍었으면 그 그룹. 있으면 그룹 목록 없이 이 그룹으로 보냅니다. */
  roomGroup: GroupRow | null;
  /** 올리는 중이면 `true`. 보내기와 다시 찍기를 막습니다. */
  isSending: boolean;
  /** 오늘의 단어가 없는 것처럼 보낼 수 없는 까닭이 있으면 `true`. 보내기만 막고 다시 찍기는 둡니다. */
  isSendBlocked: boolean;
  onRetake: () => void;
  /** 보내기를 누르면 캡션과 보낼 그룹 id로 불립니다. 그룹이 하나 이상일 때만 불립니다. */
  onSend: (caption: string, groupIds: string[]) => void;
}

/**
 * @description 찍은 사진을 확인하고 캡션과 보낼 그룹을 정하는 미리보기 부분.
 *
 * @remarks
 * 방 안에서 찍지 않았으면 그룹을 하나 이상 골라야 보내기가 켜집니다.
 * @internal
 * @name PhotoPreview
 * @tag div
 */
export function PhotoPreview({
  photoUrl,
  groups,
  roomGroup,
  isSending,
  isSendBlocked,
  onRetake,
  onSend,
}: PhotoPreviewProps) {
  const [caption, setCaption] = useState('');
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const targetIds = roomGroup ? [roomGroup.id] : [...selectedIds];
  const canSend = targetIds.length > 0 && !isSendBlocked;

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
          <CaptionInput value={caption} onChange={setCaption} />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <PreviewActions
          isSending={isSending}
          canSend={canSend}
          onRetake={onRetake}
          onSend={() => onSend(caption.trim(), targetIds)}
        />
        {!roomGroup && (
          <GroupPicker groups={groups} selectedIds={selectedIds} onToggle={toggleGroup} />
        )}
      </div>
    </>
  );
}
