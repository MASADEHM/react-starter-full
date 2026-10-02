# Architecture

**Pattern:** feature-based modular. Dependencies point downward only; nothing depends on screens.

## Project structure

```
mock/                          # Dev-only mock API served by Vite under /api (Node code, never bundled)
src/
├── features/                  # Self-contained feature modules
│   ├── auth/                  #   sign-in; writes the session held in core/auth
│   ├── dashboard/             #   example read-only screen: KPIs + a chart
│   └── users/                 #   example CRUD screen: list, search, filter, drawer form, export
│       ├── components/        #   feature-specific UI
│       ├── pages/             #   screens, one per route
│       ├── services/          #   API calls (class singleton, apiCall wrapper)
│       ├── hooks/             #   TanStack Query hooks over the service
│       ├── types/             #   feature DTOs
│       └── index.ts           #   public API — the router imports nothing deeper
│
├── shared/                    # Reusable across features
│   ├── components/layout/     #   AppLayout, SideNav, TopBar, ErrorBoundary
│   ├── components/ui/         #   PageHeader, DataTable, FormDrawer, StatusTag, KpiRow, BarList, FilterChips, EmptyState
│   ├── guards/                #   RequireAuth, RequireRole
│   ├── hooks/                 #   useSearchParam
│   └── index.ts
│
├── core/                      # Infrastructure
│   ├── api/                   #   axios instance, interceptors (bearer token, 401), apiCall, apiMessage
│   ├── auth/                  #   session store (zustand, persisted): user + access token
│   ├── query/                 #   QueryClient, query key factory
│   └── theme/                 #   palette + antd ThemeConfig
│
├── config/                    # env.ts, routes.ts, navigation.ts
├── constants/                 # roles.ts, statuses.ts, api-endpoints.ts
├── utils/                     # formatters, status vocabulary, exportCsv (+ tests)
├── types/                     # global types (User, Paginated, Id)
├── pages/                     # root-level pages (NotFound)
├── styles/                    # variables.css, main.css
├── routes/router.tsx          # route table; lazy chunk per feature
├── App.tsx                    # providers
└── index.tsx                  # entry
```

## Layers and the import rule

```
application  (routes/, pages/, App.tsx)
     │
     ├── features/   ──┐
     │                 ├──▶ shared/
     │                 │        │
     └─────────────────┴────────┴──▶ core/ ──▶ utils/ config/ constants/ types/
```

- Features import from `@/shared`, `@/core`, `@/utils`, `@/config`, `@/constants`, `@/types`.
- Shared imports from core and below. Core imports from utils, config, constants, types.
- **A feature never imports another feature.** Inside a feature use relative imports.
- Lower layers never import upper layers.

These rules are enforced by ESLint (`no-restricted-imports` blocks in `eslint.config.js`). `npm run lint` fails on a violation.

## Patterns

**Service** — one class per feature, exported as a singleton, every call through `apiCall`:

```ts
class UsersService {
  list = (search: string): Promise<Paginated<User>> =>
    apiCall(() => axiosInstance.get<Paginated<User>>(API.USERS.ROOT, { params: { search } }));
}
export const usersService = new UsersService();
```

**Hook** — TanStack Query over the service, keys from `core/query/query-keys.ts`, writes invalidate the parent key:

```ts
export const useUsers = (search: string) =>
  useQuery({ queryKey: queryKeys.users.list(search), queryFn: () => usersService.list(search) });
```

**Page** — reads hooks, composes shared UI. Record drawers live in the URL (`/users/new`, `/users/:id`) so they are linkable and the back button closes them.

**Session** — `core/auth/session.store.ts` holds `user` and `accessToken`. The axios request interceptor reads the token per request; a 401 clears the session and redirects to sign-in. Guards and the side rail read the same store, so a hidden menu item and a typed URL cannot disagree. Role checks are a UX gate; the API is the authorisation boundary.

**Status vocabulary** — `utils/status.ts` maps status strings to one of three tones. `StatusTag` and `FilterChips` render from it, so a new status is one list entry, not a new component.

## Adding a feature

```bash
mkdir -p src/features/orders/{pages,components,services,hooks,types}
```

1. `types/orders.types.ts` — DTOs.
2. `services/orders.service.ts` — class singleton; add paths to `constants/api-endpoints.ts`.
3. `core/query/query-keys.ts` — add `orders: { all, list, detail }`.
4. `hooks/useOrders.ts` — queries and mutations.
5. `pages/OrdersPage.tsx` — compose `PageHeader`, `DataTable`, `FormDrawer`.
6. `index.ts` — export the page and hooks.
7. `config/routes.ts` and `routes/router.tsx` — add the route (lazy import from the feature index).
8. `config/navigation.ts` — add the rail entry, with `roles` if restricted.
9. If running on the mock, add handlers to `mock/api.ts`.

## Path alias

`@/*` → `src/*`. One alias is enough; the sub-aliases in older projects (`@/features/*`, …) are the same thing spelled longer.
