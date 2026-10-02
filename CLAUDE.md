# CLAUDE.md

React + TypeScript + Vite + Ant Design starter. Read `ARCHITECTURE.md` before adding code.

## Commands

- `npm run dev` — dev server on :3000 with the mock API (`mock/api.ts`) unless `VITE_API_URL` is set
- `npm run check` — lint + typecheck + unit tests; run before claiming anything is done
- `npm run build` — typecheck then build

## Rules that the tools enforce

- Layering: features → shared → core → utils/config/constants/types. A feature never imports another feature. ESLint fails on a violation; do not disable the rule, move the code down a layer.
- TypeScript is strict with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`. Spread optional props (`...(x ? { x } : {})`) rather than passing `undefined`.
- Type-only imports use `import type`. No `any`. Promises are awaited or marked `void`.

## Conventions

- One alias: `@/` → `src/`. Inside a feature, import its own files relatively.
- Services are class singletons using `apiCall` over the shared axios instance; hooks wrap them with TanStack Query; keys come from `core/query/query-keys.ts`.
- Routes in `config/routes.ts`, API paths in `constants/api-endpoints.ts`, rail entries in `config/navigation.ts`.
- Record drawers live in the URL (`/users/new`, `/users/:id`).
- Statuses are string-literal unions from `constants/`, rendered through `utils/status.ts` and `StatusTag`.
- Mock shapes in `mock/api.ts` are the API contract. Change a service and the mock together.
- Pure logic gets a vitest file beside it. UI is verified in the running app.
