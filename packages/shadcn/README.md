# reacd shadcn adapter

The complete shadcn theme adapter for the headless reacd engine.

```sh
npm install @fastsprout/reacd @fastsprout/reacd-shadcn
```

```tsx
import '@fastsprout/reacd-shadcn/styles';
import { ReacdProvider, Text } from '@fastsprout/reacd';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';

export function Application() {
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <Text>Explicit adapter selection</Text>
    </ReacdProvider>
  );
}
```

The main adapter export supports Node SSR without importing styles. Load the
browser styles entry in your client application. Token templates customize this
adapter's appearance; they are not different adapters. MUI is planned.

Requires the matching reacd version and its declared React/Jotai peers.
Licensed under Apache-2.0; upstream shadcn attribution is in
THIRD_PARTY_NOTICES.md. Local build artifacts are not an npm publication claim.
