import cancel from '../../assets/cancel.svg';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 입력칸 왼쪽에 붙는 아이콘 이미지 */
  icon?: string;
}

export function TextField({
  value,
  onChange,
  placeholder = '텍스트를 입력해주세요',
  icon,
}: TextFieldProps) {
  return (
    <div className="flex h-[54px] items-center gap-1.5 rounded-full border border-line bg-white px-5">
      {icon && <img src={icon} alt="" />}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[16px] leading-[38px] font-medium outline-none placeholder:text-line"
      />
      <button type="button" aria-label="지우기" onClick={() => onChange('')}>
        <img src={cancel} alt="" />
      </button>
    </div>
  );
}
