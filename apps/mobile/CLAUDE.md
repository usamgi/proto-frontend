@AGENTS.md

## 이 레포에서는

AGENTS.md의 `npx` 명령 대신 pnpm을 쓴다. 패키지 설치는 `pnpm --filter mobile exec expo install <패키지>`, 그 밖의 Expo 명령은 `pnpm --filter mobile exec expo <명령>`이다. 린트와 타입체크는 루트에서 `pnpm lint`, `pnpm typecheck`로 돌린다.

## EAS 빌드 (`eas.json`)

| 프로필        | 용도                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| `preview`     | **UT용**. 내부 배포 APK. `eas build --platform android --profile preview` |
| `production`  | **스토어 실제 배포용**. AAB. 제출은 `eas submit`과 함께 쓴다              |
| `development` | 개발 클라이언트(dev client)용                                             |

UT·테스터 배포는 `preview`만 쓴다. `production`은 앱스토어/플레이스토어 배포 준비가 됐을 때 쓴다.
