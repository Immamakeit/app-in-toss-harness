---
name: apps-in-toss-project-intake-router
description: Use when adapting an existing product or codebase to Apps in Toss and you need to decide the delivery path, runtime fit, immediate blockers, and which Apps in Toss skills to run next.
---

# Apps in Toss Project Intake Router

## Overview

Use this skill as the entry point when an existing project needs to move toward Apps in Toss delivery. It does not implement features. It determines the shortest compliant path and routes the work to the next Apps in Toss skills.

## Goal

Produce a project-level intake result that answers:

- Is this project suitable for Apps in Toss as-is, conditionally, or only after redesign?
- What runtime path is most defensible?
- What is blocked right now?
- Which Apps in Toss skill should run next, and in what order?

## Read In This Order

1. Host project instructions if present: `AGENTS.md`, `CLAUDE.md`, `README.md`, `STACK.md`
2. Host project files that reveal the current runtime, entrypoints, and external dependencies
3. Host-local Apps in Toss docs if present
4. Official Apps in Toss docs via `docs-search` or direct lookup when runtime fit or policy support is unclear

## Decision Checks

- current product type and core user flow
- current stack and whether reuse is realistic
- reliance on external links, external app installs, or blocked architectures
- whether RN baseline fits or whether a WebView justification is actually needed
- permissions, app-function entry, backend, mTLS, HTTPS, and CORS needs
- whether request validation or review-risk analysis must happen before planning

## Response Format

1. Intake verdict:
   `바로 진행 가능`, `조건부 적합`, `재설계 필요`, or `Apps in Toss 부적합`
2. Recommended runtime path:
   for example `RN baseline 유지`, `기존 웹 자산을 WebView 경로로 제한적 재사용`, or `핵심 플로우 재구성 필요`
3. Immediate blockers:
   the smallest set of policy, runtime, or delivery blockers
4. Next skill sequence:
   list the exact Apps in Toss skills to run next in order
5. Evidence and assumptions:
   cite host-project docs and official docs where relevant

## Guardrails

- Do not default to WebView just because the source project is web-based.
- If the core premise conflicts with Apps in Toss policy or review rules, route to `apps-in-toss-request-validator` first and pause implementation.
- Keep the recommendation focused on the minimum path to a deployable Apps in Toss version, not a full platform rewrite.
