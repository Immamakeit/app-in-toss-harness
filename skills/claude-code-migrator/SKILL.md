---
name: claude-code-migrator
description: Migrate this Apps in Toss harness into Claude Code-compatible project files. Use only when the user explicitly asks for Claude Code migration or directly mentions $claude-code-migrator, CLAUDE.md, .claude/settings.json, .claude/skills, or .claude/commands. Never invoke implicitly during normal Apps in Toss work.
---

# Claude Code Migrator

Use this skill only on explicit request.

## Goal

Generate or update the Claude Code project files needed to use this harness from Claude Code without changing the app's business logic.

Typical outputs:

- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/skills/*`
- `.claude/commands/*`
- migration notes for non-1:1 mappings

## Inputs To Read

Read only what is needed:

1. `AGENTS.md`
2. `README.md`
3. `skills/*/SKILL.md`
4. Existing `CLAUDE.md`, `.claude/settings.json`, `.claude/skills/*`, `.claude/commands/*`
5. `references/claude-code-migration.md`

If a mapping is unclear, prefer documenting the gap over pretending there is a perfect equivalent.

## Manual-Only Guardrail

Do not use this skill unless the user explicitly asks for one of:

- `Claude Code migration`
- `$claude-code-migrator`
- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/skills`
- `.claude/commands`

Normal Apps in Toss development, planning, review-risk checks, backend scoping, testing, or release work must not trigger this skill.

## Migration Rules

### 1. Rules and project memory

- Migrate shared project rules from `AGENTS.md` into `CLAUDE.md`.
- Keep the Claude version focused on project policy, workflow, and guardrails.
- Do not delete `AGENTS.md` unless the user explicitly asks for Codex-only cleanup.

### 2. Shared Claude settings

- If the repo needs shared Claude Code settings, write them to `.claude/settings.json`.
- Do not write user-specific values into shared settings.
- Do not touch `~/.claude/*`.
- Do not commit `.claude/settings.local.json`; if a local-only setting is needed, mention it in the response and keep it out of tracked files.

### 3. Repo-local skills vs manual commands

- If a Codex repo-local skill should remain automatically available in Claude Code, migrate it into `.claude/skills/<skill-name>/SKILL.md`.
- If a workflow must remain explicit/manual-only, represent it as a Claude Code project command under `.claude/commands/` instead of an auto-discovered Claude skill.
- For the migration workflow itself, prefer a manual Claude command such as `.claude/commands/sync-apps-in-toss-harness.md`.

### 4. Non-1:1 mappings

- When Codex behavior does not map cleanly to Claude Code, write down the gap and the chosen fallback.
- Never claim that a setting, hook, sub-agent behavior, or permission model is perfectly identical if it is only approximate.
- Preserve the intent first: safety, explicitness, repo-local discoverability, and repeatable workflow.

## Expected Output Structure

When the user asks for the migration, respond with:

1. What files were created or updated
2. Which Codex concepts mapped cleanly
3. Which concepts were approximated or could not be mapped 1:1
4. What the Claude Code user should do next

## Guardrails

- Do not modify app logic unless the user explicitly bundles migration with implementation work.
- Do not remove Codex files or Codex workflows by default.
- Do not place secrets in `CLAUDE.md` or `.claude/settings.json`.
- Keep generated Claude files harness-oriented, not app-specific.

## 작업 완료 후 필수 보고

- 이 스킬이 호출되어 결과를 작성한 경우, 응답 마지막에 반드시 아래 한 줄을 추가한다.
- `스킬 사용 보고: $claude-code-migrator 적용 완료`
