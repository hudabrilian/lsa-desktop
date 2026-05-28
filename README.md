<div align="center">
  <br />
  <h1>Lot Sizing Application (LSA)</h1>
  <p>
    <strong>A cross-platform desktop application for Material Requirement Planning (MRP)
    <br />
    lot sizing analysis and optimization.</strong>
  </p>
  <p>
    <a href="https://github.com/hudabrilian/lsa-desktop/releases"><img src="https://img.shields.io/github/v/release/hudabrilian/lsa-desktop?style=flat-square" alt="Release"></a>
    <img src="https://img.shields.io/github/workflow/status/hudabrilian/lsa-desktop/Release?style=flat-square" alt="CI">
    <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=flat-square" alt="Platform">
    <img src="https://img.shields.io/github/license/hudabrilian/lsa-desktop?style=flat-square" alt="License">
  </p>
  <br />
</div>

## Overview

**Lot Sizing Application (LSA)** is a desktop application developed to assist in determining the most efficient lot size for material orders in the context of **Material Requirement Planning (MRP)**. It supports various lot sizing methods commonly used in manufacturing and production planning, enabling practitioners and students to compare, analyze, and optimize order quantities.

## Features

- **Product Management** — Create and manage products with multi-level Bill of Materials (BOM) and part data.
- **Master Production Schedule (MPS)** — Define production schedules for finished goods.
- **Inventory Management** — Track on-hand inventory, scheduled receipts, and lead times for each part.
- **Lot Sizing Methods** — Supports 9 industry-standard lot sizing techniques:

  | Method  | Description               |
  | ------- | ------------------------- |
  | **LFL** | Lot-for-Lot               |
  | **EOQ** | Economic Order Quantity   |
  | **POQ** | Periodic Order Quantity   |
  | **LTC** | Least Total Cost          |
  | **LUC** | Least Unit Cost           |
  | **PPB** | Part Period Balancing     |
  | **WWA** | Wagner-Whitin Algorithm   |
  | **FPR** | Fixed Period Requirements |
  | **FOQ** | Fixed Order Quantity      |

- **Cost Comparison** — Compare total cost across all lot sizing methods side by side.
- **Graphical Visualization** — View cost trends and inventory movements through interactive charts (Recharts).
- **Material Explosion** — Automatically explode dependent demand from MPS through the BOM tree.
- **Planned Order Report (POR)** — Generate detailed planned order reports for each part.
- **Auto-Updater** — Automatic update delivery via GitHub Releases (check on startup, user-initiated install).

## Tech Stack

| Layer                 | Technology                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **Desktop Shell**     | [Electron 42](https://www.electronjs.org/) + [electron-vite 5](https://electron-vite.org/) |
| **UI Framework**      | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/)         |
| **Component Library** | [Mantine UI v9](https://mantine.dev/)                                                      |
| **Routing**           | [react-router-dom v7](https://reactrouter.com/) (Hash Router)                              |
| **State Management**  | [Zustand](https://github.com/pmndrs/zustand)                                               |
| **Charts**            | [Recharts](https://recharts.org/)                                                          |
| **Icons**             | [Lucide React](https://lucide.dev/)                                                        |
| **Calculations**      | [mathjs](https://mathjs.org/)                                                              |
| **Packaging**         | [electron-builder](https://www.electron.build/)                                            |

## Prerequisites

- **Node.js** >= 20
- **pnpm** 9.12.3 (pinned — do not use npm or yarn)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/hudabrilian/lsa-desktop.git
cd lsa-desktop

# Install dependencies
pnpm install

# Start development server with HMR
pnpm dev
```

## Available Commands

| Command            | Action                                     |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start dev server with HMR                  |
| `pnpm build`       | Typecheck + build for production           |
| `pnpm start`       | Preview built app                          |
| `pnpm lint`        | Run ESLint (auto-fix)                      |
| `pnpm format`      | Format code with Prettier                  |
| `pnpm typecheck`   | Run TypeScript type checking               |
| `pnpm build:mac`   | Package for macOS (.dmg)                   |
| `pnpm build:win`   | Package for Windows (.exe)                 |
| `pnpm build:linux` | Package for Linux (.AppImage, .snap, .deb) |
| `pnpm deploy`      | Build + publish all platforms              |

## Project Structure

```
lsa-desktop/
├── src/
│   ├── main/                # Electron main process
│   │   ├── index.ts         # App entry, window creation, IPC bootstrap
│   │   ├── mainWindow.ts    # 1280x720 window (hides on macOS close)
│   │   ├── database.ts      # IPC handler registration for product CRUD
│   │   ├── handlers/        # File-based product persistence
│   │   └── auto-updater.ts  # GitHub Releases auto-update
│   ├── preload/             # Context bridge (window.api, window.electron)
│   └── renderer/src/        # React application
│       ├── App.tsx          # Hash router setup
│       ├── pages/           # Route pages (Home, About, Guide, History, product/)
│       ├── components/      # Shared UI components
│       ├── layouts/         # AppLayout, ProductLayout, ProductDetailLayout
│       ├── context/         # ProductContext (React context)
│       ├── utils/           # MRP / lot-sizing calculation logic
│       └── types/           # Renderer-side type definitions
├── build/                   # Build resources
├── resources/               # Static assets bundled with the app
├── electron-builder.yml     # Packaging configuration
└── electron.vite.config.ts  # Vite + Electron configuration
```

## Architecture

LSA follows the **three-process Electron** architecture:

- **Main Process** (`src/main/`) — Manages the window lifecycle, registers IPC handlers for CRUD operations, and orchestrates auto-updates.
- **Preload** (`src/preload/`) — Exposes a secure API bridge (`window.api`) to the renderer for product management and system information.
- **Renderer** (`src/renderer/src/`) — A React SPA using hash-based routing with Mantine UI for the interface and Zustand for client-side state.

Data is persisted to the local filesystem via the main process handlers. The application calculates MRP tables using 9 different lot sizing algorithms implemented in `src/renderer/src/utils/mrp.ts`.

## Downloads

Pre-built binaries are available for all major platforms on the [Releases page](https://github.com/hudabrilian/lsa-desktop/releases).

## Development

- **VSCode** — Recommended. Install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions.
- **husky** + **lint-staged** — Automatically runs `format → lint → typecheck` on staged files before every commit.
- **Debugging** — Pre-configured launch configurations in `.vscode/launch.json` (Debug All launches main + renderer).

> [!WARNING]
> This application is currently in development. If you encounter any issues, please [open an issue](https://github.com/hudabrilian/lsa-desktop/issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.
