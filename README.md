# Apps in Toss Harness

이 저장소는 Apps in Toss용 개발, 빌드, 테스트 업로드, 배포 준비 흐름을 정리한 공개용 하니스입니다.
핵심 목적은 웹이든 게임이든 비게임이든, 결과물이 Apps in Toss에 실제로 배포 가능한 형태가 되도록 수렴시키는 것입니다.
현재 기본 starter 구현은 `React Native + Granite + Apps in Toss SDK 2.x` 기준입니다.

1. clone
2. 앱 이름과 환경값 초기화
3. 로컬 개발
4. 테스트
5. `.ait` 빌드
6. Apps in Toss 테스트 업로드
7. 콘솔에서 검토 요청 / 출시

이 저장소는 `검토 요청`과 `출시하기`를 자동화하지 않습니다.
공식 문서 기준으로 그 단계는 콘솔에서 처리합니다.

## 이 저장소를 언제 쓰나

이 저장소는 이런 경우를 위한 템플릿입니다.

- Apps in Toss용 RN 미니앱을 새로 시작할 때
- 팀이 같은 개발/검증/배포 흐름을 재사용하고 싶을 때
- 공개 GitHub 저장소로 배포 가능한 starter를 만들고 싶을 때
- 기획만 얹으면 바로 개발을 시작할 수 있는 harness가 필요할 때

## 포함된 것

- `React Native + Granite` 기본 런타임
- `@apps-in-toss/framework` 연동
- `@toss/tds-react-native` 기본 연결
- `bootstrap` 초기화 스크립트
- `doctor` 점검 스크립트
- `public:check` 공개 저장소 점검 스크립트
- `verify` CI 검증 세트
- `.ait` 빌드 및 테스트 업로드 명령
- 공식 Apps in Toss 문서 drift 감지
- 하니스 smoke test + RN starter screen smoke test

## 사전 준비

필수:

- Node.js 22 권장
- npm
- Apps in Toss 콘솔에서 생성한 앱
- Apps in Toss 샌드박스 앱

조건부:

- 백엔드가 있으면 실제 `AITO_API_BASE_URL`
- CLI 테스트 업로드를 쓸 거면 Apps in Toss API 키
- 로그인/결제/프로모션/푸시를 쓸 거면 파트너 서버와 mTLS 인증서/키

## 사용자가 직접 세팅해야 하는 것

이 하니스는 프론트 스택 자체는 이미 고정되어 있습니다.
즉, 사용자가 별도로 고르는 프론트 스택은 없습니다.

- `React Native`
- `Granite`
- `@apps-in-toss/framework` SDK 2.x
- `@toss/tds-react-native`

사용자가 직접 준비해야 하는 것은 아래 네 묶음입니다.

### 1. 로컬 개발 환경

- Node.js 22 권장
- npm
- iOS 또는 Android 테스트 환경
- Apps in Toss 샌드박스 앱

추가 메모:

- iOS 실기기는 개발 머신과 같은 Wi-Fi 필요
- iOS 실기기는 샌드박스 앱의 로컬 네트워크 권한 허용 필요
- Android는 `adb reverse tcp:8081 tcp:8081`, `adb reverse tcp:5173 tcp:5173` 필요

### 2. Apps in Toss 콘솔 쪽 준비

- Apps in Toss 콘솔에 앱 생성
- 콘솔에 등록된 정확한 `appName` 확인
- 앱 아이콘 URL이 있으면 확보
- CLI 테스트 업로드를 쓸 경우 API 키 발급

중요:

- `appName`은 콘솔 값과 프로젝트 값이 정확히 같아야 합니다.

### 3. 이 저장소에 넣을 환경값

넣는 위치:

- 로컬 개발: 저장소 루트의 `.env`
- 로컬 초기화: `npm run bootstrap ...`
- GitHub Actions 일반값: repository `Variables`
- GitHub Actions 비밀값: repository `Secrets` 또는 `test-upload` environment secret

필수:

- `AITO_APP_NAME`
- `AITO_DISPLAY_NAME`
- `AITO_PRIMARY_COLOR`
- `AITO_API_BASE_URL`

선택:

- `AITO_ICON_URL`
- `AITO_WORKSPACE_NAME`

비밀값:

- `AITO_DEPLOY_API_KEY`

조건부:

- `AITO_MTLS_CERT_PATH`
- `AITO_MTLS_KEY_PATH`

### 4. 백엔드/인프라 준비

백엔드가 필요한 기능을 쓸 때만 필요합니다.

- 실제 `HTTPS` 백엔드 URL
- CORS allowlist
- 로그인/결제/프로모션/푸시용 서버 및 mTLS 인증서/키
- 큰 리소스를 둘 CDN 또는 외부 스토리지

백엔드가 있으면 최소한 아래 origin은 허용해야 합니다.

- `https://<appName>.apps.tossmini.com`
- `https://<appName>.private-apps.tossmini.com`

