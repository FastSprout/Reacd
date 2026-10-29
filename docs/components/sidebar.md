---
template: preview.html
reacd_preview: Sidebar
reacd_preview_height: 560
---

# Sidebar

Sidebar supplies a labeled complementary region and a responsive modal navigation
surface. Its content stays mounted while hidden, preserving controlled field values. It
supports logical start/end placement and sidebar, floating and inset appearances.

## Runnable example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/sidebar.tsx"
```

The live preview exposes independent desktop and mobile visibility. It also demonstrates
collapse policies, appearance, logical placement and scoped RTL direction.

## Contract

| Property                       | Meaning                                             |
| ------------------------------ | --------------------------------------------------- |
| title                          | Required visible title and accessible region name   |
| description                    | Optional supporting navigation description          |
| open, onOpenChange             | Required desktop visibility and callback            |
| mobileOpen, onMobileOpenChange | Required independent mobile visibility and callback |
| children                       | Safe reacd content retained while collapsed         |
| header, actions, footer        | Optional safe navigation slots                      |
| collapsedContent               | Safe content for the desktop icon policy            |
| side                           | Logical start or end                                |
| variant                        | sidebar, floating or inset                          |
| collapsible                    | offcanvas, icon or none                             |
| toggleLabel, closeLabel        | Optional visible labels                             |
| disabled                       | Disables the supplied toggle and close buttons      |

Initialize mobileOpen to false when desktop navigation starts open. The renderer never
copies desktop state into mobile state during hydration or a viewport transition.
Applications supply no breakpoints, widths, HTML, classes or styles. The none policy
always stays inline and omits modal behavior and the collapse toggle.

On narrow containers a collapsible Sidebar traps focus while open. Escape or its close
button dismisses it and restores the toggle. Merely resizing the container does not
write either controlled state pair. Long content wraps. The close control stays outside
the shared mobile scroll region for the title, application content and footer.

Generative UI uses two explicit boolean readWrite state bindings. Every content slot is
validated recursively, including action references in collapsed content.

This is a closed React adaptation of shadcn Sidebar. Raw provider context, cookie
persistence, styling hooks, native tags and arbitrary keyboard shortcuts are not public.
