# reacd

**Declarative React UI with closed component contracts.**

[![Release workflow][ci]][status] [![npm version][version-badge]][package]
[![Apache-2.0 license][license-badge]][license]

Compose application views in TSX. The renderer and theme adapter handle HTML, styles and
responsive layout; Jotai connects application state. The first adapter uses shadcn/ui.
Templates change appearance without changing the view declaration.

[Documentation][docs] · [Get started][start] · [Components][components] · [Theme
adapters][adapters] · [State][state] · [Changelog][changelog] ·
[Contributing][contributing] · [Security][security]

## Install

This setup targets the [unreleased 0.2.0 package split][changelog]. The separate adapter
is not published yet; npm version 0.1.0 bundles its adapter.

Install `@fastsprout/reacd` into an existing React application:

```sh
npm install @fastsprout/reacd @fastsprout/reacd-shadcn
```

Use Node.js 26 or newer for the toolchain. The [getting started guide][start] covers
TypeScript's JSX configuration, the provider and browser adapter styles.

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

Select `shadcnAdapter` from `@fastsprout/reacd-shadcn` at your `ReacdProvider` root.
This is the [runnable Toggle example][example]. Optional [generative UI][generative]
binds components to typed state with explicit read or read/write access.

## License

[Apache-2.0][license]. Vendored licenses are in [third-party notices][notices].

[ci]: https://github.com/FastSprout/Reacd/actions/workflows/release.yml/badge.svg
[status]: https://github.com/FastSprout/Reacd/actions/workflows/release.yml
[version-badge]: https://img.shields.io/npm/v/@fastsprout/reacd
[package]: https://www.npmjs.com/package/@fastsprout/reacd
[license-badge]: https://img.shields.io/badge/license-Apache--2.0-blue
[license]: https://github.com/FastSprout/Reacd/blob/main/LICENSE
[notices]: https://github.com/FastSprout/Reacd/blob/main/THIRD_PARTY_NOTICES.md
[docs]: https://github.com/FastSprout/Reacd/blob/main/docs/index.md
[start]: https://github.com/FastSprout/Reacd/blob/main/docs/getting-started.md
[components]: https://github.com/FastSprout/Reacd/blob/main/docs/components/index.md
[adapters]: https://github.com/FastSprout/Reacd/blob/main/docs/guides/theme-adapters.md
[state]: https://github.com/FastSprout/Reacd/blob/main/docs/guides/state.md
[changelog]: https://github.com/FastSprout/Reacd/blob/main/docs/changelog.md
[contributing]: https://github.com/FastSprout/Reacd/blob/main/CONTRIBUTING.md
[example]: https://github.com/FastSprout/Reacd/blob/main/docs/examples/toggle.tsx
[generative]: https://github.com/FastSprout/Reacd/blob/main/docs/guides/generative-ui.md
[security]: https://github.com/FastSprout/Reacd/blob/main/SECURITY.md
