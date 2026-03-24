---
name: apps-in-toss-manual-test-scribe
description: Write a concrete manual QA checklist for Apps in Toss flows that cannot be reliably covered by automated tests. Use when a feature touches sandbox behavior, QR or intoss-private test flows, permissions, payments, login, promotions, app-function entry, device-specific behavior, or any bridge/runtime behavior that needs manual verification.
---

# Apps in Toss Manual Test Scribe

Use this skill when automatic tests are not enough and a reproducible manual QA script is required.

## Goal

Produce a short but complete manual test script that another person can execute.

## Include

- preconditions
- device/environment
- exact steps
- expected result
- failure signals/log points
- whether sandbox, QR, or real device is required

## Read In This Order

1. `AGENTS.md`
2. Relevant feature docs in `docs/toss/integration/*.md`
3. `docs/setup/apps-in-toss-rn.md`
4. Official docs via `docs-search` if needed

## Response Format

1. Test name
2. Preconditions
3. Environment
4. Steps
5. Expected result
6. Failure clues

## Guardrails

- Be explicit about whether the test needs sandbox, QR, `intoss-private://`, iOS real device, Android `adb reverse`, or live console state.
- Do not claim automation covers what actually needs manual runtime verification.

## 작업 완료 후 필수 보고

- 이 스킬이 호출되어 결과를 작성한 경우, 응답 마지막에 반드시 아래 한 줄을 추가한다.
- `스킬 사용 보고: $apps-in-toss-manual-test-scribe 적용 완료`
