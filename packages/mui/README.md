# reacd Material UI adapter

A complete Material UI adapter for the reacd component catalog.

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

The JavaScript entry supports synchronous SSR without importing browser styles. Material
UI and Emotion own presentation; shared headless behavior implements reacd's controlled
forms, portals and composite interactions. Application code uses reacd components and
semantic properties, with no HTML or styling escapes.

Requires Node.js 22.12 or newer and the matching reacd release. React and Jotai peers
are declared in package metadata. Licensed under Apache-2.0.
