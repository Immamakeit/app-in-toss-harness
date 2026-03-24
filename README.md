# Apps in Toss Harness

이 저장소는 Apps in Toss용 개발, 빌드, 테스트 업로드, 배포 준비 흐름을 정리한 공개용 하니스입니다.
핵심 목적은 웹이든 게임이든 비게임이든, 결과물이 Apps in Toss에 실제로 배포 가능한 형태가 되도록 수렴시키는 것입니다.
현재 저장소에 포함된 기본 reference implementation은 `React Native + Granite + Apps in Toss SDK 2.x` 기준입니다.

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
- 공개 GitHub 저장소로 배포 가능한 하니스 템플릿을 만들고 싶을 때
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
- 하니스 smoke test + RN baseline screen smoke test

## Repo-local Skills

이 하니스 저장소에는 Apps in Toss 전용 판단과 운영을 돕는 repo-local 스킬이 포함되어 있습니다.
원본은 모두 `skills/` 아래에 들어 있고, `AGENTS.md` 규칙에 따라 필요할 때 해당 `SKILL.md`를 직접 읽는 방식으로 사용합니다.

공통 규칙:

- 저장소 전용 스킬은 `skills/<skill-name>/SKILL.md`에 버전관리
- Apps in Toss 요청이 애매하거나 위험할수록 구현보다 스킬 판단을 먼저 수행
- 각 스킬은 사용되면 응답 마지막에 `스킬 사용 보고`를 남기도록 정의됨

### 1. `apps-in-toss-request-validator`

위치:

- `skills/apps-in-toss-request-validator/SKILL.md`

사용처:

- 이 요청이 Apps in Toss에서 가능한지 먼저 판별해야 할 때
- 정책, 검수, 런타임 제약과 충돌할 수 있는 요구가 들어왔을 때

트리거:

- 외부 링크 의존
- 외부 앱 설치 유도
- 금융/투자/가상자산/현금화/사행성 요소
- HTTP 라이브 사용
- 쿠키 기반 로그인
- Apps in Toss 서버 API를 클라이언트에서 직접 호출하려는 구조

대표 예시:

- “토스 미니앱에서 암호화폐 거래 기능 넣을 수 있어?”
- “핵심 결제는 외부 웹사이트로 보내고 앱은 소개만 하자”
- “클라이언트에서 바로 토스 로그인 토큰 교환하면 안 돼?”

출력 성격:

- `허용 / 조건부 / 불가·고위험`
- 이유
- 근거
- 안전한 대안

### 2. `apps-in-toss-review-risk-checker`

위치:

- `skills/apps-in-toss-review-risk-checker/SKILL.md`

사용처:

- 기술적으로는 구현 가능해 보여도, 검수 반려나 출시 지연 리스크가 걱정될 때
- 브랜드/앱 분리 전략, 외부 링크, 리워드 용어, 금융성 표현, 검수 가이드를 점검할 때

트리거:

- “이거 반려될 가능성 있어?”
- “앱을 두 개로 쪼개서 같은 브랜드로 운영해도 돼?”
- “리워드 이름을 포인트/출금처럼 써도 되나?”

대표 예시:

- “외부 사이트 링크로 약관 확인 후 다시 앱으로 돌아오게 하자”
- “같은 기능을 앱 두 개로 나눠서 노출하자”
- “유저 보상을 ‘출금 가능 포인트’로 표현하자”

출력 성격:

- `낮음 / 중간 / 높음 / 반려 가능성 높음`
- 리스크 원인
- 검수 전에 바꿔야 할 점

### 3. `apps-in-toss-feature-prereq-mapper`

위치:

- `skills/apps-in-toss-feature-prereq-mapper/SKILL.md`

사용처:

- 기능은 하고 싶은데, 어떤 선행조건이 필요한지 아직 모를 때
- 권한, 콘솔 설정, 앱 내 기능, 서버, mTLS, CORS, 샌드박스 QA 여부를 한 번에 정리할 때

트리거:

- “이 기능 넣으려면 뭐부터 준비해야 해?”
- “위치/카메라/결제/공유 기능 넣을 건데 필요한 것들 정리해줘”

대표 예시:

- “회원가입 없이 위치 기반 쿠폰 보여주고 싶어”
- “앱 내 기능으로 특정 주문 화면에 바로 진입시키고 싶어”
- “연락처 공유 보상 기능 넣으려면 뭐가 필요해?”

