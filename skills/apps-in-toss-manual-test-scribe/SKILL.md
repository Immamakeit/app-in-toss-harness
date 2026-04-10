---
name: apps-in-toss-manual-test-scribe
description: Use when an Apps in Toss flow cannot be reliably covered by automated tests and needs a reproducible manual QA script.
---

# Apps in Toss Manual Test Scribe

## Overview

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

1. Host project instructions if present: `AGENTS.md`, `CLAUDE.md`, `README.md`, `STACK.md`
2. Host-local Apps in Toss docs if present, especially feature, setup, or test notes
3. Official Apps in Toss docs via `docs-search` or direct lookup when runtime test details are unclear

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
