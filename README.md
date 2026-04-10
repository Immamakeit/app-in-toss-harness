# Apps in Toss Skills

## Install

각 스킬은 `skills/<skill-name>/SKILL.md` 구조를 따르므로 Codex `skill-installer`로 설치할 수 있다.

단일 스킬 설치:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --url https://github.com/<owner>/<repo>/tree/main/skills/apps-in-toss-request-validator
```

전체 팩 설치:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo <owner>/<repo> \
  --path skills/apps-in-toss-project-intake-router \
         skills/apps-in-toss-request-validator \
         skills/apps-in-toss-review-risk-checker \
         skills/apps-in-toss-feature-prereq-mapper \
         skills/apps-in-toss-backend-scope-slicer \
         skills/apps-in-toss-manual-test-scribe \
         skills/apps-in-toss-release-readiness-checker
```

설치 제약:

- bare GitHub repo URL만으로는 전체 스킬 팩이 설치되지 않는다.
- `--repo`를 쓰면 `--path`를 같이 넘겨야 한다.
- `--url`을 쓰면 `tree/<ref>/<path>`가 포함된 GitHub URL이어야 한다.
- 설치 단위는 repo 전체가 아니라 `SKILL.md`가 있는 개별 skill directory 다.

## Skill List

- `apps-in-toss-project-intake-router`
- `apps-in-toss-request-validator`
- `apps-in-toss-review-risk-checker`
- `apps-in-toss-feature-prereq-mapper`
- `apps-in-toss-backend-scope-slicer`
- `apps-in-toss-manual-test-scribe`
- `apps-in-toss-release-readiness-checker`

## Recommended Order

1. 기존 프로젝트나 기존 제품을 Apps in Toss로 가져오는 시작점이면 `apps-in-toss-project-intake-router`
2. 요청 자체가 정책, 보안, 런타임 제약과 충돌할 수 있으면 `apps-in-toss-request-validator`
3. 구현은 가능해 보여도 검수 반려나 출시 지연이 걱정되면 `apps-in-toss-review-risk-checker`
4. 기능 선행조건이 아직 흐리면 `apps-in-toss-feature-prereq-mapper`
5. 로그인, 결제, 인앱결제, 프로모션, 메시지, 서버 API가 들어가면 `apps-in-toss-backend-scope-slicer`
6. 자동 테스트 이후에도 런타임 검증이 남으면 `apps-in-toss-manual-test-scribe`
7. `.ait` 빌드, 테스트 업로드, 검토 요청, 출시 직전이면 `apps-in-toss-release-readiness-checker`

## Skill Guide

### `apps-in-toss-project-intake-router`

언제 호출하나:

- 기존 웹 서비스, 기존 앱, 기존 제품을 Apps in Toss로 가져올 수 있는지 처음 판단할 때
- RN으로 갈지, WebView 재사용이 가능한지, 아예 플로우 재설계가 필요한지 먼저 정해야 할 때
- 어떤 스킬부터 이어서 호출해야 할지 진입 경로가 필요할 때

이 스킬이 주는 것:

- 프로젝트 단위 적합성 판단
- 권장 runtime path
- 당장 막고 있는 blocker
- 다음에 호출할 Apps in Toss 스킬 순서

이럴 때 쓰면 맞다:

- "이 기존 서비스 구조를 Apps in Toss로 가져갈 수 있어?"
- "웹 서비스가 이미 있는데 RN으로 갈아야 해, 아니면 WebView로 일부 재사용 가능해?"
- "이 프로젝트에서 제일 먼저 어떤 Apps in Toss 검증부터 해야 해?"

보통 다음으로 이어지는 스킬:

- 정책 충돌이 의심되면 `apps-in-toss-request-validator`
- 검수 반려 리스크가 걱정되면 `apps-in-toss-review-risk-checker`
- 선행조건 정리가 필요하면 `apps-in-toss-feature-prereq-mapper`

예시 호출:

```text
$apps-in-toss-project-intake-router
기존 커머스 웹 프로젝트를 Apps in Toss로 옮기려 한다.
현재 핵심 플로우는 상품 조회, 로그인, 결제다.
어떤 runtime path가 맞고 다음에 어떤 스킬을 호출해야 하는지 정리해줘.
```

### `apps-in-toss-request-validator`

언제 호출하나:

- 요청이 Apps in Toss에서 허용되는지부터 판별해야 할 때
- 외부 링크, 외부 앱 설치 유도, 금융성, 현금화, 가상자산, 사행성, HTTP, 쿠키 로그인 같은 위험 키워드가 나왔을 때
- 구현 가능 여부보다 먼저 정책/플랫폼 적합성을 잘라야 할 때