출력 성격:

- 기능별 prerequisite matrix
- 필요한 권한/서버/콘솔 설정/수동 검증 경로

### 4. `apps-in-toss-backend-scope-slicer`

위치:

- `skills/apps-in-toss-backend-scope-slicer/SKILL.md`

사용처:

- 로그인, 결제, 인앱결제, 프로모션, 스마트 메시지, 서버 API 연동이 들어갈 때
- 백엔드가 정말 필요한지, 필요하면 최소 범위가 어디까지인지 자를 때

트리거:

- “이 기획이면 백엔드 필요해?”
- “기존 서버 재사용으로 끝나나, 새 API를 만들어야 하나?”

대표 예시:

- “토스 로그인 붙이고 결제까지 넣고 싶어”
- “프로모션 보상 지급과 메시지 발송도 같이 해야 해”
- “미니앱은 가볍게 두고 서버는 최소화하고 싶어”

출력 성격:

- `백엔드 불필요 / 기존 백엔드 재사용 / 신규 백엔드 필요`
- 최소 엔드포인트
- 저장해야 할 데이터
- 클라이언트와 서버 경계

### 5. `apps-in-toss-manual-test-scribe`

위치:

- `skills/apps-in-toss-manual-test-scribe/SKILL.md`

사용처:

- 자동 테스트만으로는 신뢰할 수 없는 Apps in Toss 런타임 동작을 검증할 때
- 샌드박스, QR, `intoss-private://`, 권한 팝업, 실기기, 결제, 브리지 동작을 재현 가능한 QA 시나리오로 만들 때

트리거:

- “이건 수동 테스트 체크리스트도 남겨줘”
- “샌드박스 앱에서 어떻게 검증해야 해?”

대표 예시:

- “Android 실기기에서 `adb reverse` 포함한 테스트 절차 적어줘”
- “결제 성공 후 지급 실패 시나리오를 QA 문서로 만들어줘”
- “iOS 실기기에서 로컬 네트워크 권한 포함 테스트 절차가 필요해”

출력 성격:

- preconditions
- device/environment
- exact steps
- expected result
- failure clues

### 6. `apps-in-toss-release-readiness-checker`

위치:

- `skills/apps-in-toss-release-readiness-checker/SKILL.md`

사용처:

- `.ait` 빌드 직전
- 테스트 업로드 직전
- 검토 요청 직전
- 콘솔 출시 직전

트리거:

- “지금 테스트 업로드 가능한 상태야?”
- “검토 요청 걸어도 돼?”
- “이제 출시 눌러도 되는지 최종 점검해줘”

대표 예시:

- “CORS, HTTPS, QA, 번들 크기까지 포함해서 출시 준비도 확인해줘”
- “테스트는 했는데 검토 요청해도 되는지 보고 싶어”

출력 성격:

- `개발 중 / 테스트 업로드 가능 / 검토 요청 가능 / 출시 가능`
- 통과한 항목
- 막고 있는 항목
- 다음 액션

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

## 하니스를 사용하는 쪽에서 직접 세팅해야 하는 것

현재 이 하니스 저장소가 기본 제공하는 reference implementation은 아래 스택으로 동작합니다.
즉, 지금 제공되는 예시 구현은 아래 조합을 baseline으로 삼습니다.

- `React Native`
- `Granite`
- `@apps-in-toss/framework` SDK 2.x
- `@toss/tds-react-native`

이 하니스를 복제해 실제 앱 저장소를 만들 때 직접 준비해야 하는 것은 아래 다섯 묶음입니다.

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

이 하니스를 복제해 실제 앱 저장소를 만들 때, Apps in Toss 콘솔에서는 먼저 아래 둘 중 어느 상황인지 구분해서 준비하면 됩니다.

#### 2-A. 처음으로 콘솔과 워크스페이스를 여는 사람

이 경우는 보통 새 파트너, 새 팀, 새 서비스의 첫 개설자입니다.

1. 콘솔 가입

- Apps in Toss 콘솔 가입은 `토스 비즈니스 회원` 기반입니다.
- 공식 문서 기준으로 콘솔 가입과 워크스페이스 생성에는 `만 19세 이상`이고, `본인 명의로 로그인된 토스 앱`이 필요합니다.
- 만 19세 미만이면 콘솔 계정 참여는 가능하지만, 워크스페이스를 직접 만들 수는 없고 기존 워크스페이스 초대를 받아야 합니다.

