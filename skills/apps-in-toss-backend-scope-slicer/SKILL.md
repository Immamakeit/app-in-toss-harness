---
name: apps-in-toss-backend-scope-slicer
description: Determine the minimum backend scope required for an Apps in Toss feature set. Use when a user asks for login, payment, in-app purchase, promotion, smart message, server API integration, or any flow where it is unclear whether a backend is needed and what the minimum server surface should be.
---

# Apps in Toss Backend Scope Slicer

Use this skill when a user request may require partner-server work.

## Goal

Classify the backend need into:

- `백엔드 불필요`
- `기존 백엔드 재사용`
- `신규 백엔드 필요`

If backend work is needed, define the minimum scope.

## Minimum Scope Items

- required endpoints
- required data storage
- token/session handling
- mTLS requirement
- callback handling
- operational secrets
- CORS and HTTPS requirements

## Read In This Order

1. `AGENTS.md`
2. Relevant integration docs in `docs/toss/integration/*.md`
3. Setup/ops docs
4. Official docs via `docs-search` when uncertain

## Response Format

1. Classification
2. Why backend is or is not needed
3. Minimum backend responsibilities
4. Data that must be stored
5. What stays in the client
6. What remains an open issue

## Guardrails

- Do not say backend is optional if the documented flow requires server-to-server calls.
- Keep the scope minimal and implementation-oriented.

## 작업 완료 후 필수 보고

- 이 스킬이 호출되어 결과를 작성한 경우, 응답 마지막에 반드시 아래 한 줄을 추가한다.
- `스킬 사용 보고: $apps-in-toss-backend-scope-slicer 적용 완료`
