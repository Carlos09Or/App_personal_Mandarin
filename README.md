# Mandarin Journey · HSK 1 (personal study copy)

Personal copy of the Mandarin Journey app for my own study. Differences from the public app:

- Everything is open: no locked provinces, no fog, no grey doors.
- The whole course (the 300 words of the HSK 1 list in `New-HSK-Vocabulary-Level-1.pdf`) is walked through **Panama**:
  **20 doors of 15 words each** (door art rotates through the six Panama doors), then the canal checkpoint.
  Voice clips for all 300 words and sentences are in `app/public/audio`.
- Static hosting only (`app/wrangler.jsonc`, project `mandarin-personal`): no Worker, no database, no accounts.
  Progress lives on the device; use Profile → Download my data to back it up.

Deploy on Cloudflare: Workers & Pages → Create → connect this GitHub repo, root directory `app`,
build command `npm install && npm run build`, deploy command `npx wrangler deploy`.

---

# Mandarin Journey · HSK 1

Free HSK 1 Mandarin course for Spanish speakers, built as an installable web app (PWA). The learner travels
through Panama: each unit is a province on an illustrated map, each lesson a door, and every learned word
becomes a spaced-repetition review card. A day and night version of the map, doors and lessons follows the learner's light.

The app lives in [`app/`](app/README.md) (React 19 + TypeScript + Vite). Its README covers the learning model,
the stack, local development, voice audio and deployment.

## Repository layout

- `app/` — the app: source in `app/src`, static files (artwork, audio, stroke data) in `app/public`.
- `design/` — art direction and working material that is not shipped: image briefs and prompts, source
  artwork (`design/assets`), references, previews, and the Panama pilot plan (`design/PANAMA-PILOT.md`).
  `design/respaldo-descargas/` is a local backup of Downloads and is ignored by git.
- `tools/` — scripts that prepare artwork, fonts and audio for the app (map and boat cutting, font subsetting,
  audio manifest and text-to-speech notebooks).
- `.github/workflows/ci.yml` — on every pull request: build, lint, `npm audit`, the progress-validator tests and a check that
  the build keeps its security headers. `.github/dependabot.yml` asks for dependency updates weekly. The site itself is
  deployed by Cloudflare from `main` (see `app/README.md`).

## Develop

```bash
cd app
npm install
npm run dev
```

## Deploy

Pushing changes under `app/` to `main` triggers the workflow above. In the repository settings, set
**Pages → Source** to **GitHub Actions**.

The earlier static version of the app (cards, practice blocks, worksheets) is no longer part of this repository.
