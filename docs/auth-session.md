# 로그인 세션과 화면 접근 제어

웹(`apps/web`)에서 로그인 상태를 어떻게 유지하고, 상태에 따라 어떤 화면에 들어올 수 있게 하는지 정리한다. 문제마다 **문제 → 개념 → 해결 → 예시** 순서로 적는다.

관련 코드는 모두 `apps/web/src/shared/auth/`에 있다.

| 파일                   | 역할                                        |
| ---------------------- | ------------------------------------------- |
| `AuthProvider.tsx`     | Supabase 세션을 구독해 앱 전체에 나눠 준다  |
| `auth-context.ts`      | `useAuth`, 사용자 상태 계산, 상태별 첫 화면 |
| `AuthGate.tsx`         | 화면 묶음에 들어올 수 있는 상태를 검사한다  |
| `use-welcome-toast.ts` | 로그인 직후 한 번만 환영 토스트 문구를 준다 |

## 전체 흐름

```
랜딩(/) → 로그인(/login) → [구글·카카오] → /auth/callback
                                              │
                         처음 로그인 ─────────┼───────── 약관 동의를 마친 사용자
                              ▼                              ▼
                     약관 동의(/agreement)  ──동의 저장──▶  홈(/home)
```

사용자는 항상 아래 세 상태 중 하나다.

| 상태        | 뜻                        | 첫 화면      |
| ----------- | ------------------------- | ------------ |
| `guest`     | 로그아웃                  | `/login`     |
| `agreement` | 로그인했지만 약관 동의 전 | `/agreement` |
| `member`    | 약관 동의까지 마침        | `/home`      |

---

## 1. 새로고침하면 로그인이 풀린 것처럼 보인다

### 문제

로그인한 뒤 새로고침하면 앱은 내가 로그인했는지 모른다. React 상태는 새로고침하면 사라지기 때문이다.

### 개념: 세션과 세션 저장

- **세션**: 로그인에 성공하면 받는 증표다. API를 부를 때 쓰는 **access token**(짧게 유효)과, 만료된 access token을 새로 받는 **refresh token**(길게 유효)으로 이루어진다.
- supabase-js는 세션을 브라우저 **localStorage**(`sb-<프로젝트ref>-auth-token`)에 저장하고, 페이지가 열리면 다시 읽어 온다. access token이 만료되면 refresh token으로 알아서 갱신한다.
- 즉 세션 자체는 새로고침해도 남아 있다. 앱이 그 세션을 **읽어서 화면에 반영**하기만 하면 된다.
- `onAuthStateChange`로 구독하면 저장된 세션이 `INITIAL_SESSION` 이벤트로 먼저 오고, 이후 로그인(`SIGNED_IN`), 로그아웃(`SIGNED_OUT`), 토큰 갱신(`TOKEN_REFRESHED`), 사용자 정보 변경(`USER_UPDATED`) 때마다 새 세션이 온다.

### 해결

`AuthProvider`가 앱 맨 바깥에서 `onAuthStateChange`를 한 번 구독하고, 받은 세션을 Context로 나눠 준다. 화면은 `useAuth()`로 꺼내 쓴다.

### 예시

```tsx
// main.tsx
<BrowserRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>;

// 아무 화면에서
const { session } = useAuth();
session?.user.email; // 로그인했으면 이메일, 아니면 undefined
```

세션을 쓰려고 화면마다 `supabase.auth.getSession()`을 부를 필요가 없다. 로그인·로그아웃이 일어나면 `useAuth()`를 쓰는 화면이 다시 그려진다.

---

## 2. 세션을 읽는 동안 로그인 화면이 깜빡인다

### 문제

`AuthProvider`가 처음 그려지는 순간에는 아직 저장된 세션을 읽지 못해 `session`이 `null`이다. 이때 "세션이 없으니 로그인 화면으로" 판단하면, 로그인한 사용자도 새로고침할 때마다 로그인 화면으로 튕긴다.

### 개념: "모름"과 "없음"은 다르다

`session === null`은 두 가지 뜻일 수 있다.

- 아직 읽는 중이라 **모른다**
- 다 읽었는데 **없다** (로그아웃)

둘을 구분하려면 상태가 하나 더 필요하다.

### 해결

