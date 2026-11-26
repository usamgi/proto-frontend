import type { IconProps } from './icon-props';

export function GalleryIcon({ className = 'size-13', title }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path
        d="M20.8 29.8132H36.56L31.3332 22.8532L27.36 28.0532L24.72 24.6668L20.8 29.8132ZM18 36.6668C17.28 36.6668 16.6556 36.4023 16.1268 35.8732C15.5977 35.3444 15.3332 34.72 15.3332 34V12.6668C15.3332 11.9468 15.5977 11.3223 16.1268 10.7932C16.6556 10.2644 17.28 10 18 10H39.3332C40.0532 10 40.6777 10.2644 41.2068 10.7932C41.7356 11.3223 42 11.9468 42 12.6668V34C42 34.72 41.7356 35.3444 41.2068 35.8732C40.6777 36.4023 40.0532 36.6668 39.3332 36.6668H18ZM18 34H39.3332V12.6668H18V34ZM12.6668 42C11.9468 42 11.3223 41.7356 10.7932 41.2068C10.2644 40.6777 10 40.0532 10 39.3332V15.3332H12.6668V39.3332H36.6668V42H12.6668Z"
        fill="currentColor"
      />
    </svg>
  );
}
