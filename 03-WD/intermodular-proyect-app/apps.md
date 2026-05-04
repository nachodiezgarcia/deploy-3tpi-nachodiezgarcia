# Intermodular Project

Academia online: portal de cursos con frontend SSR, API Hono, y base de datos MongoDB.

## Stack

- **Monorepo**: npm workspaces + Turborepo
- **Frontend**: React 19, Vite 8, TanStack Start (SSR), TanStack Router
- **Backend**: Hono + @hono/node-server, tsx (dev), tsc-alias (prod)
- **Console**: Node.js scripts runner (placeholder, Phase 2+)
- **Database**: MongoDB (`intermodular`) — Phase 2+
- **HCMS**: Content Island (`proyecto_Integrado`) — Phase 2+
- **Auth**: JWT + refresh token — Phase 2+

## Run Commands

- `npm start` / `npm run dev` — starts api (port 4000) + web (port 3000) in parallel
- `npm run build` — turbo build all apps
- `npm run check-types` — TypeScript check all apps
- `npm run lint` — Oxlint entire repo
- `npm run format` — Prettier format entire repo

## Architecture Blueprints

Static reference docs in `.claude/blueprints/`. Load the relevant ones based on the task:

| Task                 | Load blueprints                                                         |
| -------------------- | ----------------------------------------------------------------------- |
| Any code task        | `coding-conventions.md` (always)                                        |
| Frontend work        | `spa-architecture.md` + `coding-conventions.md`                         |
| Backend work         | `backend-architecture.md` + `coding-conventions.md`                     |
| Monorepo structure   | `monorepo-architecture.md` + `coding-conventions.md`                    |
| SSR (TanStack Start) | `ssr-architecture.md` + `spa-architecture.md` + `coding-conventions.md` |

## Key Conventions

- **ES2024** target, **Node 22**
- **`#*` imports** (Node.js subpath imports) — `"#pods/hello"`, not `"@/pods/hello"`
- **Scope**: `@intermodular/` for all internal packages
- **Oxlint** for linting, **Prettier** for formatting
- Functional style (closures, factories — no classes)
- File naming: `<name>.<type>.ts(x)` (singular)
- Barrels (`index.ts`) in each folder
- **`verbatimModuleSyntax: false`** in `apps/web` tsconfig (TanStack Start requirement)
- API runs on port 4000, web on port 3000
- Web proxies `/api/*` → `http://localhost:4000`
