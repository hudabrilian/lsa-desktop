# LSA Desktop — Agent Guide

## Stack

- **Electron 42** + **electron-vite 5** + **React 19** + **TypeScript 5.9**
- **Mantine UI v9** (core, charts, form, hooks, modals, notifications, nprogress)
- **react-router-dom v7** (hash router — `createHashRouter`)
- **zustand** (state), **mathjs** (calc), **recharts** (charts), **lucide-react** (icons)
- **postcss-preset-mantine** + postcss-simple-vars

## Package manager

**pnpm 9.12.3** (pinned). Never use npm/yarn. Install: `pnpm install`

## Key commands

| Command                                        | Action                                      |
| ---------------------------------------------- | ------------------------------------------- |
| `pnpm dev`                                     | Dev server + HMR                            |
| `pnpm build`                                   | Typecheck + electron-vite build             |
| `pnpm lint`                                    | ESLint (auto-fix)                           |
| `pnpm format`                                  | Prettier (write)                            |
| `pnpm format:check`                            | Prettier (check only)                       |
| `pnpm typecheck`                               | Runs `typecheck:node && typecheck:web`      |
| `pnpm start`                                   | Preview built app (`electron-vite preview`) |
| `pnpm build:mac` / `build:win` / `build:linux` | Package for platform                        |

## Required verification order

Run **`pnpm lint && pnpm typecheck`** before any commit — CI enforces both.
**husky + lint-staged** automatically runs these on every commit via `.husky/pre-commit`:
format → lint → typecheck on staged files.

## Architecture

Three-process electron-vite layout:

- `src/main/` — Electron main process (entry: `index.ts`)
- `src/preload/` — Context bridge exposing `window.api` (products CRUD, updates) and `window.electron`
- `src/renderer/src/` — React app

Renderer alias: `@renderer/*` → `src/renderer/src/*` (vite + tsconfig)

## Key source layout

```
src/main/
  index.ts          — App entry, window creation, IPC bootstrap
  mainWindow.ts     — 1280x720, hides on macOS close (doesn't quit)
  database.ts       — IPC handler registration for product CRUD
  handlers/product.ts — File-based product persistence
  auto-updater.ts   — GitHub releases auto-update (autoDownload: false)

src/renderer/src/
  main.tsx          — React entry
  App.tsx           — Hash router setup
  pages/            — Route pages (Home, About, Guide, History, product/)
  components/       — Shared UI components
  layouts/          — AppLayout, ProductLayout, ProductDetailLayout
  context/          — ProductContext (React context)
  utils/mrp.ts      — MRP / lot-sizing calculation logic
  types/index.d.ts  — Renderer-side types
```

## Conventions

- **Prettier**: singleQuote, noSemi, printWidth 100, no trailingComma
- **ESLint**: electron-toolkit TS + Prettier + React configs
- **Imports**: `@renderer/` path alias for renderer code
- **CSS**: Mantine component styles + plain CSS in `assets/main.css`
- **No tests** exist in the project

## Dev setup

- Node 20, pnpm 9
- `.npmrc` sets `shamefully-hoist=true` and electron mirror to npmmirror.com
- VSCode recommended: ESLint extension, Prettier as default formatter for TS/JS
- Debug configs in `.vscode/launch.json` (Debug All launches main + renderer)

## Build / release

- `out/` is build output (gitignored)
- `electron-builder.yml` publishes to GitHub releases
- Release CI triggers on tags `v*.*.*` (currently windows-only, single-arch)
- `pnpm deploy` = build + publish all platforms
