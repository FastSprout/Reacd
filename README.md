# reacd

High-level React UI with TSX declarations, closed component contracts, theme adapters,
and Jotai state. Application authors compose components; the trusted renderer and
adapter own HTML, CSS, responsive behavior, and native controls.

The integrated source catalog contains 150 public components, including the pinned
132-entry Nuxt UI inventory. The complete shadcn adapter implements that catalog.
All 132 inventory entries pass local combined acceptance. Independent Standards and
Spec reviews are closed; 2,783 tests and 1,042 production Chromium scenarios pass.
All 1,405 owned executable files have 100% coverage in all four metrics. Evidence:
[`specs/verification/combined-final.md`](specs/verification/combined-final.md).
The documentation includes 150 compiled, same-source live component previews.
This is local verification; the canonical domain has not been published or deployed.

## Declare a view

```tsx
import { atom, useAtom } from 'jotai';
import { Input, ReacdProvider, Text, VStack } from 'reacd';

const nameAtom = atom('');

function Profile() {
  const [name, setName] = useAtom(nameAtom);
  return (
    <VStack>
      <Text role="headline">Profile</Text>
      <Input label="Name" value={name} onValueChange={setName} />
      <Text>{name}</Text>
    </VStack>
  );
}

export function App() {
  return (
    <ReacdProvider>
      <Profile />
    </ReacdProvider>
  );
}
```

Configure application TypeScript with `jsxImportSource: "reacd"`. The JSX runtime
rejects native tags. Closed props reject `style`, `className`, unknown properties, and
raw browser events. Repository policy checks enforce application boundaries.

## Run locally

Node.js 26 or newer is required. TypeScript 7, React 19, Zod 4, and Jotai are used.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/` for the component catalog and generative playground. The
two token profiles change appearance while retaining application state. Examples use
local sample data; saving does not send anything to a server.

```sh
npm run check
```

The check runs strict typing, typed lint, schema and example freshness checks, per-file
coverage, builds, packed-consumer acceptance, Chromium conformance, and strict MkDocs.
Install Chromium with `npx playwright install chromium` and prepare the documentation
environment below before the first full check.

## Architecture

```text
core <- schema <- components <- renderer <- adapter <- state
```

Dependencies point left. Props belong to each component's module. Components, schemas,
adapters, and their tests are colocated by responsibility. No maintained file may exceed
300 lines or 88 characters per line; indentation is two spaces.

The first adapter uses shadcn/ui. Every adapter must implement the entire current reacd
component catalog; partial registries and renderer fallbacks are rejected. Design tokens
configure color, type, spacing, radii, and density independently from business views.
Native rendering remains private to the trusted layers.

## Generative UI and state

TSX is the primary authoring API. Optional JSON version `0.2` declares typed state
separately from its component tree. Each state has a unique key, initial value, kind,
and component permissions. Bindings specify `read` or `readWrite` access. Several
editors and displays can share a key reactively.

DataTable binds rows, selection, sorting, filters, and pagination independently. Its
controller validates compound transitions atomically. Sorting or filtering resets the
page; data refresh prunes missing selections and clamps pagination. Invalid proposals
leave state unchanged. Host actions can refresh read-only data.

Use `reacd/generative` for `GenerativeUI`, declaration validation, scoped state
registries, and the DataTable controller. Each application or SSR request owns a
separate Jotai store. Theme changes preserve values; definition migrations require an
explicitly supplied new registry.

## Documentation and specifications

Public documentation uses MkDocs, with canonical URL `https://reacd.dev/`. It is
previewed locally; this work does not publish the domain or deploy anything.

```sh
python3 -m venv .venv-docs
.venv-docs/bin/python -m pip install -r requirements-docs.txt
npm run docs:check
.venv-docs/bin/python -m http.server 8000 --bind 127.0.0.1 -d site
```

Use Python 3.13 for the pinned documentation environment. Public guides live in `docs/`;
internal requirements, decisions, catalog inventories, and verification evidence live in
`specs/`. Implementation follows spec-driven development.

## Releases and package installation

Verified main commits build the complete documentation artifact. Conventional Commits
produce a reviewed release PR and the public [changelog](docs/changelog.md).
The [release guide](docs/guides/releases.md) describes the initial npm ownership and
OIDC setup. Publication is disabled until its explicit repository setting is enabled.
Adding the workflow does not publish npm or deploy the documentation domain.

React 19.3.1, ReactDOM 19.3.1 and Jotai 3.0.1 are exact host peer requirements.
The clean packed-consumer check verifies shared host instances and isolated SSR state.
The distributed package includes the project Apache-2.0 LICENSE and the upstream
shadcn MIT license in THIRD_PARTY_NOTICES.md.

## Verification boundaries

The owned runtime requires 100% statement, branch, function, and line coverage per file.
TypeScript runs with strict checks. Tests stay beside their modules; shared helpers live
in `test-support/`, and browser conformance in `demo/e2e/`.

Coverage includes the CLI entry points in `scripts/`. Their colocated tests run in Node
with isolated external-command boundaries; runtime tests use JSDOM. The full check also
executes the real build, packed consumer, browser suite, and documentation build.

Schema validation checks structure and relationships. Browser conformance checks the
maintained rendering engine, including text overflow, keyboard interactions, container
widths, enlarged text, and token profiles. Neither coverage nor schema validation proves
that every possible interface is correct.

The closed application API is not a filesystem sandbox. Restricting an agent's ability
to modify trusted engine source requires workspace permissions as well. Publishing
requires the verified release SHA, tag, package identity and explicit npm enablement.
Build artifacts and canonical documentation URLs do not constitute deployment.