### 5. GitHub에서 직접 넣을 값

`Test Upload` workflow를 쓸 때 필요합니다.

Variables:

- `AITO_APP_NAME`
- `AITO_DISPLAY_NAME`
- `AITO_PRIMARY_COLOR`
- `AITO_API_BASE_URL`
- `AITO_ICON_URL` optional
- `AITO_WORKSPACE_NAME` optional

Secret:

- `AITO_DEPLOY_API_KEY`

## 5분 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 앱 이름과 환경값 초기화

```bash
npm run bootstrap -- \
  --app-name my-miniapp \
  --display-name "내 앱" \
  --primary-color "#3182F6" \
  --api-base-url "https://api.example.com"
```

이 명령은 아래를 수행합니다.

- `.env` 생성
- 템플릿 기본 이름이 아직 남아 있으면 `package.json` 이름 동기화
- `package-lock.json` 이름 동기화

생성 위치:

- `./.env`

옵션:

- `--icon-url "https://cdn.example.com/icon.png"`
- `--workspace-name "my-workspace"`
- `--stage test`
- `--force`

`.env`가 이미 있으면 덮어쓰지 않습니다.
다시 초기화하려면 `--force`를 붙입니다.

예시:

```bash
npm run bootstrap -- \
  --app-name my-order-app \
  --display-name "주문앱" \
  --primary-color "#0F6FFF" \
  --api-base-url "https://api.mycompany.com" \
  --icon-url "https://cdn.mycompany.com/apps/order/icon.png" \
  --workspace-name "my-company" \
  --force
```

### 3. 설정 점검

```bash
npm run doctor
```

`doctor`는 현재 값으로 로컬 개발이 가능한지 확인합니다.
초기 단계에서는 일부 항목이 warning이어도 괜찮습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 테스트

```bash
npm test
```

## 값 설명

| 값 | 용도 | 비고 |
| --- | --- | --- |
| `AITO_APP_NAME` | Apps in Toss 콘솔 앱 이름 | 반드시 콘솔 값과 정확히 같아야 함 |
| `AITO_DISPLAY_NAME` | 내비게이션 바 한글 이름 | 사용자 노출명 |
| `AITO_PRIMARY_COLOR` | 브랜드 대표 색상 | `#RRGGBB` |
| `AITO_ICON_URL` | 앱 아이콘 URL | 초기 테스트에서는 비워둘 수 있음 |
| `AITO_API_BASE_URL` | 파트너 백엔드 base URL | release/upload에서는 `https` 필요 |
| `AITO_WORKSPACE_NAME` | `ait token add` 등에 쓰는 workspace 이름 | 선택 |
| `AITO_DEPLOY_API_KEY` | `ait deploy` 업로드용 API 키 | 비밀값, 커밋 금지 |
| `AITO_MTLS_CERT_PATH` | mTLS 인증서 경로 | 서버 기능 쓸 때만 |
| `AITO_MTLS_KEY_PATH` | mTLS 키 경로 | 서버 기능 쓸 때만 |

## 자주 쓰는 흐름

### 새 앱 시작

```bash
npm install
npm run bootstrap -- \
  --app-name my-miniapp \
  --display-name "내 앱" \
  --primary-color "#3182F6" \
  --api-base-url "https://api.example.com"
npm run doctor
npm run dev
```

사용처:

- 저장소를 처음 clone했을 때
- 새 Apps in Toss 앱으로 하니스를 재사용할 때

### 기능 개발 전 기본 검증

```bash
npm run verify
```

이 명령은 아래를 순서대로 실행합니다.

- `doctor:repo`
- `lint`
- `typecheck`
- `test`

사용처:

- PR 올리기 전
- CI와 같은 기준으로 로컬 검증하고 싶을 때

### 빌드 전 점검

```bash
npm run doctor:release
```

이 모드는 로컬 warning으로 남겨두던 항목도 더 엄격하게 봅니다.

예:

- 기본 `appName` 그대로 두었는지
- placeholder API URL을 아직 안 바꿨는지
- 업로드/릴리즈에 `https`가 아닌 API URL을 쓰는지

사용처:

- `.ait`를 만들기 전
- 실제 콘솔 테스트 업로드 전

### `.ait` 번들 생성

```bash
npm run build
```

이 명령은 내부적으로 `doctor:release`를 먼저 실행한 뒤 `ait build`를 수행합니다.

사용처:

- QR 테스트용 번들 생성
- CI 업로드 전 번들 생성

### Apps in Toss 테스트 업로드

```bash
npm run upload:test
```

이 명령은 내부적으로 `doctor:upload`를 거친 뒤 `ait deploy`를 실행합니다.

업로드 인증 방식:

- 로컬: 이미 등록된 `ait token`이 있으면 API 키 없이 가능
- CI: `AITO_DEPLOY_API_KEY` 필요

