# Apps in Toss Skill Pack

이 폴더는 기존 프로젝트에 그대로 복사해 넣을 수 있는 Apps in Toss 전용 스킬 묶음이다. 목적은 하니스 자체를 이식하는 것이 아니라, 기존 제품이나 코드베이스를 Apps in Toss 배포 가능 상태로 끌고 가는 판단 흐름을 재사용하는 데 있다.

## 최종 스킬 리스트

- `apps-in-toss-project-intake-router`
  - 기존 프로젝트를 Apps in Toss로 가져올 때 첫 진입점
- `apps-in-toss-request-validator`
  - 요청 자체가 Apps in Toss에서 허용되는지 먼저 판별
- `apps-in-toss-review-risk-checker`
  - 구현 가능해 보여도 검수나 출시 리스크가 큰지 분리
- `apps-in-toss-feature-prereq-mapper`
  - 기능별 선행조건을 권한, 콘솔, 서버, QA 기준으로 정리
- `apps-in-toss-backend-scope-slicer`
  - 서버가 필요한지와 최소 백엔드 범위를 자름
- `apps-in-toss-manual-test-scribe`
  - 자동화로 닫히지 않는 런타임 QA 절차를 문서화
- `apps-in-toss-release-readiness-checker`
  - 빌드, 테스트 업로드, 검토 요청, 출시 게이트를 점검

## 권장 호출 순서

1. 기존 프로젝트를 처음 Apps in Toss로 가져온다:
   `apps-in-toss-project-intake-router`
2. 요구 자체가 정책, 보안, 런타임 제약에 걸릴 수 있다:
   `apps-in-toss-request-validator`
3. 구현은 가능해 보여도 반려나 출시 지연이 걱정된다:
   `apps-in-toss-review-risk-checker`
4. 기능 선행조건이 아직 흐리다:
   `apps-in-toss-feature-prereq-mapper`
5. 로그인, 결제, 인앱결제, 프로모션, 메시지, 서버 API가 들어간다:
   `apps-in-toss-backend-scope-slicer`
6. 구현과 자동 테스트 이후에도 런타임 확인이 남는다:
   `apps-in-toss-manual-test-scribe`
7. `.ait` 빌드, 테스트 업로드, 검토 요청, 출시 직전이다:
   `apps-in-toss-release-readiness-checker`

## Skill Installer 호환 구조

이 스킬 팩은 Codex `skill-installer` 기준으로 설치 가능한 형태다. 이유는 각 설치 단위가 모두 `skills/<skill-name>/SKILL.md` 구조를 따르기 때문이다.

설치 가능한 개별 경로:

- `skills/apps-in-toss-project-intake-router`
- `skills/apps-in-toss-request-validator`
- `skills/apps-in-toss-review-risk-checker`
- `skills/apps-in-toss-feature-prereq-mapper`
- `skills/apps-in-toss-backend-scope-slicer`
- `skills/apps-in-toss-manual-test-scribe`
- `skills/apps-in-toss-release-readiness-checker`

단일 스킬 설치 예시:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --url https://github.com/<owner>/<repo>/tree/main/skills/apps-in-toss-request-validator
```

전체 팩 설치 예시:

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

중요한 제약:

- bare GitHub repo URL만으로는 전체 팩이 설치되지 않는다.
- `skill-installer`는 `--repo`를 쓰면 반드시 `--path`가 필요하고, `--url`을 쓰면 URL 안에 `tree/<ref>/<path>`가 포함되어야 한다.
- 즉, "repo 주소만 던지면 자동으로 이 repo 안의 모든 skill을 설치"하는 방식은 현재 installer 기준으로 지원되지 않는다.
- 한 번에 여러 스킬을 설치하려면 위처럼 여러 `--path`를 넘겨야 한다.

## 호스트 프로젝트 룰 매핑 가이드

다른 프로젝트의 `AGENTS.md`, `CLAUDE.md`, 팀 운영 문서에는 아래처럼 연결하는 것을 권장한다.

```md
## Apps in Toss Skill Trigger Map

- 기존 프로젝트나 기존 제품을 Apps in Toss로 옮기기 시작할 때는 `skills/apps-in-toss-project-intake-router/SKILL.md`를 먼저 읽는다.
- 요청이 Apps in Toss 정책, 보안, 런타임 제약과 충돌할 수 있으면 `skills/apps-in-toss-request-validator/SKILL.md`를 먼저 읽는다.
- 구현 가능 여부와 별개로 검수 반려나 출시 지연 리스크가 걱정되면 `skills/apps-in-toss-review-risk-checker/SKILL.md`를 읽는다.
- 기능 요구는 유효하지만 권한, 콘솔 설정, 앱 내 기능, 서버, mTLS, HTTPS, CORS, 수동 QA 선행조건이 흐리면 `skills/apps-in-toss-feature-prereq-mapper/SKILL.md`를 읽는다.
- 로그인, 결제, 인앱결제, 프로모션, 스마트 메시지, 서버 API 연동이 들어가면 `skills/apps-in-toss-backend-scope-slicer/SKILL.md`를 읽는다.
- 자동 테스트만으로 끝낼 수 없는 샌드박스, QR, 권한, 브리지, 결제, 실기기 검증이 남으면 `skills/apps-in-toss-manual-test-scribe/SKILL.md`를 읽는다.
- 빌드, 테스트 업로드, 검토 요청, 출시 직전에는 `skills/apps-in-toss-release-readiness-checker/SKILL.md`를 읽는다.
```

## 이식 원칙

- 스킬은 특정 하니스 구조를 전제하지 않는다. 먼저 호스트 프로젝트의 `AGENTS.md`, `CLAUDE.md`, `README.md`, `STACK.md`가 있는지 보고 읽는다.
- 호스트 프로젝트에 `docs/toss/`, `docs/setup/`, `docs/ops/` 같은 로컬 요약 문서가 있으면 먼저 쓰고, 없으면 공식 Apps in Toss 문서를 바로 확인한다.
- 응답 말미에 특정 보고 문구를 강제하지 않는다. 필요하면 호스트 프로젝트 룰에서 따로 추가한다.
- Claude Code 마이그레이션 같은 도구별 보조 스킬은 이 팩에 포함하지 않는다. 이 팩은 Apps in Toss delivery 판단과 게이팅에만 집중한다.
