# Get started

Install `@fastsprout/reacd` into an existing browser React and TypeScript application.
Your React host owns mounting. Declare views with reacd components; the renderer and
selected adapter own native rendering, styles and responsive layout. Jotai owns state.

## Install

Use Node.js 22.12 or newer for the toolchain:

```sh
npm install @fastsprout/reacd @fastsprout/reacd-shadcn
```

Supported React, ReactDOM and Jotai versions are declared in the package peer
dependencies. npm installs missing peers automatically and checks an existing host
against that contract.

## Configure TSX

Set the following options in your application's TypeScript configuration:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@fastsprout/reacd"
  }
}
```

The custom JSX runtime checks closed component props. Import view components from
`@fastsprout/reacd`; native HTML, styling SDKs and CSS belong to the framework layers.
React hooks, Jotai, validation utilities and your business modules remain available.

## Add a browser view

This compiled and tested setup selects the separate shadcn adapter and imports its
browser-only styles entry. It does not mount an application. Render its exported
`InstallationExample` from your existing React host. Keep this module in the
browser/client part of your application.

```tsx
--8<-- "examples/installation.tsx"
```

`ReacdProvider` requires a complete explicit adapter and owns an isolated Jotai store.
The child reads its atom inside that provider. Separate provider roots keep independent
values even when the view declarations use the same atom definition.

The adapter styles entry is browser-only. Server code can import the engine and adapter
without importing styles. This setup documents a browser React integration; it does not
establish Next.js or React Server Components compatibility.

## Continue

- [Component catalog](components/index.md)
- [Theme adapters](guides/theme-adapters.md)
- [State with Jotai](guides/state.md)
- [Generative UI](guides/generative-ui.md)

Each component reference embeds its runnable TSX example and displays that same source.
Previews use isolated Jotai stores and the shadcn adapter. Open the example link to work
in a separate tab. Reloading an example resets its unsaved state.

Repository development, examples and local documentation builds are described in
[Contributing](https://github.com/FastSprout/Reacd/blob/main/CONTRIBUTING.md).
