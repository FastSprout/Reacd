# reacd

**Declarative React UI with closed component contracts.**

[![Release workflow][ci]][status] [![Version 0.1.0][version-badge]][release]
[![Apache-2.0 license][license-badge]](LICENSE)

Compose application views in TSX. The renderer and theme adapter handle HTML, styles and
responsive layout; Jotai connects application state. The first adapter uses shadcn/ui.
Templates change appearance without changing the view declaration.

[Documentation](docs/index.md) · [Get started](docs/getting-started.md) ·
[Components](docs/components/index.md) · [Runnable examples](examples) ·
[Theme adapters](docs/guides/theme-adapters.md) · [State](docs/guides/state.md) ·
[Changelog](docs/changelog.md) · [Contributing](CONTRIBUTING.md)

## Declare a view

```tsx
import { atom, useAtom } from 'jotai';
import { Text, Toggle, VStack } from '@fastsprout/reacd';

const enabledAtom = atom(false);

export function ToggleExample() {
  const [enabled, setEnabled] = useAtom(enabledAtom);
  return (
    <VStack>
      <Toggle label="Email summaries" checked={enabled} onCheckedChange={setEnabled} />
      <Text>{`Email summaries are ${enabled ? 'enabled' : 'disabled'}.`}</Text>
    </VStack>
  );
}
```

This is the [runnable Toggle example](docs/examples/toggle.tsx). Render views inside
`ReacdProvider` and set TypeScript's `jsxImportSource` to `@fastsprout/reacd`; the
[getting started guide](docs/getting-started.md) covers application setup.

Optional [generative UI](docs/guides/generative-ui.md) binds the same components to
explicit typed state with read or read/write access.

## Install

Requires Node.js 26 or newer and the tested React and Jotai peers:

```sh
npm install @fastsprout/reacd react@19.3.1 react-dom@19.3.1 jotai@3.0.1
```

## Run from source

Use Node.js 26 or newer and npm 11.19.0 for local development.

```sh
npm ci
npm run example -- --mode counter
npm run example -- --mode form
npm run example -- --mode dashboard
```

Choose one example command and open `http://127.0.0.1:5173/`. The `npm run dev` command
starts the counter example. Component references contain their own live previews.
Documentation links above point to repository files; reacd.dev is not deployed.

## License

[Apache-2.0](LICENSE). Vendored licenses are in
[third-party notices](THIRD_PARTY_NOTICES.md).

[ci]: https://github.com/FastSprout/Reacd/actions/workflows/release.yml/badge.svg
[status]: https://github.com/FastSprout/Reacd/actions/workflows/release.yml
[version-badge]: https://img.shields.io/badge/version-0.1.0-blue
[release]: package.json
[license-badge]: https://img.shields.io/badge/license-Apache--2.0-blue