이 스킬이 주는 것:

- `허용`
- `조건부`
- `불가/고위험`

함께 나와야 하는 설명:

- 왜 그런 분류인지
- 어떤 정책/런타임 제약과 충돌하는지
- 안전한 대안이 무엇인지

이럴 때 쓰면 맞다:

- "핵심 플로우를 외부 사이트로 보내도 돼?"
- "토스 미니앱에서 가상자산 기능 넣을 수 있어?"
- "클라이언트에서 바로 Apps in Toss 서버 API 호출하면 안 돼?"

예시 호출:

```text
$apps-in-toss-request-validator
사용자가 앱 안에서 투자 종목 추천을 보고 외부 증권사 링크로 넘어가게 하려 한다.
이게 Apps in Toss 기준으로 가능한지 판별해줘.
```

### `apps-in-toss-review-risk-checker`

언제 호출하나:

- 기술적으로 만들 수는 있어 보여도 검수에서 반려될지 걱정될 때
- 외부 링크, 브랜드 반복 노출, 앱 쪼개기, 리워드 문구, 금융성 표현, 앱 내 기능 완결성이 애매할 때
- 구현을 바로 시작해도 되는지, 먼저 표현이나 구조를 바꿔야 하는지 구분해야 할 때

이 스킬이 주는 것:

- `낮음`
- `중간`
- `높음`
- `반려 가능성 높음`

함께 나와야 하는 설명:

- 리스크를 올리는 요소
- 검수 전에 바꿔야 할 점
- 구현을 지금 진행할지 멈출지

이럴 때 쓰면 맞다:

- "이 구조 반려될 가능성 있어?"
- "같은 브랜드로 앱을 두 개로 쪼개도 돼?"
- "유저 보상 이름을 포인트/출금처럼 잡아도 되나?"

예시 호출:

```text
$apps-in-toss-review-risk-checker
같은 브랜드로 두 개의 Apps in Toss 앱을 만들어 하나는 상품 탐색, 하나는 주문 전환만 맡기려 한다.
검수와 출시 리스크를 평가해줘.
```

### `apps-in-toss-feature-prereq-mapper`

언제 호출하나:

- 기능은 하고 싶은데 준비물이 아직 안 보일 때
- 권한, 콘솔 설정, 앱 내 기능 등록, 서버, mTLS, HTTPS, CORS, 샌드박스 QA, 실기기 QA를 한 번에 정리해야 할 때
- "이 기능 넣으려면 뭐가 먼저 필요하지?"를 답해야 할 때

이 스킬이 주는 것:

- 기능별 prerequisite matrix
- 필요한 권한
- 필요한 콘솔 설정
- 서버 및 운영 선행조건
- 바로 할 수 있는 일과 막히는 일

이럴 때 쓰면 맞다:

- "위치 기반 혜택 기능 넣으려면 뭐가 필요해?"
- "앱 내 기능으로 특정 화면 바로 진입시키려면 선행조건이 뭐야?"
- "카메라, 연락처, 결제 기능을 같이 넣으려는데 준비물 정리해줘"

예시 호출:

```text
$apps-in-toss-feature-prereq-mapper
위치 권한을 써서 근처 매장 쿠폰을 보여주고, 앱 내 기능으로 쿠폰 상세 화면에 바로 진입시키고 싶다.
필요한 선행조건을 정리해줘.
```

### `apps-in-toss-backend-scope-slicer`

언제 호출하나:

- 로그인, 결제, 인앱결제, 프로모션, 스마트 메시지, 서버 API 연동이 들어갈 때
- 백엔드가 정말 필요한지, 필요하면 최소 범위를 어디까지 잘라야 하는지 보고 싶을 때
- 클라이언트와 서버 책임 경계를 먼저 정해야 할 때

이 스킬이 주는 것:

- `백엔드 불필요`
- `기존 백엔드 재사용`
- `신규 백엔드 필요`

함께 나와야 하는 설명:

- 최소 엔드포인트
- 저장해야 할 데이터
- 토큰/세션 처리 범위
- mTLS, CORS, HTTPS 요구사항

이럴 때 쓰면 맞다:

- "이 기획이면 서버 꼭 필요해?"
- "기존 백엔드 재사용으로 끝나나?"
- "로그인과 결제를 넣되 서버는 최소화하고 싶어"

예시 호출:

