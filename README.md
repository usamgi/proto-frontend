# 오늘의 미션 카메라 — proto-frontend

오늘의 키워드에 맞는 사진을 찍고, 그룹 친구들의 같은 주제 사진을 나란히 보는 앱의 **UT용 프론트엔드**.
서버는 별도 구현 후 합칠 예정.

## 구조 (pnpm workspace)

```
apps/
  mobile/   Expo (SDK 58, expo-router) + Uniwind(Tailwind v4)
  web/      React + Vite + Tailwind v4
packages/
  shared/   앱·웹 공용 코드 (@proto/shared)
```

## 시작하기

```bash
corepack enable pnpm   # 최초 1회
pnpm install
```

```bash
pnpm mobile            # Expo 개발 서버 → Expo Go 로 QR 스캔
pnpm web               # http://localhost:5173
pnpm typecheck         # 전체 타입체크
```

## 스타일링 (Tailwind CSS v4)

두 앱 모두 Tailwind **v4** 를 쓰고, 설정은 CSS 파일에서 한다 (`tailwind.config.js` 없음).

|        | 엔트리 CSS                   | 연결                                                                        |
| ------ | ---------------------------- | --------------------------------------------------------------------------- |
| mobile | `apps/mobile/src/global.css` | `metro.config.js` 의 `withUniwindConfig`, `src/app/_layout.tsx` 에서 import |
| web    | `apps/web/src/index.css`     | `vite.config.ts` 의 `@tailwindcss/vite`, `src/main.tsx` 에서 import         |

```tsx
// mobile — React Native 컴포넌트에 className 사용
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-2xl font-bold">Hello</Text>
</View>
```

- 모바일은 [Uniwind](https://docs.uniwind.dev/) 로 RN 컴포넌트에 `className` 을 붙인다. 지원 클래스: https://docs.uniwind.dev/class-names
- 디자인 토큰(색상 등)은 각 엔트리 CSS 의 `@theme { ... }` 블록에 추가한다.
- `apps/mobile/src/uniwind-types.d.ts` 는 Metro 실행 시 자동 생성된다. 직접 수정하지 말 것.
- `packages/shared` 에서 className 을 쓰면 두 엔트리 CSS 의 `@source` 로 스캔된다.

## 앱 정보

- 앱 이름: 오늘의 미션 카메라 / 딥링크 스킴: `missioncam://`
- 번들 ID: `kr.proto.missioncam` (iOS · Android)
- 네이티브 라이브러리 추가 시 `pnpm --filter mobile exec expo install <패키지>` 로 SDK 호환 버전을 설치한다.
