---
name: apps-in-toss-release-readiness-checker
description: Check whether an Apps in Toss app is ready for test upload, review request, or release. Use before building a release bundle, before requesting review, or before pressing release in the console.
---

# Apps in Toss Release Readiness Checker

Use this skill near build, upload, review, and release milestones.

## Goal

Classify readiness into:

- `개발 중`
- `테스트 업로드 가능`
- `검토 요청 가능`
- `출시 가능`

## Checklist Areas

- environment values finalized
- HTTPS and CORS ready
- permissions declared and handled
- backend/server dependencies ready
- sandbox/manual QA completed
- `.ait` bundle size and assets strategy
- test upload completed at least once
- review risk items cleared
- monitoring and rollback awareness

## Read In This Order

1. `AGENTS.md`
2. `docs/setup/apps-in-toss-rn.md`
3. `docs/ops/apps-in-toss-harness-ci-cd.md`
4. Relevant integration docs
5. Official docs via `docs-search` if uncertain

## Response Format

1. Current readiness state
2. Passed checks
3. Blocking checks
4. Recommended next action

## Guardrails

- Treat `review request` and `release` as separate gates.
- Do not mark a build as release-ready if test upload or mandatory QA is missing.

## 작업 완료 후 필수 보고

- 이 스킬이 호출되어 결과를 작성한 경우, 응답 마지막에 반드시 아래 한 줄을 추가한다.
- `스킬 사용 보고: $apps-in-toss-release-readiness-checker 적용 완료`
