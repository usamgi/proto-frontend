/** `photos` 표의 캡션 길이 제약과 같습니다. 넘으면 올릴 때 거절됩니다. */
const MAX_CAPTION_LENGTH = 20;

interface CaptionInputProps {
  /** 지금 캡션. 호출부가 소유합니다. */
  value: string;
  /** 글자가 바뀔 때마다 바뀐 캡션으로 불립니다. */
  onChange: (caption: string) => void;
}

/**
 * @description 찍은 사진 위에 겹쳐 두는 캡션 입력.
 *
 * @remarks
 * 상태를 내부에 두지 않는 제어 컴포넌트입니다. 자리를 잡는 기준이 될 `relative` 부모 안에 두어야 합니다.
 * @internal
 * @name CaptionInput
 * @tag input
 */
export function CaptionInput({ value, onChange }: CaptionInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      maxLength={MAX_CAPTION_LENGTH}
      placeholder="텍스트를 입력하세요.."
      aria-label="캡션"
      enterKeyHint="done"
      className="absolute bottom-5 left-1/2 field-sizing-content h-11 max-w-[calc(100%-32px)] min-w-24 -translate-x-1/2 rounded-full bg-navy/24 px-4 text-center text-reading-16 font-medium text-white backdrop-blur-[25px] outline-none placeholder:text-white/50"
    />
  );
}