`loading`을 함께 둔다. 처음에는 `true`이고, 첫 이벤트(`INITIAL_SESSION`)를 받으면 `false`가 된다. `loading`인 동안에는 판단하지 않고 아무것도 그리지 않는다.

### 예시

```tsx
const { session, loading } = useAuth();
if (loading) return null; // 아직 모른다
if (!session) ...         // 이제 확실히 로그아웃
```

---

## 3. 상태에 맞지 않는 화면에 들어온다

### 문제

- 로그아웃한 사용자가 주소창에 `/home`을 치면 홈이 보인다.
- 로그인한 사용자가 `/login`에 다시 들어간다.
- 약관 동의 전 사용자가 `/home`으로 바로 간다.

### 개념: 라우트 가드

- **라우트 가드**: 화면을 그리기 전에 "이 사용자가 들어와도 되나"를 검사해 안 되면 다른 화면으로 보내는 장치다.
- react-router에서는 **레이아웃 라우트**로 만든다. `path` 없이 `element`만 있는 `<Route>`가 자식 라우트들을 감싸고, 검사를 통과하면 `<Outlet />`으로 자식 화면을 그린다.
- 통과하지 못하면 `<Navigate replace />`로 보낸다. `replace`는 history에 막힌 화면을 남기지 않아서 뒤로 가기로 다시 막힌 화면에 돌아가지 않게 한다.

### 해결

화면마다 "로그인 필요" 같은 조건을 따로 두지 않고, **화면 묶음마다 들어올 수 있는 상태 하나**를 정한다. `AuthGate`는 지금 사용자 상태가 `allow`와 같으면 화면을 그리고, 다르면 **지금 상태의 첫 화면**으로 보낸다.

```tsx
export function AuthGate({ allow }: { allow: AuthStatus }) {
  const { session, loading } = useAuth();
  if (loading) return null;

  const status = getAuthStatus(session);
  return status === allow ? <Outlet /> : <Navigate to={START_PAGE[status]} replace />;
}
```

`App.tsx`에서 화면을 상태별로 묶는다.

```tsx
<Route element={<AuthGate allow="guest" />}>     {/* /login */}
<Route element={<AuthGate allow="agreement" />}> {/* /agreement, /agreement/terms, /agreement/privacy */}
<Route element={<AuthGate allow="member" />}>    {/* /home, /groups, /camera, /group/*, /join, /nickname */}
{/* 누구나: /, /auth/callback, /privacy, /terms */}
```

랜딩(`/`)은 구글 OAuth 앱 홈페이지라 로그인 상태와 상관없이 보인다. 대신 "시작하기"가 지금 상태의 첫 화면으로 보낸다.

```tsx
<Button onClick={() => navigate(START_PAGE[getAuthStatus(session)])}>시작하기</Button>
```

### 예시

| 사용자 상태 | 들어간 주소      | 결과                |
| ----------- | ---------------- | ------------------- |
| `guest`     | `/home`          | `/login`으로 이동   |
| `guest`     | `/agreement`     | `/login`으로 이동   |
| `agreement` | `/home`          | `/agreement`로 이동 |
| `agreement` | `/login`         | `/agreement`로 이동 |
| `member`    | `/login`         | `/home`으로 이동    |
| `member`    | `/agreement`     | `/home`으로 이동    |
| 누구나      | `/`, `/privacy`  | 그대로 보임         |
| `member`    | `/`에서 시작하기 | `/home`으로 이동    |
| `guest`     | `/`에서 시작하기 | `/login`으로 이동   |

**새 화면을 추가할 때**는 `App.tsx`에서 누가 들어와야 하는지에 맞는 `AuthGate` 묶음 안에 넣기만 하면 된다. 대부분은 `member` 묶음이다.

---

## 4. 약관 동의를 첫 로그인에만 보여 주기

### 문제

동의 여부를 어디에도 저장하지 않으면, 로그인할 때마다 약관 동의 화면을 다시 거친다.

### 개념: 사용자 metadata

- Supabase auth 사용자에는 **`user_metadata`**라는 JSON 칸이 있다. `supabase.auth.updateUser({ data })`로 로그인한 본인이 직접 쓸 수 있고, 세션의 `session.user.user_metadata`로 바로 읽힌다.
- 테이블에 컬럼을 추가하는 방법과 비교하면 다음과 같다.

