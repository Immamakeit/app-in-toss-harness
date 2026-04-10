---
name: apps-in-toss-review-risk-checker
description: Use when a technically buildable Apps in Toss plan may still be rejected, delayed, or constrained by review, launch, branding, or policy interpretation.
---

# Apps in Toss Review Risk Checker

## Overview

Use this skill when the request may be technically buildable but still risky for review, app-function approval, or launch operations.

## Goal

Classify review risk into:

- `낮음`
- `중간`
- `높음`
- `반려 가능성 높음`

Then explain what specifically creates the risk and how to lower it.

## Read In This Order

1. Host project instructions if present: `AGENTS.md`, `CLAUDE.md`, `README.md`, `STACK.md`
2. Host-local Apps in Toss docs if present, especially policy, review, setup, or ops notes
3. Official Apps in Toss docs via `docs-search` or direct lookup when review interpretation is unclear

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
