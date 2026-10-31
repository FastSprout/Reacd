# Build interfaces from intent

reacd brings component-only application authoring to React and TypeScript. Compose views
in TSX, connect typed state, and choose a design adapter for your application.

[Get started](getting-started.md) · [Explore components](components/index.md)

```tsx
<Card>
  <VStack spacing="medium">
    <Text role="subheadline">Customer profile</Text>
    <Input label="Name" value={name} onValueChange={setName} />
    <Button label="Save profile" onPress={saveProfile} />
  </VStack>
</Card>
```

## Components instead of markup

Declare structure with `VStack`, `HStack`, `Grid`, `Card`, and `Section`. Describe
content with `Text`. Connect actions and controlled fields through typed properties.
Application views contain no native tags or styling props.

## A design adapter for the whole application

Keep the same component declarations when changing design systems. Adapters translate
reacd controls into their concrete appearance; templates configure the visual tokens
used by the selected adapter.

Choose [shadcn/ui or Material UI](guides/theme-adapters.md). Every component reference
includes an adapter switch in its live preview.

[Learn about adapters](guides/theme-adapters.md)

## State stays explicit

Use Jotai atoms for application state and pass controlled values into fields. Values and
actions remain application data, independent of the selected design.

[Connect state](guides/state.md)

## Generative UI when you need it

Use validated JSON for generated declarations. Normal application development uses TSX
components; JSON is a separate transport for generative interfaces.

[Explore generative UI](guides/generative-ui.md)
