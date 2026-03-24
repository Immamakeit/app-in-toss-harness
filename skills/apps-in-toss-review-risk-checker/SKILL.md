---
name: apps-in-toss-review-risk-checker
description: Assess Apps in Toss review and launch risk before implementation or submission. Use when a user proposes a feature, monetization flow, external link behavior, branding pattern, app split strategy, promotion wording, or any plan that may be rejected or delayed during Apps in Toss review.
---

# Apps in Toss Review Risk Checker

Use this skill when the request may be technically buildable but still risky for review, app-function approval, or launch operations.

## Goal

Classify review risk into:

- `낮음`
- `중간`
- `높음`
- `반려 가능성 높음`

Then explain what specifically creates the risk and how to lower it.

## Read In This Order

1. `AGENTS.md`
2. Relevant docs under `docs/toss/integration/*.md`
3. Relevant setup/ops docs under `docs/setup/*.md`, `docs/ops/*.md`
4. If needed, use `docs-search` for official review/policy docs

## What To Check

- external-link dependency
- external app install induction
- financial product promotion or brokerage
- investment advice or paid signal patterns
- crypto/NFT/digital asset exposure
- cash-like conversion, refund, withdrawal, payout wording
- duplicated brand/app split strategy
- app-function completeness
- reward wording such as `포인트`, `출금`, `인출`
- release readiness requirements such as test completion, bundle size, HTTPS, permissions

## Response Format

1. Risk level
2. Exact risk reason
3. Evidence
4. What to change before review
5. Whether implementation should proceed now or pause

## Guardrails

- Distinguish `technical feasibility` from `review feasibility`.
- If risk is high, do not present it as a normal implementation task.
- Offer the nearest compliant alternative.

## 작업 완료 후 필수 보고

- 이 스킬이 호출되어 결과를 작성한 경우, 응답 마지막에 반드시 아래 한 줄을 추가한다.
- `스킬 사용 보고: $apps-in-toss-review-risk-checker 적용 완료`