```text
$apps-in-toss-backend-scope-slicer
토스 로그인과 토스페이를 붙이려 한다.
파트너 서버가 꼭 필요한지와 최소 백엔드 범위를 잘라줘.
```

### `apps-in-toss-manual-test-scribe`

언제 호출하나:

- 자동 테스트만으로 닫히지 않는 Apps in Toss 런타임 동작이 남았을 때
- 샌드박스, QR, `intoss-private://`, 권한 팝업, 결제, 브리지, 실기기 네트워크 조건까지 재현 가능한 체크리스트가 필요할 때
- PR이나 작업 결과에 수동 QA 절차를 남겨야 할 때

이 스킬이 주는 것:

- preconditions
- device/environment
- exact steps
- expected result
- failure clues

이럴 때 쓰면 맞다:

- "샌드박스 앱에서 어떻게 검증해야 해?"
- "결제 성공 후 지급 실패 시나리오 수동 테스트 써줘"
- "iOS 실기기 로컬 네트워크 권한까지 포함해서 절차 적어줘"

예시 호출:

```text
$apps-in-toss-manual-test-scribe
샌드박스 앱에서 로그인 성공, 토큰 발급, 연결 해제 콜백까지 확인하는 수동 테스트 절차를 작성해줘.
iOS 실기기 기준으로 적어줘.
```

### `apps-in-toss-release-readiness-checker`

언제 호출하나:

- `.ait` 빌드 직전
- 테스트 업로드 직전
- 검토 요청 직전
- 출시 버튼을 누르기 직전

이 스킬이 주는 것:

- 목표 gate 기준 현재 상태
- 통과한 체크
- 막고 있는 체크
- 다음 액션

점검 축:

- 환경값 확정 여부
- HTTPS, CORS
- 권한 선언과 UX
- 서버 준비 상태
- 샌드박스 및 수동 QA 완료 여부
- 번들 크기와 리소스 전략
- 테스트 업로드 여부
- 검수 리스크 정리 여부

이럴 때 쓰면 맞다:

- "지금 테스트 업로드 가능한 상태야?"
- "검토 요청 걸어도 돼?"
- "출시 눌러도 되는지 마지막 점검해줘"

예시 호출:

```text
$apps-in-toss-release-readiness-checker
목표는 검토 요청이다.
현재 상태가 검토 요청 가능인지, 막는 항목이 뭔지 체크해줘.
```

## Rule Mapping Example

다른 프로젝트의 `AGENTS.md`나 `CLAUDE.md`에는 보통 아래 정도로 연결하면 된다.

```md
## Apps in Toss Skill Trigger Map

- 기존 프로젝트나 기존 제품을 Apps in Toss로 가져오기 시작할 때는 `skills/apps-in-toss-project-intake-router/SKILL.md`를 먼저 읽는다.
- 요청이 Apps in Toss 정책, 보안, 런타임 제약과 충돌할 수 있으면 `skills/apps-in-toss-request-validator/SKILL.md`를 먼저 읽는다.
- 구현 가능 여부와 별개로 검수 반려나 출시 지연 리스크가 걱정되면 `skills/apps-in-toss-review-risk-checker/SKILL.md`를 읽는다.
- 기능 요구는 유효하지만 권한, 콘솔 설정, 앱 내 기능, 서버, mTLS, HTTPS, CORS, 수동 QA 선행조건이 흐리면 `skills/apps-in-toss-feature-prereq-mapper/SKILL.md`를 읽는다.
- 로그인, 결제, 인앱결제, 프로모션, 스마트 메시지, 서버 API 연동이 들어가면 `skills/apps-in-toss-backend-scope-slicer/SKILL.md`를 읽는다.
- 자동 테스트만으로 끝낼 수 없는 샌드박스, QR, 권한, 브리지, 결제, 실기기 검증이 남으면 `skills/apps-in-toss-manual-test-scribe/SKILL.md`를 읽는다.
- 빌드, 테스트 업로드, 검토 요청, 출시 직전에는 `skills/apps-in-toss-release-readiness-checker/SKILL.md`를 읽는다.
```

## Repository Layout

```text
skills/
  apps-in-toss-project-intake-router/
    SKILL.md
  apps-in-toss-request-validator/
    SKILL.md
  apps-in-toss-review-risk-checker/
    SKILL.md
  apps-in-toss-feature-prereq-mapper/
    SKILL.md
  apps-in-toss-backend-scope-slicer/
    SKILL.md
  apps-in-toss-manual-test-scribe/
    SKILL.md
  apps-in-toss-release-readiness-checker/
    SKILL.md
  README.md
```
