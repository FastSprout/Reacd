# reacd Material UI adapter

The native Material UI adapter for supported reacd components. Current catalog
coverage is partial. A missing mapping or unsupported SDK variant throws
`UnsupportedAdapterComponentError` with the adapter and component names. See
[adapter availability](https://reacd.dev/components/#adapter-availability).

```sh
npm install @fastsprout/reacd @fastsprout/reacd-mui
```

```tsx
import '@fastsprout/reacd-mui/styles';
import { ReacdProvider, Text } from '@fastsprout/reacd';
import { muiAdapter } from '@fastsprout/reacd-mui';

export function Application() {
  return (
    <ReacdProvider adapter={muiAdapter}>
      <Text>Material UI with closed component contracts</Text>
    </ReacdProvider>
  );
}
```

The JavaScript entry supports synchronous SSR without importing browser styles.
Material UI owns controls, accessibility, interactions, animations and portals;
Emotion supplies styling. Adapter-owned SDK compositions implement supported reacd
declarations. Application code uses reacd components and semantic properties, with
no HTML or styling escapes.

Requires Node.js 22.12 or newer and the matching reacd release. React and Jotai peers
are declared in package metadata. Licensed under Apache-2.0.
