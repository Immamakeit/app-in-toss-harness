---
name: apps-in-toss-backend-scope-slicer
description: Use when an Apps in Toss flow may require partner-server work and you need to define whether a backend is needed and what the minimum server surface should be.
---

# Apps in Toss Backend Scope Slicer

## Overview

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

1. Host project instructions if present: `AGENTS.md`, `CLAUDE.md`, `README.md`, `STACK.md`
2. Host-local Apps in Toss docs if present, especially integration, setup, or ops notes
3. Official Apps in Toss docs via `docs-search` or direct lookup when backend requirements are uncertain

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
