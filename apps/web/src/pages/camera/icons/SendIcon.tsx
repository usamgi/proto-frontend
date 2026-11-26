import type { IconProps } from './icon-props';

export function SendIcon({ className = 'size-10', title }: IconProps) {
  return (
    <svg
      viewBox="0.7 13.86 40 40"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path
        d="M24.4329 53.8632L0.727958 30.1583L40.73 13.8612L24.4329 53.8632ZM23.2106 48.1963L34.9519 19.6393L6.2838 31.2695L12.5063 37.492L23.7662 30.825L17.0251 42.0108L23.2106 48.1963Z"
        fill="currentColor"
      />
    </svg>
  );
}
