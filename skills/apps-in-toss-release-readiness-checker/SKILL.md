---
name: apps-in-toss-release-readiness-checker
description: Use before building, test uploading, requesting review, or releasing an Apps in Toss app to determine the current release gate status.
---

# Apps in Toss Release Readiness Checker

## Overview

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

1. Host project instructions if present: `AGENTS.md`, `CLAUDE.md`, `README.md`, `STACK.md`
2. Host-local Apps in Toss docs if present, especially setup, CI/CD, release, or integration notes
3. Official Apps in Toss docs via `docs-search` or direct lookup when gate rules are uncertain

## Response Format

1. Target gate: `테스트 업로드`, `검토 요청`, or `출시`
2. Current readiness state
3. Passed checks
4. Blocking checks
5. Recommended next action

## Guardrails

- Treat `review request` and `release` as separate gates.
- Do not mark a build as release-ready if test upload or mandatory QA is missing.
