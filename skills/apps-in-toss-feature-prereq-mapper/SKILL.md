---
name: apps-in-toss-feature-prereq-mapper
description: Use when a requested Apps in Toss feature seems viable but its concrete delivery prerequisites are still unclear.
---

# Apps in Toss Feature Prereq Mapper

## Overview

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

1. Host project instructions if present: `AGENTS.md`, `CLAUDE.md`, `README.md`, `STACK.md`
2. Host-local Apps in Toss docs if present, especially feature, setup, or ops notes
3. Official Apps in Toss docs via `docs-search` or direct lookup when prerequisites are uncertain

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
