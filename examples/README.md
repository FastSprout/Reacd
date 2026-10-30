# Runnable TSX applications

These examples use @fastsprout/reacd, isolated Jotai stores and the shadcn adapter.
Application code declares components without native HTML, CSS or styling props.

From the repository root, run npm ci once, then choose one command:

- [Counter](counter): npm run example -- --mode counter
- [Contact form](form): npm run example -- --mode form
- [Dashboard](dashboard): npm run example -- --mode dashboard

Open http://127.0.0.1:5173/. Stop the server before selecting another example. Each
folder has App.tsx, a browser main.tsx entry and colocated interaction tests. Every App
owns its ReacdProvider, so simultaneous applications keep separate stores. Reloading
resets the local sample data; these examples do not contact a backend.

The browser-only @fastsprout/reacd/bootstrap entry supplies rendering and styles. Vite
selects a literal example entry through a shared trusted renderer HTML host. There is no
application-owned HTML template or CSS file to copy or customize.

Optional generative transport snapshots live in test-support/fixtures/generative. Their
generated JSON is checked by npm run fixtures:check.

See the [getting started guide](../docs/getting-started.md) for component setup and
[public component references](../docs/components/index.md) for individual controls.
