# proto-frontend

오늘의 미션 카메라의 UT용 프론트엔드. 오늘의 키워드에 맞는 사진을 찍고, 그룹 친구들의 같은 주제 사진을 나란히 보는 앱이다. 서버는 별도로 구현한 뒤 합친다.

## 스택

pnpm 12 workspace, Node 22, TypeScript 6, Tailwind CSS 4.

- `apps/mobile`: Expo SDK 58, expo-router, React Native 0.88, Uniwind(RN에서 Tailwind `className`). 작업 전에 `apps/mobile/AGENTS.md`를 따른다
- `apps/web`: React 19, Vite 8
- `packages/shared`: 두 앱이 함께 쓰는 코드(`@proto/shared`)

## 명령어

```bash
pnpm mobile       # Expo 개발 서버
pnpm web          # http://localhost:5173
pnpm typecheck    # 전체 타입체크
pnpm lint         # 전체 ESLint. 경고도 실패
pnpm format       # Prettier
pnpm pr           # push 하고 main 대상 PR 열기/갱신. --dry-run은 .pr-body.md만 만든다
```

네이티브 라이브러리는 `pnpm --filter mobile exec expo install <패키지>`로 설치한다. 작업을 마치기 전에 `pnpm typecheck`와 `pnpm lint`를 돌린다.

## 작업 원칙

1. 코딩 전에 생각한다. 가정을 말로 적고, 해석이 여럿이면 고르지 말고 보여 주고, 더 단순한 길이 있으면 말한다. 모호하면 멈추고 묻는다.
2. 단순함이 먼저다. 요청한 것만 만든다. 한 번 쓰는 코드에 추상화를 씌우지 않고, 요청 없는 설정 가능성과 일어나지 않을 에러 처리를 넣지 않는다. 200줄을 50줄로 쓸 수 있으면 다시 쓴다.
3. 필요한 곳만 고친다. 요청과 무관한 코드, 주석, 포맷을 건드리지 않는다. 내 변경이 만든 고아만 지우고, 원래 있던 dead code는 말만 한다. 바뀐 줄마다 요청으로 거슬러 올라갈 수 있어야 한다.
4. 성공 조건을 먼저 정한다. "버그를 고친다"가 아니라 "재현 테스트를 쓰고 통과시킨다"로 바꾼다. 여러 단계면 단계마다 확인 방법을 붙인다.
5. 공통 컴포넌트를 먼저 찾는다. 컴포넌트를 만들기 전에 `src/shared/ui`에 같은 역할이 있는지 확인하고, 있으면 그것을 쓴다. 없으면 만든다. 있는데 시안과 조금 다르면(색, 크기, 구조) 공통 컴포넌트를 고칠지 새 컴포넌트를 만들지 내가 정하지 않고 사용자에게 묻는다. 다른 점을 짚어서 보여 주고 결정을 기다린다.

## 스타일

- Tailwind 4라 설정은 `tailwind.config`가 아니라 엔트리 CSS의 `@theme`에 한다. mobile은 `apps/mobile/src/global.css`, web은 `apps/web/src/index.css`
- `apps/mobile/src/uniwind-types.d.ts`는 Metro가 생성한다. 손으로 고치지 않는다

## 커밋

Conventional Commits에 한글 제목(`feat: 그룹 생성 화면 추가`). type은 feat, fix, refactor, style, docs, test, chore, build, ci, perf, revert. commitlint가 `commit-msg` 훅과 CI에서 검사한다. 기능 브랜치는 `main`에서 `타입/작업이름`으로 딴다(`feat/group-create`, `fix/comment-keyboard`).
