---
reacd_example: Counter
---

# shadcn/ui adapter

`@fastsprout/reacd-shadcn` is the separate native shadcn/ui adapter for supported reacd
components. Its current catalog coverage is partial. It is installed and selected by
default by `@fastsprout/reacd`; application views keep importing components from
`@fastsprout/reacd`.

## Install

```sh
npm install @fastsprout/reacd
```

npm resolves the declared React, ReactDOM and Jotai peer dependencies. Configure
`jsxImportSource` as described in [Get started](../../getting-started.md).

## Select at the root

```tsx
--8<-- "examples/installation.tsx"
```

Import `@fastsprout/reacd/styles` in browser code. Keep it out of server imports. This
setup supplies an isolated store for each provider root and a monochrome default palette
in both light and dark modes.

## Try it

This preview starts with shadcn/ui. Increment the counter and change **Example adapter**
to compare the same view. The default token template is `saas-modern-light`. Configure
template density and `App` direction in your application declarations.

<!-- reacd-live-preview -->

The counter source is on the [Counter example](../../examples/counter.md) page. See
[Theme adapters](../theme-adapters.md) for token boundaries and adapter contracts.
