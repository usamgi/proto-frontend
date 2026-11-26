import type { IconProps } from './icon-props';

export function RetakeIcon({ className = 'size-9', title }: IconProps) {
  return (
    <svg
      viewBox="0 0 36.1589 36.1635"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1948"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path d="M23.3097 1.0974L29.8419 7.62954L23.3097 14.1617" />
      <path d="M1.0974 15.4696V10.2439C1.0974 9.55096 1.37268 8.88637 1.86269 8.39636C2.35269 7.90636 3.01728 7.63107 3.71026 7.63107H29.8388M12.8553 35.0661L6.32311 28.5339L12.8553 22.0018" />
      <path d="M35.0615 20.6948V25.9206C35.0615 26.6135 34.7862 27.2781 34.2962 27.7681C33.8062 28.2581 33.1416 28.5334 32.4486 28.5334H6.32005" />
    </svg>
  );
}
