# Component contract

COMP-001: The primary application language is TypeScript with TSX.

```tsx
const nameAtom = atom('');

function Profile() {
  const [name, setName] = useAtom(nameAtom);

  return (
    <Card>
      <VStack spacing="medium">
        <Text role="subheadline">Profile</Text>
        <Input label="Name" value={name} onValueChange={setName} />
        <Button label="Save" onPress={() => saveProfile(name)} />
      </VStack>
    </Card>
  );
}
```

The excerpt illustrates declaration shape. Published runnable examples must include
their imports and business-action definitions and must compile.

COMP-002: Every public component has its own module, exported Props type, and focused
behavioral tests. Props are derived from the component's schema instead of maintained in
a central core file. A barrel may re-export components but must not implement them.

COMP-003: Components expose logical intent, controlled values, bindings, and actions.
They do not expose native HTML/CSS or vendor styling APIs.

## Required catalog

COMP-014: Every public component in the pinned Nuxt UI catalog is required. The exact
inventory and provenance are in `catalog/nuxt-ui.md`. This inventory is a coverage
baseline, not a dependency on Vue or Nuxt.

COMP-015: Each inventory entry needs its own declaration module, schema, Props export,
renderer integration, shadcn adapter integration, behavioral tests, consumer type tests,
browser acceptance, and public documentation. Names, placeholders, and wrappers with no
equivalent behavior do not count as done.

COMP-016: Nuxt-specific integrations become React framework-neutral contracts. Examples
include explicit search indexes, navigation callbacks, locale data, editor state, and
color-mode state. Public CSS, HTML, slots that accept native markup, and arbitrary
vendor props are not copied into reacd.

COMP-017: Upstream additions are reviewed through a local inventory update. An update
must not silently remove or rename existing reacd APIs. Nuxt UI behavior is a product
reference, not evidence that reacd has implemented it.

COMP-018: Public declarations are named functions with explicit named Props and return
types, for example `Grid(props: GridProps): ReactNode`. Editor signatures must not
expose an anonymous callable object returned by a component factory. Props remain local
to the component and derive from its validation schema.

## Additional reacd primitives

| Family     | Components                                                 |
| ---------- | ---------------------------------------------------------- |
| Layout     | VStack, HStack, Grid, SplitView, Viewport, Spacer, Divider |
| Structure  | Page, Section, Card, Toolbar                               |
| Content    | Text, CodeBlock, Badge, Link                               |
| Actions    | Button, SubmitButton                                       |
| Fields     | Input, TextArea, CodeEditor, Select                        |
| Selection  | Checkbox, Toggle, Slider                                   |
| Data       | Form, Table, DataTable                                     |
| Navigation | Tabs, Navigation                                           |
| Feedback   | Alert, Progress, Spinner                                   |

The composition root and provider belong to the state layer. The catalog is not
considered complete merely because these names are exported.

## Shared behavior

COMP-004: Text wraps safely by default. A line limit preserves access to the complete
content through an accessible disclosure or an equivalent mechanism.

COMP-005: Layouts adapt to their container. Applications do not supply breakpoints, raw
dimensions, arbitrary positioning, or per-device classes.

COMP-006: Inputs have visible labels and controlled values. Callbacks report typed
values, not raw browser events.

COMP-007: Actions have real behavior. A disabled control remains a real disabled
control, not a visually faded element that can still activate.

COMP-008: Forms preserve native validation and submit semantics. Business validation
remains explicit application logic.

COMP-009: Data components support loading, empty, ready, and error states as applicable.
State is communicated in text and accessibility semantics.

COMP-010: Tabs and navigation support documented keyboard behavior and stable selection.
Every destination or action in the reference app must work.

COMP-011: Tables retain semantic headers and captions. A named, keyboard-accessible
local scroll region may preserve readable columns without widening the page.

COMP-012: Every component reference documents properties, defaults, behavior,
accessibility, errors, and adapter support. Requirement IDs and acceptance evidence
remain in internal specs rather than the public component reference.

COMP-013: Native JSX elements fail application compilation. Runtime validation also
rejects native elements from untyped consumers or unsafe casts. Custom application
components that compose reacd declarations remain supported.
