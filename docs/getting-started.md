# Get started

reacd applications use React, TypeScript, TSX component declarations, and Jotai for
application state. Native rendering and styling belong to the framework host and the
selected adapter. Import UI components from reacd and compose them in your own views.
Direct UI SDKs and styling utilities belong to the adapter, including Radix, Base UI,
React Aria, TipTap, DayPicker, icon SDKs and class-name styling utilities. Named React
hooks/types, Jotai, validation/date utilities and your own business modules remain
available.

## Work from the local checkout

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/` to review the local application.

Catalog families and the generative playground load when first selected. A loading
placeholder leaves navigation and appearance controls available. Field values and
generative edits survive switching views within the same workspace. If a view fails to
load, other views remain available. The explicit reload link starts a fresh workspace
and clears unsaved local changes.

The package is currently developed locally. The commands above do not publish a package,
deploy a site, or change a domain.

## Declare a view

```tsx
import { atom, useAtom } from 'jotai';
import { Button, Card, Input, Text, VStack } from 'reacd';

const nameAtom = atom('');

export function Profile() {
  const [name, setName] = useAtom(nameAtom);

  return (
    <Card>
      <VStack spacing="medium">
        <Text role="subheadline">Profile</Text>
        <Input label="Name" value={name} onValueChange={setName} />
        <Button label="Clear name" onPress={() => setName('')} />
      </VStack>
    </Card>
  );
}
```

Render views inside the application's configured provider. The provider selects the
adapter and template; a Jotai provider owns the application's store.

## Continue

The full local check requires Chromium and Python 3.13 documentation tools:

```sh
npx playwright install chromium
python3 -m venv .venv-docs
.venv-docs/bin/python -m pip install -r requirements-docs.txt
npm run check
```

This includes strict typing, coverage, built-package acceptance, browser conformance,
and the strict documentation build. Use `npm run docs:check` to build documentation
independently. Checks generate local artifacts and never deploy the site.

The production build also validates its generated bundle manifest. JavaScript chunks
must remain within the configured byte budget, and deferred views must stay outside the
static entry graph. The public library's synchronous SSR API is unchanged.

- [Component catalog](components/index.md)
- [Theme adapters](guides/theme-adapters.md)
- [State with Jotai](guides/state.md)
- [Generative UI](guides/generative-ui.md)

Each component reference embeds its runnable TSX example. Its source block includes the
same file used by the preview. Examples use isolated Jotai stores and the shadcn theme
adapter. Open the example link to work in a separate tab; editing one preview does not
change another. Reloading an example resets its unsaved state.

`npm run docs:check` compiles the preview assets, builds strict MkDocs output and checks
all component references. Serve the generated site locally with
`.venv-docs/bin/python -m http.server 8000 --bind 127.0.0.1 -d site`. Run the
documentation build before invoking `npm run test:browser` independently. The complete
`npm run check` command keeps that order automatically.
