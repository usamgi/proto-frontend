interface ErrorTextProps {
  /** 사용자에게 보일 안내 문구. 테이블이나 정책 이름을 넣지 않습니다. */
  children: string;
}

/**
 * @description 서버 요청이 실패했을 때 입력칸 아래에 띄우는 안내.
 *
 * @remarks
 * 화면 읽기 프로그램이 바로 읽도록 `role="alert"`로 그립니다.
 * @internal
 * @name ErrorText
 * @tag p
 * @role alert
 */
export function ErrorText({ children }: ErrorTextProps) {
  return (
    <p role="alert" className="pt-2 text-center text-body-14 font-medium text-ink-mute">
      {children}
    </p>
  );
}
