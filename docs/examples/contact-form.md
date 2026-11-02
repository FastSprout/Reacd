---
reacd_example: ContactForm
---

# Contact form

Submit an empty name to trigger required-field validation. Enter a name and choose
**Save contact** to update the local confirmation. **Clear contact** resets both values.

<!-- reacd-live-preview -->

## Source

Render `ContactFormExample` inside the `ReacdProvider` shown in
[Get started](../getting-started.md). The view owns values and actions; `Form`, `Input`
and `SubmitButton` own the rendering and form behavior.

```tsx
--8<-- "examples/recipe-contact-form.tsx"
```

This example does not persist contacts or call a server. Connect the submission action
to your business service for persistence. For pending and server-error feedback, see
[Form](../components/form.md). For controlled field properties, see
[Input](../components/input.md).
