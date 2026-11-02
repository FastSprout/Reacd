# Application examples

These views combine reacd components and Jotai state. Each page runs the same TSX module
that it displays, with an isolated store and controls for shadcn/ui, Material UI,
compact tokens and right-to-left layout.

- [Counter](counter.md): increment, reset, then switch adapters.
- [Contact form](contact-form.md): submit an empty field, save a name, clear it.
- [Orders dashboard](orders-dashboard.md): combine a name filter and open status.

Install the packages and configure the TSX runtime using
[Get started](../getting-started.md). Render an exported example inside the
`ReacdProvider` from that guide. Application views import only public reacd components
and their state dependencies; the provider selects the adapter.

The examples use local sample data. Saving a contact updates browser memory, without a
network request or database. Reloading resets the example. They demonstrate client React
integration; they do not establish Next.js or React Server Components support.

For individual APIs, [browse the component catalog](../components/index.md).