2. 워크스페이스 생성

- 워크스페이스는 팀이 함께 앱을 관리하는 공간입니다.
- 공식 문서 기준으로 `사업자당 1개의 워크스페이스`만 사용할 수 있고, 이름은 중복될 수 없습니다.
- 워크스페이스를 만든 사람은 자동으로 `대표관리자` 권한을 받습니다.

3. 팀 멤버 초대와 권한 정리

- 콘솔의 `멤버` 메뉴에서 `+초대하기`로 팀원을 초대합니다.
- `관리자`와 `구성원` 권한을 구분해 초대할 수 있습니다.
- 대표관리자는 워크스페이스 운영 책임과 서비스 약관 동의 권한을 가집니다.
- 테스트용 앱은 사업자 인증 없이도 만들 수 있지만, 공식 문서 기준으로 `사업자 인증이 되지 않으면 수익화 기능과 토스 로그인은 사용할 수 없습니다.`

4. 앱 등록

- 공식 클릭 경로: `워크스페이스 생성 후 -> 앱 메뉴 -> +등록하기`
- 개발이 끝나지 않았어도 앱을 먼저 등록할 수 있습니다.
- 개발 앱과 라이브 앱을 분리하고 싶다면 같은 워크스페이스 안에 앱을 따로 등록하면 됩니다.

5. 앱 등록 시 바로 확정해야 하는 값

- `앱 이름`: 토스 앱에 노출되는 이름
- `appName`: 스킴과 앱 식별자 기준값
- 고객센터 이메일 / 연락처 / 채팅 상담 주소
- 로고 / 썸네일 / 부제 / 상세 설명

중요:

- `appName`은 한 번 등록 후 수정할 수 없습니다.
- 공식 문서 기준으로 `appName` 규칙을 지키지 않으면 서버 인증서 발급이 실패할 수 있습니다.
- 이 하니스에서 사용하는 `AITO_APP_NAME`은 콘솔에 등록한 `appName`과 정확히 같아야 합니다.

6. 비게임 앱이면 앱 내 기능도 같이 계획

- 공식 문서 기준으로 `비게임 앱은 앱 내 기능을 최소 1개 이상 등록`해야 합니다.
- 신규 출시 앱은 첫 출시 과정에서 `앱 출시` 메뉴에서 번들을 업로드한 뒤 앱 내 기능을 함께 등록할 수 있습니다.
- 앱 내 기능 검토에는 영업일 기준 `1~2일`이 걸릴 수 있습니다.

7. 기능 계획에 따라 추가로 선행될 수 있는 콘솔 작업

- `사업자 정보 등록`: 토스 로그인, 토스페이, 프로모션, 인앱 광고, 인앱 결제, 비즈월렛을 쓸 때 필요
- `정산 정보 등록`: 인앱 광고, 인앱 결제, 프로모션 같은 수익/예산 기능에 필요
- `API 키 발급`: CLI 테스트 업로드를 쓸 때 필요

#### 2-B. 이미 콘솔 계정이 있고, 워크스페이스/앱도 어느 정도 준비된 상태에서 합류한 사람

이 경우는 보통 기존 조직이나 기존 서비스에 개발자로 합류한 경우입니다.

1. 먼저 확인할 것

- 내가 `대상 워크스페이스의 멤버`로 초대되어 있는지
- 개발 대상 앱이 콘솔에 이미 등록되어 있는지
- 대상 앱의 정확한 `appName`이 무엇인지
- 테스트용 앱과 라이브 앱을 따로 쓰는지
- 대표관리자가 누구인지

2. 실제 개발 전에 바로 확인할 값

- 콘솔에 등록된 `정확한 appName`
- 현재 사용 중인 앱 로고 / display name / primary color
- CLI 테스트 업로드를 쓸지 여부
- 필요한 경우 발급받을 `API 키`
- 비게임 앱이면 이미 등록된 `앱 내 기능`이 있는지

3. 역할별로 해야 하는 일

개발자/구성원 중심:

- 정확한 `appName`을 받아서 하니스 bootstrap 값에 반영
- 콘솔 `앱 출시` 메뉴를 기준으로 테스트 업로드 흐름 이해
- QR 테스트 또는 CLI 업로드를 위해 필요한 접근 권한 확인

관리자/대표관리자 중심:

