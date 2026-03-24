# Apps in Toss RN Setup

## Fixed Decisions

- Framework: React Native
- Runtime base: Granite
- SDK line: Apps in Toss SDK 2.x
- Packaging target: `.ait`
- Release path: Apps in Toss Console

## Local Environment

1. `npm install`
2. Initialize the harness:

```bash
npm run bootstrap -- \
  --app-name my-miniapp \
  --display-name "내 앱" \
  --primary-color "#3182F6" \
  --api-base-url "https://api.example.com"
```

3. Run `npm run doctor`
4. Run `npm run dev`
5. Before build or upload, run `npm run doctor:release`

If `.env` already exists, re-run bootstrap with `--force` to overwrite it.

## Required Values To Confirm

- `AITO_APP_NAME`
  - Must exactly match the app name registered in the Apps in Toss console.
  - This value also changes the CORS origins.
- `AITO_DISPLAY_NAME`
  - Korean display name exposed in the navigation bar.
- `AITO_PRIMARY_COLOR`
  - Brand primary color.
- `AITO_ICON_URL`
  - Console-uploaded icon URL. Empty string is acceptable during early local testing.
- `AITO_WORKSPACE_NAME`
  - Needed if you want stable CLI deploy flows with workspace-aware token registration.
- `AITO_DEPLOY_API_KEY`
  - Needed for `ait deploy` unless you register a token separately.
- `AITO_API_BASE_URL`
  - Backend base URL if this app talks to your server.

Bootstrap writes those values into `.env` and keeps deploy credentials empty on purpose.

## CORS

Official live/test origins depend on `appName`.

- Live: `https://<appName>.apps.tossmini.com`
- QR test: `https://<appName>.private-apps.tossmini.com`

This repo can print them with:

```bash
npm run cors:print
```

If your backend is Node-based, you can also reuse:

```text
ops/cors/apps-in-toss-origins.mjs
```

Current default values from `.env.example` expand to:

- Live: `https://app-in-toss-by-gh.apps.tossmini.com`
- QR test: `https://app-in-toss-by-gh.private-apps.tossmini.com`

## Sandbox And Device Testing

- Daily development and QA should use the Apps in Toss sandbox app.
- iOS real-device testing requires:
  - same Wi-Fi as the local dev machine
  - local network permission allowed in the sandbox app
- Android requires `adb reverse` for ports `8081` and `5173`.

## Build, Upload, And Console Release

```bash
npm run build
npm run upload:test
```

- `npm run build` produces the `.ait` bundle.
- `npm run upload:test` wraps `ait deploy` for the official CI/CD test upload flow.
- Final review and release still happen in the Apps in Toss console.
- The harness intentionally does not auto-request review or auto-release.

## GitHub CI / Docs Freshness

- `npm run verify`
  - Repo-safe CI gate
- `npm run docs:check`
  - Compares tracked official docs against the last local snapshot
- `npm run docs:sync`
  - Refreshes local raw snapshots under `docs/toss/official-snapshots`
  - Raw markdown snapshots are for local/CI use and should not be committed to the public repo
- `npm test`
  - Includes harness smoke tests plus RN starter screen smoke tests

## mTLS

Official docs require mTLS for server-to-server Apps in Toss APIs, including:

- Toss Login
- TossPay
- In-App Purchase
- Push / Smart Message
- Promotion

If the app will use any of those, you need to issue and store:

- partner mTLS certificate
- partner mTLS private key

These are issued in the Apps in Toss console, not in this repo.
