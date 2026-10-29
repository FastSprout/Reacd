# Theme adapters

A theme adapter maps the reacd component catalog to a concrete design system. The first
integration target is shadcn/ui.

An adapter is more than a set of colors. It supplies the concrete controls and surfaces
behind the same application component declarations.

## Keep application views independent

```tsx
<Button label="Save profile" onPress={saveProfile} />
```

The view imports `Button` from reacd. It does not import a vendor button or pass vendor
classes, slots, `sx`, or inline styles.

## Adapter and template

- The adapter selects the design-system implementation.
- The template supplies appearance tokens such as color, typography, spacing, and shape.
- The renderer owns shared layout and accessibility behavior.
- Application state remains separate from the design selection.

Select the adapter at the application composition root. Keep individual views and their
business callbacks unchanged.

## Custom design

Create design configurations at the adapter boundary. Keep these configurations out of
individual application components so a new visual identity does not require editing each
view.
