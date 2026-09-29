# Shonen Siege

Shonen Siege is a local-save anime-inspired tower defense game where players collect fighters, build a squad, summon new cards, and survive infinite waves.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/shonen-siege run dev` — run the playable web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/shonen-siege/src/App.tsx` — routed game shell, collection, summoning, and wave-defense gameplay
- `artifacts/shonen-siege/src/game-data.ts` — character roster, rarity metadata, save model, and game defaults
- `artifacts/shonen-siege/src/index.css` — command-deck visual system and responsive layout

## Architecture decisions

- The first version is frontend-only and persists progression in `localStorage`, so the game is immediately playable without account setup or a backend.
- The app uses Wouter routes for the four game surfaces and keeps save state at the shell level so navigation never loses progression.
- Combat is a lightweight interval-driven simulation: players place units on the field, call waves, and upgrade selected units while enemies advance toward the core.

## Product

- Command deck with best-wave, gem, and active-squad summaries
- Collection archive with rarity filters and squad selection
- Five-card summon packs with persistent rarity pity counters
- Infinite run with deployable units, wave progression, enemy health, cash rewards, upgrades, reset, and recovery gems

## User preferences

No additional preferences recorded.

## Gotchas

- Progression is browser-local by design; clearing site storage resets the archive.
- The shared API and mockup workflows are unrelated starter services; the game itself runs from the `shonen-siege` web workflow.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
