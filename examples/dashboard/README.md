# Orders dashboard

A sample-order table with a text filter, an open-orders switch and Clear filters. The
controls share local Jotai state. Filtering changes the rows and visible count without
replacing the application or requesting data from a server.

From the repository root:

```sh
npm ci
npm run example -- --mode dashboard
```

Open http://127.0.0.1:5173/. [App.tsx](App.tsx) declares the dashboard;
[main.tsx](main.tsx) mounts it through @fastsprout/reacd/bootstrap. The framework owns
host HTML, table rendering and styles.
