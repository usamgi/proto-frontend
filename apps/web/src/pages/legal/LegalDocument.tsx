export interface LegalSection {
  title: string;
  text?: string;
  items?: string[];
}

interface LegalDocumentProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  effectiveDate: string;
}

/** 개인정보처리방침, 서비스 약관처럼 조항을 나열하는 문서 */
export function LegalDocument({ title, intro, sections, effectiveDate }: LegalDocumentProps) {
  return (
    <article className="mx-auto flex min-h-dvh max-w-[640px] flex-col gap-8 px-5 py-10 text-[15px] leading-[1.6]">
      <header className="flex flex-col gap-3">
        <h1 className="text-[26px] leading-[36px] font-bold">{title}</h1>
        <p className="text-ink-sub">{intro}</p>
      </header>
      {sections.map(({ title, text, items }, index) => (
        <section key={title} className="flex flex-col gap-2">
          <h2 className="text-[17px] font-semibold">
            {index + 1}. {title}
          </h2>
          {text && <p>{text}</p>}
          {items && (
            <ul className="list-disc pl-5">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <p className="text-ink-sub">시행일: {effectiveDate}</p>
    </article>
  );
}