- 멤버 초대 / 권한 정리
- 필요 시 앱 추가 등록 또는 개발용 앱/라이브용 앱 분리
- 테스트 업로드용 API 키 발급
- 기능별 약관 동의, 사업자 정보, 정산 정보, 연동 키 등록
- 최종적으로 검토 요청과 출시 수행

4. 테스트와 출시 단계에서 추가로 해야 하는 일

- 공식 클릭 경로: `워크스페이스 선택 -> 앱 선택 -> 좌측 메뉴 앱 출시`
- `.ait` 업로드 후 `테스트하기`로 QR 코드 또는 테스트 스킴 확인
- 공식 문서 기준으로 QR 테스트는 `토스 앱 로그인`, `워크스페이스 멤버`, `만 19세 이상` 조건이 필요합니다.
- 공식 문서 기준으로 `테스트를 최소 1회 이상 완료`해야 `검토 요청하기` 버튼이 활성화됩니다.
- 승인 후에는 콘솔의 `출시하기` 버튼으로 실제 공개합니다.

#### 2-C. CLI 테스트 업로드를 쓰는 경우

- 공식 문서 기준 클릭 경로: `워크스페이스 선택 -> 좌측 메뉴 키`
- 이곳에서 API 키를 발급할 수 있습니다.
- API 키는 전체 앱 또는 특정 앱 단위로 접근 권한을 설정할 수 있습니다.
- 이 하니스의 GitHub Actions `Test Upload` workflow를 쓰려면 그 값을 `AITO_DEPLOY_API_KEY` secret으로 넣습니다.

#### 2-D. 기능별 추가 콘솔 설정이 필요한 경우

모든 앱이 아래를 다 하는 것은 아닙니다. 실제 기획에서 해당 기능을 쓸 때만 준비합니다.

- `토스 로그인`
  - 대표관리자 계정으로 약관 동의 필요
  - 권한 범위(scope), 약관 링크, 연결 끊기 콜백 URL 설정 필요
  - 복호화 키를 메일로 받아 안전한 비밀 저장소에 보관해야 함
- `토스페이`
  - 사전 계약과 심사 후 키 발급
  - 콘솔 `워크스페이스 -> 연동 키`에 앱인토스 전용 토스페이 키 등록
- `인앱 결제`
  - 사업자 정보 등록
  - 워크스페이스 `정보` 탭에서 정산 정보 등록 및 검토 요청
  - 인앱 상품 등록
- `인앱 광고`
  - 사업자 정보 등록
  - 워크스페이스 `정보` 탭에서 정산 정보 등록 및 검토 요청
  - 광고 그룹 생성
- `프로모션`
  - 사업자 정보 등록
  - 정산 정보 등록
  - 대표관리자의 프로모션/비즈월렛 약관 동의
  - 비즈월렛 충전
  - 비게임 앱은 토스 로그인, 게임 앱은 게임 로그인 연동 필요

공식 근거 문서:

- [콘솔에서 앱 등록하기](https://developers-apps-in-toss.toss.im/prepare/console-workspace.html)
- [미성년자 콘솔 참여방법](https://developers-apps-in-toss.toss.im/prepare/console-minor.html)
- [사업자 등록하기](https://developers-apps-in-toss.toss.im/prepare/register-business.html)
- [토스앱 테스트](https://developers-apps-in-toss.toss.im/development/test/toss.html)
- [미니앱 출시](https://developers-apps-in-toss.toss.im/development/deploy.html)
- [앱 내 기능](https://developers-apps-in-toss.toss.im/development/test/function.html)
- [토스 로그인 콘솔 가이드](https://developers-apps-in-toss.toss.im/login/console.html)
- [토스페이 콘솔 가이드](https://developers-apps-in-toss.toss.im/tosspay/console.html)
- [인앱 결제 콘솔 가이드](https://developers-apps-in-toss.toss.im/iap/console.html)
- [인앱 광고 콘솔 가이드](https://developers-apps-in-toss.toss.im/ads/console.html)
- [프로모션 콘솔 가이드](https://developers-apps-in-toss.toss.im/promotion/console.html)

### 3. 하니스를 복제해 만든 앱 저장소에서 채울 환경값

넣는 위치:

- 로컬 개발: 해당 앱 저장소 루트의 `.env`
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

이 하니스 저장소에는 네 가지 workflow가 있습니다.

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

즉, 이 하니스는 `개발`, `검증`, `빌드`, `테스트 업로드`까지를 강하게 자동화하고,
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
