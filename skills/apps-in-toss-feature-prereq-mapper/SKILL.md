---
name: apps-in-toss-feature-prereq-mapper
description: Map a requested Apps in Toss feature to its concrete prerequisites before implementation. Use when a user asks for a feature and you need to determine whether it requires permissions, console setup, app-function registration, backend work, mTLS, HTTPS, CORS, sandbox/manual QA, or review coordination.
---

# Apps in Toss Feature Prereq Mapper

Use this skill when a request is probably valid but the delivery prerequisites are still unclear.

## Goal

Convert a feature request into a prerequisite matrix.

## Output Categories

For each feature or flow, mark whether it needs:

- 권한
- 콘솔 설정
- 앱 내 기능 등록
- 서버
- mTLS
- HTTPS
- CORS
- 샌드박스 테스트
- 실기기 수동 검증
- 검수 주의사항

## Read In This Order

1. `AGENTS.md`
2. Relevant docs in `docs/toss/integration/*.md`
3. `docs/setup/apps-in-toss-rn.md`
4. Official docs via `docs-search` when uncertain

## Response Format

For each requested feature:

1. Feature name
2. Required prerequisites
3. Why each prerequisite is needed
4. What can be done immediately
5. What blocks implementation

## Guardrails

- Do not jump to implementation before the prerequisite matrix is clear.
- If a prerequisite is unknown, mark it as `공식 문서 재확인 필요`.

## 작업 완료 후 필수 보고

- 이 스킬이 호출되어 결과를 작성한 경우, 응답 마지막에 반드시 아래 한 줄을 추가한다.
- `스킬 사용 보고: $apps-in-toss-feature-prereq-mapper 적용 완료`
