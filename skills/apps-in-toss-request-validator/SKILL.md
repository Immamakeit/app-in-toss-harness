---
name: apps-in-toss-request-validator
description: Validate whether a user request is actually viable for Apps in Toss delivery before planning or implementation. Use when the user asks for a feature, product idea, flow, monetization, external-link behavior, login/payment/promotion integration, or any request that may conflict with Apps in Toss platform rules, review policy, security requirements, or runtime constraints.
---

# Apps in Toss Request Validator

Use this skill before implementation when a request may be disallowed, risky, or conditionally supported in Apps in Toss.

## Goal

Classify the request into one of:

- `허용`
- `조건부`
- `불가/고위험`

Then explain the result with concrete reasons and next steps.

## Inputs To Check

Read only what is needed:

1. Project policy in `AGENTS.md`
2. Relevant local summaries under `docs/toss/integration/*.md`
3. Setup/ops docs under `docs/setup/*.md`, `docs/ops/*.md`
4. If still uncertain, use `docs-search` to re-check the official Apps in Toss docs

Do not rely on generic web/mobile assumptions when Apps in Toss behavior may differ.

## Classification Rules

### `허용`

Choose this only if the request is compatible with current Apps in Toss rules and no major policy/runtime conflict is visible.

Typical examples:

- normal screen flows inside the miniapp
- TDS-based non-game UI
- sandbox-compatible testing flows
- server-backed login/payment integrations that follow the documented structure

### `조건부`

Choose this if the request is possible only with prerequisites or carries notable review/ops risk.

Typical conditions:

- server required
- mTLS required
- HTTPS required
- CORS changes required
- console setup required
- permissions required
- app-function registration required
- review interpretation risk exists

### `불가/고위험`

Choose this if the request conflicts with Apps in Toss policy, runtime constraints, or likely review rejection.

High-priority examples:

- core flow depends on external links
- encouraging installation of an external app
- financial product brokerage, promotion, or solicitation
- investment advice, paid signals, reading rooms
- crypto, NFT, digital assets
- cash conversion, withdrawal, refund/exchange of cash-like value
- gambling, betting, lottery-like mechanics
- policy/review evasion
- HTTP-only live flows
- cookie-dependent login architecture
- client calling Apps in Toss server APIs directly
- iframe-based architecture outside the documented exception

## Response Format

Answer in this order:

1. Classification: `허용`, `조건부`, or `불가/고위험`
2. Concrete reason:
   explain exactly what conflicts or what prerequisites exist
3. Evidence:
   cite local docs and/or official docs when available
4. Safe next step:
   propose the compliant alternative or the required prerequisites

## Guardrails

- Do not hand-wave with "might be hard" when the issue is actually policy or platform incompatibility.
- Do not propose stealthy workarounds for blocked behavior.
- If the request is blocked, say so plainly and offer the nearest deployable alternative.
- If the docs are ambiguous, explicitly say that the point needs official re-check and use `docs-search`.

## 작업 완료 후 필수 보고

- 이 스킬이 호출되어 결과를 작성한 경우, 응답 마지막에 반드시 아래 한 줄을 추가한다.
- `스킬 사용 보고: $apps-in-toss-request-validator 적용 완료`
