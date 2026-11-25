import type { ReactNode } from 'react';

interface ScreenProps {
  header?: ReactNode;
  /** 화면 아래에 붙는 영역. 주로 CTA 버튼 */
  footer?: ReactNode;
  children: ReactNode;
}

export function Screen({ header, footer, children }: ScreenProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[402px] flex-col pt-[env(safe-area-inset-top)]">
      {header}
      <main className="flex flex-1 flex-col">{children}</main>
      {footer && (
        <footer className="relative px-4 pb-[max(34px,env(safe-area-inset-bottom))]">
          {footer}
        </footer>
      )}
    </div>
  );
}
