# iOS 배포 가이드

EAS로 iOS 앱을 빌드해서 TestFlight에 올리고 App Store에 배포한다. 명령어는 `apps/mobile`에서 실행한다. `eas`가 없으면 `npx eas-cli@latest`로 바꿔 쓴다.

## 처음 한 번

1. [Apple Developer Program](https://developer.apple.com/programs/)에 가입한다. 유료이고, 승인까지 하루 이틀 걸릴 수 있다.
2. [App Store Connect](https://appstoreconnect.apple.com) → **앱** → **+** → **신규 앱**으로 앱을 만든다. 번들 ID는 `kr.proto.missioncam`(`app.json`의 `ios.bundleIdentifier`)을 고른다. 목록에 없으면 첫 `eas build`가 Apple 계정에 등록해 준 뒤 다시 고른다.
3. 아래 값을 찾아 `apps/mobile/eas.json`의 `submit.production.ios`에 채운다.

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "dev@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "AB12CD34EF"
    }
  }
}
```

| 키            | 값                                                | 찾는 곳                                                                                               |
| ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `appleId`     | 개발자 계정에 로그인하는 Apple ID 이메일          | 가입한 계정                                                                                           |
| `ascAppId`    | 앱의 Apple ID (숫자 10자리 안팎, 문자열로 적는다) | App Store Connect → 앱 → **앱 정보** → 일반 정보의 **Apple ID**                                       |
| `appleTeamId` | 팀 ID (영문·숫자 10자리)                          | [developer.apple.com/account](https://developer.apple.com/account) → **멤버십 세부 사항** → **팀 ID** |

> 세 값을 모르는 동안은 `submit.production`을 `{}`로 둔다. 빈 문자열(`""`)을 넣으면 eas.json 검사에 걸려서 Android 빌드까지 막힌다. `{}`여도 `eas submit`이 실행 중에 물어본다.

4. 빌드 번호 시작값을 정한다. `cli.appVersionSource`가 `remote`라 빌드 번호는 EAS 서버가 관리하고 `production` 빌드마다 자동으로 1씩 올린다.

```bash
eas build:version:set -p ios
```

## TestFlight에 올리기

빌드한다. 처음에는 Apple 로그인 후 배포 인증서와 프로비저닝 프로필을 EAS가 만들어 준다.

```bash
eas build -p ios --profile production
```

방금 만든 빌드를 App Store Connect에 올린다.

```bash
eas submit -p ios --profile production --latest
```

빌드와 업로드를 한 번에 하려면:

```bash
eas build -p ios --profile production --auto-submit
```

업로드 후 Apple 처리에 10~30분쯤 걸린다. 끝나면 App Store Connect → 앱 → **TestFlight**에서 테스터를 추가한다.

- 내부 테스터: App Store Connect에 등록된 팀원. 심사 없이 바로 설치된다
- 외부 테스터: 이메일이나 공개 링크로 초대. 첫 빌드는 베타 심사를 거친다

테스터는 iPhone에 TestFlight 앱을 설치하고 초대를 수락하면 된다.

## App Store에 배포하기

1. App Store Connect → 앱 → **배포** 탭에서 새 버전을 만들고 스크린샷, 설명, 개인정보처리방침 URL을 채운다.
2. **빌드** 항목에서 TestFlight에 올린 빌드를 고른다.
3. **심사에 추가** → **심사를 위해 제출**. 승인되면 수동 또는 자동으로 출시된다.

`eas submit`은 빌드를 올리기만 하고 심사 제출은 하지 않는다. 심사는 App Store Connect에서 직접 낸다.

## 새 버전 낼 때

- 빌드 번호(`buildNumber`)는 자동으로 올라가니 건드리지 않는다
- 사용자에게 보이는 버전(`1.0.0`)을 바꾸려면 `apps/mobile/app.json`의 `version`을 올린다
- 그다음 위의 "TestFlight에 올리기"부터 다시 한다

## 상황별

| 상황                                 | 명령어                                                          |
| ------------------------------------ | --------------------------------------------------------------- |
| 실기기 테스트용 빌드에 기기 등록     | `eas device:create` 후 `eas build -p ios --profile development` |
| Mac 시뮬레이터용 빌드                | `eas build -p ios --profile development-simulator`              |
| 인증서·프로비저닝 프로필 확인/재발급 | `eas credentials -p ios`                                        |
| 현재 빌드 번호 확인                  | `eas build:version:get -p ios`                                  |
| 빌드 목록 보기                       | `eas build:list -p ios`                                         |

## 막힐 때

- **`eas.json is not valid ... is not allowed to be empty`:** `submit.production.ios`에 빈 문자열이 있다. 값을 채우거나 `{}`로 되돌린다.
- **새로 등록한 기기에 설치가 안 됨:** Apple이 기기 등록을 처리하는 데 최대 24~72시간이 걸릴 수 있다. 등록 후 빌드를 새로 해야 한다.
- **수출 규정(암호화) 질문이 뜸:** `app.json`의 `ios.config.usesNonExemptEncryption: false`로 이미 건너뛰게 해 뒀다. 암호화 기능을 추가하면 다시 확인한다.
