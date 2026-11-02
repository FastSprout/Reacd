---
reacd_example: Counter
---

# Theme adapters

The engine and design-system implementations are separate packages. Each adapter maps
supported reacd components to its SDK's actual controls and surfaces. Support is
explicit: an absent mapping throws `UnsupportedAdapterComponentError` with the adapter
and component names. There is no substitute renderer or fallback to another SDK.

## Compare the same view

Increment the counter and change **Example adapter**. Its Jotai value remains unchanged.
Configure template density and `App` direction in your application declarations.

<!-- reacd-live-preview -->

Choose a package-specific setup:

- [shadcn/ui adapter](adapters/shadcn.md)
- [Material UI adapter](adapters/mui.md)

The executed source is on the [Counter example](../examples/counter.md) page.

## Install and select an adapter

```sh
npm install @fastsprout/reacd
```

The package metadata declares host peers and design-system dependencies. npm installs
missing peers automatically; an existing host must satisfy those declared versions.

This is the same compiled setup as the getting started guide:

```tsx
--8<-- "examples/installation.tsx"
```

`ReacdProvider` uses shadcn/ui when `adapter` is omitted. The engine installs the
separate shadcn adapter package as its default dependency. Invalid explicit adapter
entries produce validation diagnostics. A declaration without a supported mapping throws
`UnsupportedAdapterComponentError`; the engine never changes an explicitly selected
adapter to hide missing support. There is no global adapter registration.

The separate `@fastsprout/reacd/styles` import is for browser code. The engine and
adapter JavaScript entries do not import styles, so the same adapter selection can be
used for synchronous server rendering. Keep mounting in the existing React host.

## Keep views independent

Views continue importing controls from `@fastsprout/reacd`:

```tsx
<Button label="Save profile" onPress={saveProfile} />
```

Select the adapter at the application composition root. Individual views do not import
vendor controls or pass classes, slots, `sx` or inline styles. Business callbacks and
Jotai values are independent of the adapter selection.

Generative views inherit the surrounding provider's adapter unless one is supplied
explicitly. Standalone generative views use shadcn/ui by default. Changing adapter
selection does not reset an existing application store.

## Templates are appearance tokens

An adapter chooses a design-system implementation. A template supplies appearance values
such as color, typography, spacing and shape within that implementation.
`saas-modern-light` and `erp-compact` are two token templates supported by both
adapters; they are not two adapters. A new color palette does not create a new component
mapping.

The default light and dark palettes use black, white and neutral grays. A custom palette
requires an explicit template. Semantic diagnostics and syntax highlighting retain their
meaningful colors.

Use `templateId` or the application's template state to switch tokens. Keep token
configuration at the composition boundary rather than editing individual views.

## Customize the website

The homepage's visible theme presets apply a complete design with one click.
Use **Customize theme** in the header to adjust the primary color, neutral palette,
font, corners or density individually. Changes appear immediately on the website
and its live examples, including Material UI. The menu remains open while choosing.

Your browser remembers the selected design. Individual adjustments display as
**Custom** unless they match a preset. **Reset theme** restores the default
monochrome design. Changing a design or adapter preserves the example's Jotai state;
reloading the page restores the design and starts a fresh example session.

## Trusted adapter integration

Adapter authors use `@fastsprout/reacd/adapter-runtime/...` for owned rendering
contracts and shared contexts. This namespace is for trusted adapter integration, not
application imports. It does not expose state or vendor subpaths. Application views
continue using the closed engine components and select a supported adapter at their
composition root.

## Material UI

```sh
npm install @fastsprout/reacd @fastsprout/reacd-mui
```

```tsx
--8<-- "examples/installation-mui.tsx"
```

Material UI and Emotion own controls, typography, focus, portals, animations and
surfaces. Documented SDK compositions provide components without a one-to-one export.
Schemas and state contracts are shared; visual controls and interaction engines are not.
Neither adapter imports the other. Material dependencies remain outside the engine
package.

Templates map to Material palettes, density, typography and shape. Nested `Theme`
boundaries update the Material theme alongside reacd tokens. `App` synchronizes
right-to-left layout. Component previews expose adapter selection while retaining Jotai
state and follow the site’s light or dark appearance.

Changing adapters preserves the provider's Jotai store. React-local state inside
replaced rendering subtrees follows normal React remount semantics; application state
belongs in Jotai. Schema validation checks declarations, while browser conformance
checks actual rendering and interactions.
