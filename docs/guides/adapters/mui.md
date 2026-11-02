---
reacd_example: Counter
---

# Material UI adapter

`@fastsprout/reacd-mui` maps supported reacd components to Material UI and Emotion. Its
current catalog coverage is partial. It is independent of the shadcn adapter. The engine
package does not depend on Material UI, and application views do not import Material
controls or use `sx`.

## Install

```sh
npm install @fastsprout/reacd @fastsprout/reacd-mui
```

npm resolves the adapter's design-system dependencies and declared host peers. Configure
`jsxImportSource` as described in [Get started](../../getting-started.md).

## Select at the root

```tsx
--8<-- "examples/installation-mui.tsx"
```

The styles entry belongs in browser code. The adapter JavaScript entry supports
synchronous server rendering without importing styles; this does not establish React
Server Components or Next.js compatibility.

## Try it

Choose **Material UI** in **Example adapter** to compare the same declaration. The
default is shadcn/ui. Jotai values survive changing adapters; React-local state in
replaced rendering subtrees follows normal React remount behavior.

The complete homepage gallery uses Material UI controls, MUI X calendars/date
pickers and MUI X charts. Unsupported component declarations or unsupported SDK
variants still report explicit diagnostics.

<!-- reacd-live-preview -->

The counter source is on the [Counter example](../../examples/counter.md) page. See
[Theme adapters](../theme-adapters.md) for density, direction and token templates.