|             | user_metadata                | 테이블 컬럼(profiles 등)    |
| ----------- | ---------------------------- | --------------------------- |
| 스키마 변경 | 없음                         | 마이그레이션, RLS 정책 필요 |
| 읽기        | 세션에 들어 있어 조회 불필요 | 따로 조회                   |
| 모아 보기   | 불편                         | SQL로 쉽다                  |
| 사용자 수정 | 본인이 바꿀 수 있다          | RLS로 막을 수 있다          |

UT 범위에서는 스키마를 건드리지 않는 `user_metadata`를 쓴다.

> ⚠️ `user_metadata`는 사용자가 직접 바꿀 수 있다. 화면 흐름을 정하는 데만 쓰고, **데이터 접근 권한(RLS) 판단에는 쓰지 않는다.**

### 해결

- 약관 동의 화면의 "다음"이 `updateUser`로 동의 시각과 마케팅 동의 여부를 저장한다.

  ```ts
  supabase.auth.updateUser({
    data: { agreed_at: new Date().toISOString(), marketing_agreed: true },
  });
  ```

- 사용자 상태는 `agreed_at`이 있는지로 정한다.

  ```ts
  if (!session) return 'guest';
  return session.user.user_metadata.agreed_at ? 'member' : 'agreement';
  ```

- 저장하면 `USER_UPDATED` 이벤트로 새 세션이 와서 상태가 `agreement` → `member`로 바뀐다. 그러면 `/agreement`를 감싼 `AuthGate allow="agreement"`가 통과하지 못하고 `/home`으로 보낸다. **"다음" 버튼은 저장만 하고 직접 이동하지 않는다.**

### 예시

```
첫 로그인:   /auth/callback → (agreed_at 없음) → /agreement → [다음] → 저장 → /home
두 번째부터: /auth/callback → (agreed_at 있음) → /home
```

---

## 5. 로그인 직후에만 환영 토스트 띄우기

### 문제

로그인하면 "닉네임님 환영합니다" 토스트를 한 번 띄운다. 그런데 도착하는 화면이 사람마다 다르고(약관 동의 또는 홈), 새로고침하거나 다른 화면을 다녀와도 다시 뜨면 안 된다.

### 개념: history state

- `navigate(to, { state })`로 이동하면 주소에는 보이지 않는 값을 함께 넘길 수 있다. 도착한 화면은 `useLocation().state`로 읽는다.
- 이 값은 브라우저 history 항목에 저장되어 **새로고침이나 뒤로 가기로 돌아와도 남는다.** 한 번만 쓰려면 읽은 뒤 지워야 한다.

### 해결

1. `/auth/callback`이 `profiles.nickname`을 조회해 상태별 첫 화면으로 보내면서 `state: { welcome: 닉네임 }`을 넘긴다.
2. `useWelcomeToast()`가 그 값을 자기 상태로 옮기고, 곧바로 `navigate('.', { replace: true, state: null })`로 history state를 비운다. 2초 뒤에는 `null`을 돌려준다.
3. 약관 동의 화면과 홈이 이 훅을 쓴다.

### 예시

```tsx
const welcome = useWelcomeToast(); // "박지우님 환영합니다" → 2초 뒤 null

{
  welcome && <Toast message={welcome} />;
}
```

닉네임을 못 가져오면 "환영합니다"만 보인다.

---

## 직접 확인하는 법

- **로그아웃 상태 만들기**: 아직 로그아웃 버튼이 없다. 개발자 도구 → Application → Local Storage에서 `sb-ezhlepdrdverctyeuvnd-auth-token`을 지우고 새로고침한다.
- **첫 로그인 다시 보기**: Supabase 대시보드 → Authentication → Users에서 사용자를 지우거나, 그 사용자의 `raw_user_meta_data`에서 `agreed_at`을 지운다.
- **확인할 시나리오**
  1. 로그아웃 상태로 `/home` → `/login`으로 간다.
  2. 첫 로그인 → 약관 동의 화면 + 환영 토스트 → 동의하면 홈으로 간다.
  3. 홈에서 새로고침 → 로그인이 유지되고 토스트는 다시 안 뜬다.
  4. 로그인 상태로 `/login` → 홈으로 간다.
  5. 로그인 상태로 `/` → 랜딩이 보이고, 시작하기를 누르면 홈으로 간다.
  6. 로그아웃 후 다시 로그인 → 약관 없이 홈 + 환영 토스트가 뜬다.
