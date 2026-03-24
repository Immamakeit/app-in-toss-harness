# Claude Code Migration Reference

이 파일은 `claude-code-migrator` 스킬이 Claude Code용 프로젝트 파일을 만들거나 갱신할 때 참고하는 기준 메모다.

## 공식 개념 대응

- `AGENTS.md` -> `CLAUDE.md`
- `.codex/config.toml` -> `.claude/settings.json`
- Codex repo-local skills -> `.claude/skills/`
- 수동 전용 워크플로 -> `.claude/commands/`
- Hooks -> `.claude/settings.json`의 hook 설정

## 마이그레이션 원칙

### `CLAUDE.md`

- 프로젝트의 규칙, 금지사항, 개발 흐름, 검수/배포 가드레일을 담는다.
- 앱별 비즈니스 값이나 비밀값은 넣지 않는다.

### `.claude/settings.json`

- 저장소가 함께 써야 하는 공유 설정만 넣는다.
- 개인 로컬 설정은 `.claude/settings.local.json`에 두고 버전관리하지 않는다.

### `.claude/skills/`

- Codex에서 자동/준자동으로 호출되던 repo-local skill을 Claude Code에서도 재사용하고 싶을 때 쓴다.
- 단, 자동으로 항상 떠야 하는지 먼저 판단한다.

### `.claude/commands/`

- 명시적 수동 실행만 허용해야 하는 워크플로는 project command로 둔다.
- Claude Code 마이그레이션 자체는 여기에 두는 것이 기본값이다.

## 매핑 시 주의사항

- Codex와 Claude Code의 권한/샌드박스/모델/서브에이전트 동작은 완전히 같다고 가정하지 않는다.
- 1:1 대응이 불명확하면 억지 매핑 대신 `migration note`로 남긴다.
- Codex용 파일은 기본적으로 유지하고, Claude Code용 파일을 추가하는 방식으로 간다.

## 공식 참고 링크

- Claude Code hooks: `https://docs.claude.com/en/docs/claude-code/hooks-guide`
- Claude Code agent skills: `https://docs.claude.com/en/docs/agents-and-tools/agent-skills`
- Claude Code custom slash commands: `https://docs.claude.com/en/docs/claude-code/tutorials`
