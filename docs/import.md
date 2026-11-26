# import 경로

`apps/web`은 `@/` 별칭으로 `src`를 가리킨다. 설정은 `apps/web/tsconfig.json`의 `paths`와 `apps/web/vite.config.ts`의 `resolve.tsconfigPaths` 두 곳이다. Vite가 tsconfig의 `paths`를 읽으므로 별칭을 바꿀 때는 tsconfig만 고친다.

## 규칙

- 같은 폴더와 그 아래의 파일은 `./`로 쓴다.
- 위 폴더로 올라가야 하면 `../` 대신 `@/`를 쓴다.

```ts
import { MissionTitle } from './MissionTitle'; // 같은 폴더
import { AddIcon } from './icons/AddIcon'; // 그 아래 폴더
import { Button } from '@/shared/ui/Button'; // 폴더 밖
import { Button } from '../../shared/ui/Button'; // 쓰지 않는다
```

`src` 밖을 가리키는 경로는 별칭 대상이 아니다. `index.css`의 `@source '../../../packages/shared/src'`가 그 예다.

## 순서

그룹 사이에 빈 줄을 하나 둔다. 외부 라이브러리, `@/`, `./` 순이다.

```ts
import { useNavigate } from 'react-router';

import { Button } from '@/shared/ui/Button';

import { GroupSummary } from './GroupSummary';
```

## apps/mobile

Expo 템플릿에 처음부터 같은 `@/*` 별칭이 있다. 다만 `assets`가 `src` 밖에 있어 `@/assets/*`는 `apps/mobile/assets`를 가리킨다.
