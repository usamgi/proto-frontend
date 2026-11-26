import type { IconProps } from './icon-props';

export function ShutterIcon({ className = 'size-21 text-blue', title }: IconProps) {
  return (
    <svg
      viewBox="0 0 84 84"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <circle cx="42.2222" cy="42.2225" r="34.2857" fill="white" />
      <circle cx="42" cy="42" r="40.53" strokeWidth="2.94" stroke="currentColor" />
    </svg>
  );
}
