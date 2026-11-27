# Supabase

UT용이다. 별도 백엔드 API 없이 프론트에서 `supabase-js`로 테이블을 직접 읽고 쓴다.

## 환경변수

```bash
cp apps/web/.env.example apps/web/.env.local
```

값은 Supabase 대시보드 **Project Settings → API Keys**에서 채운다.

| 변수                            | 설명                            |
| ------------------------------- | ------------------------------- |
| `VITE_SUPABASE_URL`             | 프로젝트 URL                    |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 브라우저용 publishable(anon) 키 |

둘 다 브라우저에 노출돼도 되는 값이다. **service_role 키는 프론트에 넣지 않는다.**

## 클라이언트

- 웹: `apps/web/src/shared/api/supabase.ts`
- 인증 flow는 PKCE. Google OAuth 후 `/auth/callback`에서 세션을 확인한다
- 세션 유지와 로그인 상태별 화면 접근 제어는 `docs/auth-session.md`
- 화면·기능에 필요한 짧은 쿼리 함수만 `shared/api` 근처에 둔다. Repository 계층은 만들지 않는다

## 도메인 관계

```
auth.users
  └─ profiles (1:1, id = auth.users.id)

groups
  ├─ group_members (N, unique(group_id, user_id))
  └─ photos (N)
       ├─ comments (N)
       └─ reactions (N, unique(photo_id, user_id))

missions (날짜와 회차당 1개, unique(mission_date, round))
  └─ photos.mission_id
```

한 유저가 같은 그룹·같은 미션에 올리는 사진은 1장이다 (`photos`의 `unique(group_id, user_id, mission_id)`).

## 테이블

### `profiles` — 사용자 프로필

| 컬럼         | 타입          | 메모                     |
| ------------ | ------------- | ------------------------ |
| `id`         | uuid PK       | `auth.users(id)` CASCADE |
| `nickname`   | text not null |                          |
| `avatar_url` | text          |                          |
| `created_at` | timestamptz   | default now()            |

### `groups` — 그룹

| 컬럼          | 타입                 | 메모                |
| ------------- | -------------------- | ------------------- |
| `id`          | uuid PK              | `gen_random_uuid()` |
| `name`        | text not null        |                     |
| `invite_code` | text not null unique | 초대 코드           |
| `created_by`  | uuid not null        | `auth.users(id)`    |
| `created_at`  | timestamptz          |                     |

### `group_members` — 그룹 멤버

| 컬럼        | 타입          | 메모                                       |
| ----------- | ------------- | ------------------------------------------ |
| `id`        | uuid PK       |                                            |
| `group_id`  | uuid not null | → `groups` CASCADE                         |
| `user_id`   | uuid not null | → `auth.users` CASCADE                     |
| `role`      | text          | `'owner'` \| `'member'` (default `member`) |
| `joined_at` | timestamptz   |                                            |

`unique(group_id, user_id)`. 인덱스: `user_id`.

### `missions` — 오늘의 미션

| 컬럼           | 타입              | 메모                                                  |
| -------------- | ----------------- | ----------------------------------------------------- |
| `id`           | uuid PK           |                                                       |
| `keyword`      | text not null     | 오늘의 키워드                                         |
| `description`  | text              |                                                       |
| `mission_date` | date not null     | 한국 날짜                                             |
| `round`        | smallint not null | 회차 1 또는 2 (default 1). UT는 하루에 두 단어를 쓴다 |
| `created_at`   | timestamptz       |                                                       |

### `photos` — 미션 사진

| 컬럼         | 타입          | 메모                                                            |
| ------------ | ------------- | --------------------------------------------------------------- |
| `id`         | uuid PK       |                                                                 |
| `group_id`   | uuid not null | → `groups` CASCADE                                              |
| `user_id`    | uuid not null | → `auth.users`                                                  |
| `mission_id` | uuid not null | → `missions`                                                    |
| `image_path` | text not null | `mission-photos` 버킷의 `<group_id>/<user_id>/<mission_id>.jpg` |
| `caption`    | text          | 20자 이하                                                       |
| `created_at` | timestamptz   |                                                                 |

`unique(group_id, user_id, mission_id)`. 인덱스: `(group_id, mission_id)`.

### `comments` — 사진 댓글

| 컬럼         | 타입          | 메모                   |
| ------------ | ------------- | ---------------------- |
| `id`         | uuid PK       |                        |
| `photo_id`   | uuid not null | → `photos` CASCADE     |
| `user_id`    | uuid not null | → `auth.users` CASCADE |
| `content`    | text not null | trim 길이 1~500        |
| `created_at` | timestamptz   |                        |
| `updated_at` | timestamptz   |                        |

인덱스: `(photo_id, created_at)`.

### `reactions` — 사진 이모지 반응

| 컬럼         | 타입          | 메모                   |
| ------------ | ------------- | ---------------------- |
| `id`         | uuid PK       |                        |
| `photo_id`   | uuid not null | → `photos` CASCADE     |
| `user_id`    | uuid not null | → `auth.users` CASCADE |
| `emoji`      | text not null |                        |
| `created_at` | timestamptz   |                        |

한 유저·한 사진에 반응 1개 (`unique(photo_id, user_id)`). 인덱스: `photo_id`.

### `ut_settings` — UT 회차

| 컬럼           | 타입        | 메모                    |
| -------------- | ----------- | ----------------------- |
| `id`           | boolean PK  | 늘 `true`. 한 줄만 있다 |
| `active_round` | smallint    | 지금 회차 1 또는 2      |
| `updated_at`   | timestamptz |                         |

로그인한 사람은 누구나 읽는다. 바꾸기는 `switch_mission_round()`로만 하고, 바꾸면 실시간(`supabase_realtime`)으로 퍼진다. 홈의 알림 버튼이 이 함수를 부른다(UT 한정).

## 함수(RPC)

| 함수                            | 하는 일                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `create_group(group_name)`      | 그룹을 만들고 만든 사람을 방장으로 넣는다. `{ group_id, invite_code }`를 돌려준다 |
| `join_group(input_invite_code)` | 초대 코드로 그룹에 들어간다. 최대 10명. `{ group_id, joined }`를 돌려준다         |
| `switch_mission_round()`        | 모든 사람의 회차를 1과 2 사이에서 바꾸고 바뀐 회차를 돌려준다                     |

## 사진 저장소

비공개 버킷 `mission-photos`. 경로 첫 폴더가 그룹, 둘째 폴더가 올린 사람이다. 읽기는 그룹 멤버만, 쓰기는 둘째 폴더가 나일 때만이다. 화면은 서명된 URL로 읽는다.

## 권한

권한은 **RLS**로 막는다. 클라이언트에서 필터만 믿고 전체 테이블을 열지 않는다. 정책이 바뀌면 이 문서에 의도를 짧게 갱신한다.

## 하지 말 것

- service_role 키를 프론트·환경변수 예시에 넣기
- UT 범위에서 별도 API 서버·과한 데이터 계층 추가
- 스키마와 다른 테이블/컬럼 이름을 임의로 만들기 (다르면 먼저 묻기)
