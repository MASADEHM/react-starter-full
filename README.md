# react-antd-starter

React 18 · TypeScript (strict) · Vite 5 · Ant Design 5 · TanStack Query 5 · React Router 6 · axios · zustand · vitest.

A starter you can clone and ship from the first day: sign-in, a role-guarded shell with a responsive navy rail, a dashboard, and a complete CRUD screen (list, search, status filter, drawer form in the URL, CSV export). It runs against a built-in mock API until you point it at a real one.

## Run

```bash
npm install
npm run dev          # http://localhost:3000 with the mock API
```

Sign in as `admin@example.com` or `user@example.com`, password `password`. The admin sees Users; the user does not, and `/users` refuses them.

Point it at a backend by setting `VITE_API_URL` in `.env` (copy `.env.example`). The mock is then not loaded.

## Scripts

| script | does |
| --- | --- |
| `npm run dev` | Vite dev server, mock API when `VITE_API_URL` is unset |
| `npm run build` | typecheck, then production build to `dist/` |
| `npm run preview` | serve `dist/` |
| `npm run lint` | ESLint, type-aware, with the layering rules |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | vitest, unit tests under `src/**/*.test.ts` |
| `npm run check` | lint + typecheck + test |

CI (`.github/workflows/ci.yml`) runs `check` and `build` on every push and pull request.

## Structure

See [ARCHITECTURE.md](ARCHITECTURE.md). In one line: `features/` sit on `shared/`, which sits on `core/`, which sits on `utils`, `config`, `constants` and `types`; a feature never imports another feature, and ESLint fails the build if it does.

## The mock API

`mock/api.ts` is a Vite plugin that answers `/api/*` from an in-memory list while `vite dev` runs. It is Node code, never bundled, never in production. Its response shapes are the contract the client services expect; when you connect a real API, match those shapes or change both sides. Endpoints: `POST /auth/login`, `GET /auth/me`, `GET /dashboard/summary`, `GET|POST /users`, `GET|PUT|DELETE /users/:id`. Everything but login requires the bearer token login returns.

## Configuration

| variable | default | purpose |
| --- | --- | --- |
| `VITE_API_URL` | unset → `/api` | API origin; unset enables the mock in dev |
| `VITE_APP_NAME` | `Starter` | brand in the rail and sign-in |
| `VITE_APP_TAGLINE` | empty | line under the brand |

All reads go through `src/config/env.ts`.

## Theme

`src/core/theme/theme.ts` holds the palette and the antd token overrides; `src/styles/variables.css` mirrors the same colours for custom CSS. Change a colour in both. The typeface is Archivo, loaded from Google Fonts in `index.html`; its width axis gives the display headings their look (`.display`).

## Deploying

`public/staticwebapp.config.json` is ready for Azure Static Web Apps (SPA fallback, immutable asset caching). Any static host works: build, serve `dist/`, rewrite unknown paths to `index.html`.

## Deliberately not included

- Dark mode, i18n and RTL. `ConfigProvider` in `App.tsx` is where they plug in.
- Refresh tokens. The interceptor signs out on 401; add a refresh flow there when the API has one.
- E2E tests. Unit tests cover pure utilities; add Playwright when there is a flow worth protecting.
- A charting library. `BarList` draws bars with CSS; add `@ant-design/plots` when a chart needs axes.
