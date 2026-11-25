import type { ComponentProps } from 'react';

const VARIANT = {
  dark: 'bg-navy font-semibold text-white disabled:bg-line',
  kakao: 'bg-kakao font-semibold text-gray-5',
  white: 'border border-[#e4e4e7] bg-white font-semibold text-gray-5',
  outline: 'border border-blue bg-[#fafafa] font-medium text-blue',
};

const SIZE = {
  lg: 'h-14',
  md: 'h-[54px]',
};

interface ButtonProps extends Omit<ComponentProps<'button'>, 'className'> {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  /** 글자 왼쪽에 붙는 아이콘 이미지 */
  icon?: string;
}

export function Button({
  variant = 'dark',
  size = 'lg',
  icon,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex w-full items-center justify-center gap-2.5 rounded-full text-[16px] leading-[22px] ${VARIANT[variant]} ${SIZE[size]}`}
      {...props}
    >
      {icon && <img src={icon} alt="" />}
      {children}
    </button>
  );
}
