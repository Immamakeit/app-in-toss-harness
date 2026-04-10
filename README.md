# Apps in Toss Skills

이 저장소는 Apps in Toss delivery 판단과 게이팅에 집중한 pure skill collection 이다. 앱 하니스, RN 코드, 빌드 스크립트는 포함하지 않고, 다른 프로젝트에 이식해서 쓰는 `skills/`만 유지한다.

## Included Skills

- `apps-in-toss-project-intake-router`
- `apps-in-toss-request-validator`
- `apps-in-toss-review-risk-checker`
- `apps-in-toss-feature-prereq-mapper`
- `apps-in-toss-backend-scope-slicer`
- `apps-in-toss-manual-test-scribe`
- `apps-in-toss-release-readiness-checker`

각 스킬의 역할, 권장 호출 순서, 호스트 프로젝트 룰 매핑 가이드는 [skills/README.md](/home/ghkim/dev/app-in-toss-by-gh/skills/README.md)에 정리되어 있다.

## Install With Codex Skill Installer

이 저장소의 각 스킬은 `skills/<skill-name>/SKILL.md` 구조를 따르므로 Codex `skill-installer`로 설치할 수 있다.

단일 스킬 설치:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --url https://github.com/<owner>/<repo>/tree/main/skills/apps-in-toss-request-validator
```

전체 팩 설치:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo <owner>/<repo> \
  --path skills/apps-in-toss-project-intake-router \
         skills/apps-in-toss-request-validator \
         skills/apps-in-toss-review-risk-checker \
         skills/apps-in-toss-feature-prereq-mapper \
         skills/apps-in-toss-backend-scope-slicer \
         skills/apps-in-toss-manual-test-scribe \
         skills/apps-in-toss-release-readiness-checker
```

중요:

- bare GitHub repo URL만으로는 전체 스킬 팩이 설치되지 않는다.
- `skill-installer`는 `--repo`를 쓰면 `--path`가 필요하고, `--url`을 쓰면 `tree/<ref>/<path>`가 포함된 GitHub URL이 필요하다.
- 즉, 설치 단위는 repo 전체가 아니라 `SKILL.md`가 있는 개별 skill directory 다.

## Repository Layout

```text
skills/
  apps-in-toss-project-intake-router/
    SKILL.md
  apps-in-toss-request-validator/
    SKILL.md
  apps-in-toss-review-risk-checker/
    SKILL.md
  apps-in-toss-feature-prereq-mapper/
    SKILL.md
  apps-in-toss-backend-scope-slicer/
    SKILL.md
  apps-in-toss-manual-test-scribe/
    SKILL.md
  apps-in-toss-release-readiness-checker/
    SKILL.md
  README.md
```
