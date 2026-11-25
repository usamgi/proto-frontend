interface ScreenTitleProps {
  /** 줄바꿈은 `\n`으로 */
  title: string;
  subtitle?: string;
}

export function ScreenTitle({ title, subtitle }: ScreenTitleProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-5 whitespace-pre-line">
      <h1 className="text-title font-bold">{title}</h1>
      {subtitle && <p className="text-heading font-semibold">{subtitle}</p>}
    </div>
  );
}
