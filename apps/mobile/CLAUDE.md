@AGENTS.md

## 이 레포에서는

AGENTS.md의 `npx` 명령 대신 pnpm을 쓴다. 패키지 설치는 `pnpm --filter mobile exec expo install <패키지>`, 그 밖의 Expo 명령은 `pnpm --filter mobile exec expo <명령>`이다. 린트와 타입체크는 루트에서 `pnpm lint`, `pnpm typecheck`로 돌린다.