API 키를 로컬에 등록해두려면:

```bash
npm run deploy:token:add
```

사용처:

- 콘솔 대신 CLI로 테스트 업로드하고 싶을 때
- GitHub Actions `Test Upload` workflow를 돌릴 때

### 공식 CORS origin 확인

```bash
npm run cors:print
```

출력 기준:

- Live: `https://<appName>.apps.tossmini.com`
- QR test: `https://<appName>.private-apps.tossmini.com`

사용처:

- 백엔드 CORS allowlist 설정
- 앱 이름 변경 후 origin 재확인

### 공식 문서 drift 확인

```bash
npm run docs:check
```

강제 실패 모드:

```bash
npm run docs:check:strict
```

로컬 snapshot 갱신:

```bash
npm run docs:sync
```

사용처:

- Apps in Toss 문서 변경 감지
- SDK/정책/배포 절차 변경 추적

주의:

- raw snapshot은 로컬/CI용입니다.
- 공개 저장소에는 커밋하지 않습니다.

### 공개 저장소 점검

```bash
npm run public:check
```

이 명령은 아래를 차단합니다.

- `.env`
- `.ait`
- `dist`, `.granite`, `.swc`, `artifacts`
- 공식 문서 raw 미러
- 로컬 절대 경로
- 채워진 API 키 / mTLS 경로
- 키 material 흔적

사용처:

- public GitHub push 직전
- release 브랜치 정리 전

생성 산출물까지 같이 청소하려면:

```bash
npm run clean:generated
npm run public:check
```

## 디바이스 / 샌드박스 테스트 메모

### iOS 실기기

- 샌드박스 앱 설치 필요
- 개발 머신과 같은 Wi-Fi 필요
- 샌드박스 앱의 local network 권한 허용 필요

### Android

포트 reverse:

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5173 tcp:5173
```

## GitHub Actions

이 저장소에는 세 가지 workflow가 있습니다.

### `CI`

실행:

- PR
- `main` push

동작:

- `npm run verify`

사용처:

- 코드 무결성 검증
- 하니스 회귀 방지

### `Security`

실행:

- PR
- `main` push

동작:

- `npm run public:check`
- `gitleaks`

사용처:

- 공개 저장소 안전성 검증
- 비밀값/생성물 유입 차단

### `Test Upload`

실행:

- 수동 `workflow_dispatch`

동작:

- `doctor:release`
- `build`
- `.ait` artifact 업로드
- Apps in Toss 테스트 업로드

필요한 GitHub variables:

- `AITO_APP_NAME`
- `AITO_DISPLAY_NAME`
- `AITO_PRIMARY_COLOR`
- `AITO_API_BASE_URL`

선택 variables:

- `AITO_ICON_URL`
- `AITO_WORKSPACE_NAME`

필요한 secret:

- `AITO_DEPLOY_API_KEY`

권장:

- `test-upload` environment에 secret 저장

실제로 workflow가 읽는 위치:

- `vars.AITO_APP_NAME`
- `vars.AITO_DISPLAY_NAME`
- `vars.AITO_PRIMARY_COLOR`
- `vars.AITO_API_BASE_URL`
- `vars.AITO_ICON_URL`
- `vars.AITO_WORKSPACE_NAME`
- `secrets.AITO_DEPLOY_API_KEY`

### `Docs Freshness`

실행:

- 매일 schedule
- 수동 실행

동작:

- `npm run docs:check:strict`
- 문서 drift 리포트 artifact 업로드

## Apps in Toss 공식 흐름과의 관계

이 하니스는 아래 흐름에 맞춥니다.

1. 로컬/샌드박스에서 개발
2. `.ait` 빌드
3. 콘솔 또는 CLI로 테스트 업로드
4. QR 또는 `intoss-private://`로 테스트
5. 콘솔에서 검토 요청
6. 승인 후 콘솔에서 출시

즉, 이 저장소는 `개발`, `검증`, `빌드`, `테스트 업로드`까지를 강하게 자동화하고,
`검토 요청`과 `출시하기`는 공식 흐름에 맞춰 수동 단계로 남깁니다.

## 공식 제약 메모

- Live Apps in Toss 트래픽은 `HTTPS`만 허용
- 비게임 RN 미니앱은 `TDS` 사용 필수
- RN 앱은 `.ait`로 빌드해 업로드
- 큰 리소스는 번들에 다 넣지 말고 외부 저장소/CDN 사용 권장
- 정책은 수시로 바뀔 수 있으므로 문서 drift 감시 유지 권장

## 관련 문서

- [STACK.md](./STACK.md)
- [AGENTS.md](./AGENTS.md)
- [Apps in Toss RN Setup](./docs/setup/apps-in-toss-rn.md)
- [Harness CI/CD Ops](./docs/ops/apps-in-toss-harness-ci-cd.md)
- [Integration Docs](./docs/toss/integration/README.md)
