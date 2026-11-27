import { RetakeIcon } from '@/pages/camera/icons/RetakeIcon';
import { SendIcon } from '@/pages/camera/icons/SendIcon';

interface PreviewActionsProps {
  /** 올리는 중이면 `true`. 두 버튼을 모두 막습니다. */
  isSending: boolean;
  /** 보낼 그룹이 하나도 없으면 `false`. 보내기만 막습니다. */
  canSend: boolean;
  onRetake: () => void;
  onSend: () => void;
}

/**
 * @description 미리보기 아래의 다시 찍기와 보내기 버튼.
 *
 * @internal
 * @name PreviewActions
 * @tag div
 */
export function PreviewActions({ isSending, canSend, onRetake, onSend }: PreviewActionsProps) {
  return (
    <div className="flex items-center justify-center gap-15 px-4">
      <button
        type="button"
        aria-label="다시 찍기"
        disabled={isSending}
        onClick={onRetake}
        className="flex size-13 items-center justify-center"
      >
        <RetakeIcon className="size-9 text-white" />
      </button>
      <button
        type="button"
        aria-label="보내기"
        disabled={!canSend || isSending}
        onClick={onSend}
        className="group flex size-21 items-center justify-center rounded-full bg-white/20 pt-5 pr-5 pb-3.75 pl-4.25"
      >
        <SendIcon className="size-10 text-white group-disabled:opacity-50" />
      </button>
      <span aria-hidden className="size-13" />
    </div>
  );
}
