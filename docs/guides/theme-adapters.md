# Theme adapters

The engine and the design-system implementation are separate packages. An adapter maps
all reacd components to concrete controls and surfaces. Only the shadcn adapter is
implemented; a complete MUI adapter is planned.

## Install and select an adapter

```sh
npm install @fastsprout/reacd @fastsprout/reacd-shadcn
```

The package metadata declares host peers and design-system dependencies. npm installs
missing peers automatically; an existing host must satisfy those declared versions.

This is the same compiled setup as the getting started guide:

```tsx
--8<-- "examples/installation.tsx"
```

Import `shadcnAdapter` from `@fastsprout/reacd-shadcn` and pass it explicitly to
`ReacdProvider`. Every adapter must implement the complete component catalog. A missing
or incomplete adapter produces validation diagnostics instead of selecting a default.
There is no global adapter registration.

The separate `@fastsprout/reacd-shadcn/styles` import is for browser code. The engine
and adapter JavaScript entries do not import styles, so the same adapter selection can
be used for synchronous server rendering. Keep mounting in the existing React host.

## Keep views independent

Views continue importing controls from `@fastsprout/reacd`:

```tsx
<Button label="Save profile" onPress={saveProfile} />
```

Select the adapter at the application composition root. Individual views do not import
vendor controls or pass classes, slots, `sx` or inline styles. Business callbacks and
Jotai values are independent of the adapter selection.

Generative views inherit the surrounding provider's adapter unless one is supplied
explicitly. Standalone generative views require an adapter and report a missing-adapter
issue when none is available. Changing adapter selection does not reset an existing
application store.

## Templates are appearance tokens

An adapter chooses a design-system implementation. A template supplies appearance values
such as color, typography, spacing and shape within that implementation.
`saas-modern-light` and `erp-compact` are two token templates for the shadcn adapter;
they are not two adapters. A new color palette does not create a new component mapping.

Use `templateId` or the application's template state to switch tokens. Keep token
configuration at the composition boundary rather than editing individual views.

## Trusted adapter integration

Adapter authors use `@fastsprout/reacd/adapter-runtime/...` for owned rendering
contracts and shared contexts. This namespace is for trusted adapter integration, not
application imports. It does not expose state or vendor subpaths. Application views
continue using the closed engine components and select a complete adapter at their
composition root.
