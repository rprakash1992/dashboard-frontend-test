# VCollab Enterprise Dashboard — Frontend

React + TypeScript application built with [Vite](https://vite.dev/).

## Prerequisites

- Node.js (v18 or later recommended)
- npm

---

## Installation

```bash
cd frontend
npm install
```

> If you run into peer dependency conflicts, use `npm install --force`.

---

## Development

### Local dev server

```bash
npm run dev
```

Starts the Vite dev server at [http://localhost:5173](http://localhost:5173) with Hot Module Replacement (HMR).
The server binds to `0.0.0.0`, so it is accessible from other devices on the same network.

### Dev server inside Docker

Use `Dockerfile_dev` to run the dev server in a container (uses file-system polling for HMR to work on mounted volumes):

```bash
docker build -f Dockerfile_dev -t vcollab-frontend-dev .
docker run -p 5173:5173 vcollab-frontend-dev
```

The `start-watch` script (`CHOKIDAR_USEPOLLING=true vite --host 0.0.0.0`) is used as the container entrypoint so HMR works correctly with Docker volume mounts.

---

## Production Build

### 1. Build static assets

```bash
npm run build
```

Runs TypeScript type-check (`tsc -b`) followed by `vite build`. Output is written to the `dist/` folder.

### 2. Preview the production build locally

```bash
npm run preview
```

Serves the `dist/` folder locally to verify the build before deploying.

### 3. Serve with nginx (Docker)

The `Dockerfile` serves the pre-built static assets with nginx on port 80:

```bash
# Build static assets first
npm run build

# Copy dist to build/ or adjust the Dockerfile COPY path as needed
docker build -f Dockerfile -t vcollab-frontend .
docker run -p 80:80 vcollab-frontend
```

nginx configuration is at [config/nginx.conf](config/nginx.conf).

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start local dev server with HMR |
| `start-watch` | `vite --host 0.0.0.0` with polling | Dev server for Docker / mounted volumes |
| `build` | `tsc -b && vite build` | Type-check and build for production |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint across all source files |

---

## Key Dependencies

| Package | Purpose |
|---|---|
| React 19 + React DOM | UI framework |
| React Router 7 | Client-side routing |
| Mantine 7 | Component library and hooks |
| Zustand | Global state management |
| React Plotly.js | Charts and visualizations |
| FlexLayout React | Dockable panel layout |
| JSON Forms (MUI renderers) | Schema-driven forms |

---

## Project Structure

```
frontend/
├── src/               # Application source code
├── public/            # Static assets copied as-is to dist
├── config/            # nginx config for production Docker image
├── dist/              # Production build output (git-ignored)
├── Dockerfile         # Production image (nginx)
├── Dockerfile_dev     # Development image (Vite dev server)
├── vite.config.ts     # Vite configuration
├── tsconfig.app.json  # TypeScript config for app code
└── tsconfig.node.json # TypeScript config for Vite/Node tooling
```

---

## Environment Variables

Vite exposes env variables prefixed with `VITE_` to the client bundle.
Create a `.env.local` file (git-ignored) for local overrides:

```
VITE_API_BASE_URL=http://localhost:8000
```

See the [Vite env docs](https://vite.dev/guide/env-and-mode) for details.
