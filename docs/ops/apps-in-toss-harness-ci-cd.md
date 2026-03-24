# Apps in Toss Harness CI/CD

## 목표

이 저장소의 CI/CD는 Apps in Toss 공식 배포 흐름을 그대로 반영한다.

1. 코드 검증
2. `.ait` 번들 생성
3. 테스트 업로드
4. 콘솔 QR / `intoss-private://` 테스트
5. 콘솔에서 검토 요청
6. 승인 후 콘솔에서 출시

자동화 범위는 기본적으로 `테스트 업로드`까지다.
`검토 요청`, `승인`, `출시하기`는 현재 공식 문서 기준으로 콘솔 수동 단계다.

## 공식 근거

- 테스트 업로드는 콘솔 직접 업로드 또는 `CI/CD 명령어를 통한 자동 업로드`를 지원한다.
- 자동 업로드는 `SDK v1.4.0 이상`에서 지원된다.
- 테스트를 1회 이상 완료해야 검토 요청 버튼이 활성화된다.
- 승인 후 콘솔의 `출시하기` 버튼으로 사용자에게 공개한다.

참고 문서:

- `https://developers-apps-in-toss.toss.im/development/test/toss.md`
- `https://developers-apps-in-toss.toss.im/development/deploy.md`

## GitHub Actions 구성

### 1. CI

용도:

- 템플릿/하니스 무결성 확인
- lint, typecheck, harness tests 실행

실행 명령:

```bash
npm run verify
```

### 2. Test Upload

용도:

- `.ait` 생성
- Apps in Toss 테스트 업로드
- 테스트용 QR / 스킴 확보

실행 명령:

```bash
npm run build
npm run upload:test
```

필수 GitHub 설정:

- `vars.AITO_APP_NAME`
- `vars.AITO_DISPLAY_NAME`
- `vars.AITO_PRIMARY_COLOR`
- `vars.AITO_API_BASE_URL`
- `secrets.AITO_DEPLOY_API_KEY`

선택값:

- `vars.AITO_ICON_URL`
- `vars.AITO_WORKSPACE_NAME`

### 3. Docs Freshness

용도:

- 공식 문서 변경 감지
- 하니스 규칙 drift 조기 발견

실행 명령:

```bash
npm run docs:check:strict
```

리포트 산출물:

- `artifacts/docs-freshness-report.md`

## 추적 중인 공식 문서

- React Native 튜토리얼
- 토스앱 테스트
- 미니앱 출시
- 릴리즈 노트
- 서비스 오픈 정책

이 문서들은 하니스의 빌드/업로드/검수/정책에 직접 영향을 주는 최소 집합이다.

## 운영 규칙

문서 변경이 감지되면 아래 순서로 처리한다.

1. `npm run docs:sync`
2. 변경된 문서 확인
3. `AGENTS.md` 반영 필요 여부 판단
4. `STACK.md` 반영 필요 여부 판단
5. `docs/setup/apps-in-toss-rn.md` 반영
6. `docs/toss/integration/*` 반영
7. 배포/검수 영향이 있으면 CI 또는 doctor 규칙 수정

우선순위를 높게 보는 변경:

- `release-note`
- `service-open-policy`
- `deploy`
- `test-toss`

## 원문 접근 메모

공식 `.md` 경로는 raw markdown이며 `gzip` 응답으로 내려올 수 있다.
압축 해제를 지원하지 않는 도구로 보면 한글이 깨진 것처럼 보일 수 있다.

예:

- raw: `https://developers-apps-in-toss.toss.im/development/test/toss.md`
- page: `https://developers-apps-in-toss.toss.im/development/test/toss.html`

문서 확인 자동화는 raw `.md`를 기준으로 하고, 사람이 읽을 때는 `.html` 경로를 병행한다.
