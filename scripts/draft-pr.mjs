import { execFileSync } from 'node:child_process';

/** diff 전체를 넘기면 호출이 길어집니다. 맥락이 끊기지 않는 선에서 자릅니다. */
const MAX_DIFF_BYTES = 120_000;
const TIMEOUT_MS = 180_000;

const INSTRUCTION = `아래는 PR로 올릴 변경이다. PR 제목과 "왜?"를 쓴다.

다음 두 블록만 출력한다. 인사말, 설명, 코드 펜스를 붙이지 않는다.

TITLE: <제목 한 줄>
WHY:
<왜 필요한 변경인지>

제목 규칙
- "타입: 제목" 형식이다. 타입 뒤에 괄호로 범위를 붙이지 않는다. 예: feat: 해시태그 검색 추가
- 50자 이내로 쓰고 명사형으로 끝낸다. "-다"로 끝내지 않는다. 마침표를 찍지 않는다.
- 변경 전체를 대표하는 한 가지를 고른다. 브랜치 이름을 그대로 쓰지 않는다.

읽는 사람
- 이 코드를 처음 보는 동료가 읽는다.
- 쉬운 말로 쓴다. 한 문장에 한 가지만 말한다.
- 함수 이름, 옵션 이름, 파일 이름, 내부 용어는 꼭 필요할 때만 쓴다.
- 비유를 쓰지 않는다. 일어난 일을 그대로 적는다.

"왜?" 규칙
- 이 변경 전에 무엇이 불편했거나 안 됐는지를 한 문장에서 세 문장으로 적는다.
- 어떻게 고쳤는지는 적지 않는다. 그것은 본문의 커밋 목록이 말한다.
- diff에서 읽히지 않는 것을 지어내지 않는다.

문체
- "왜?"의 문장은 존댓말 "-습니다"체로 쓴다. 한 일은 "추가했습니다", "바꿨습니다"처럼 과거형으로 적는다.
- "-다", "-한다"로 끝내지 않는다.
- 문장 끝에 온점을 찍는다. 명사형으로 끝나는 항목에는 찍지 않는다.

한국어 표기 규칙
- 가운뎃점과 줄표를 쓰지 않는다. 쉼표, "와/과", 콜론으로 잇는다.
- 한 문장은 한 줄에 둔다. 폭을 맞추려고 문장을 접지 않는다.
- 영문, 백틱 코드, 숫자 뒤의 조사를 띄우지 않는다.
- 이모지를 쓰지 않는다.`;

function buildPrompt({ subjects, diff }) {
  const truncated =
    Buffer.byteLength(diff) > MAX_DIFF_BYTES
      ? `${diff.slice(0, MAX_DIFF_BYTES)}\n\n(diff가 길어 이후는 잘렸다)`
      : diff;

  return `${INSTRUCTION}

## 커밋

${subjects.map((subject) => `- ${subject}`).join('\n')}

## diff

\`\`\`diff
${truncated}
\`\`\``;
}

function parseDraft(output) {
  const match = output.match(/^TITLE:\s*(.+?)\s*\nWHY:\s*\n([\s\S]+)$/m);
  if (!match) return null;

  const [title, why] = match.slice(1).map((block) => block.trim());
  return title && why ? { title, why } : null;
}

/**
 * @returns `{ title, why }`. CLI가 없거나 실패하면 null
 */
export function draftPr({ subjects, diff }) {
  try {
    const output = execFileSync(
      'claude',
      [
        '-p',
        // 프로젝트 설정의 훅이 초안 실행에 끼어들면 초안 대신 훅에 대한 답이 출력된다
        '--setting-sources',
        'user',
        '--disallowed-tools',
        'Bash Edit Write Read Glob Grep WebFetch WebSearch Task',
      ],
      {
        input: buildPrompt({ subjects, diff }),
        encoding: 'utf8',
        timeout: TIMEOUT_MS,
        stdio: ['pipe', 'pipe', 'ignore'],
      },
    );
    return parseDraft(output.trim());
  } catch {
    return null;
  }
}
