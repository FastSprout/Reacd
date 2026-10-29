# Catalog traceability

Snapshot: 2026-10-29, fork-a after native Editor and complete source integration.
This maps the pinned 132-entry inventory; I denotes integrated source, not test proof.
All rows now pass [combined local acceptance](combined-final.md); hashes remain
separate.

## Paths and evidence

Let k be the component name converted to lowercase kebab case: PageCTA becomes
page-cta; Textarea becomes textarea. Each I row has these existing files:

- TSX: src/components/k/k.tsx; its named Props live in the same module directory.
- Schema: src/schema/k/k.schema.ts; strict generative schema is normally sibling
  generative.schema.ts. Button is defined in generative-v2/leaf-nodes.schema.ts.
- Reference: docs/components/k.md. Example = means docs/examples/k.tsx;
  other Example values replace k. docs/examples/tsconfig.json compiles these examples.
- Registry codes resolve under src/adapter/shadcn/registry/ below; base instead means
  src/adapter/shadcn/shadcn.adapter.ts. Each row identifies an actual renderEntry.
- Fixture codes resolve under src/adapter/shadcn/__tests__/ below. Those objects
  contribute to exhaustive EXAMPLES/conformance.test.tsx, including composed spreads.
- Route codes resolve under src/state/generative-ui/ below. Entry dispatch is
  node-view.tsx through composition and family routers. missing is a tracked gap.


Unlisted Registry codes equal their file stem.

| Registry code | File stem |
| --- | --- |
| shell | shells |
| struct | structure |
| nav | navigation-composition |
| pages | page-composition |
| present | page-presentation |
| pnav | page-navigation |
| side | sidebar-splitter |
| forms | fields |
| feed | feedback |
| dash | dashboard |
| edit | editorial |
| price | pricing |
| panels | edge-panels |
| menus | action-menus |
| search | content-search |
| outline | content-outline |
| auth | auth-form |
| logos | page-logos |
| cal | calendar |
| elem | element |
| chatfb | chat-feedback |
| composer | chat-composer |
| colors | color-mode |
| picker | color-picker |
| upload | file-upload |
| command | command-palette |
| edrag | editor-drag-handle |

Unlisted Fixture codes resolve to code-examples.tsx.

| Fixture code | File stem (.tsx) |
| --- | --- |
| dash | dashboard-examples |
| base | examples |
| time | input-time-examples |
| date | input-date-examples |
| elem | element-examples |
| chatfb | chat-feedback-examples |
| compose | chat-composer-examples |
| forms | form-control-examples |
| colors | color-mode-examples |
| picker | color-picker-examples |
| upload | file-upload-examples |
| editor | ../../../../test-support/adapter-editor-examples |
| emenu | editor-menu-examples |
| edrag | editor-drag-handle-examples |

| Route code | File stem (.tsx) |
| --- | --- |
| main | node-view |
| catalog | catalog-node-view |
| compose | composition-node-view |
| extra | additional-node-view |
| page | page-node-view |
| present | page-presentation-node-view |
| pnav | page-navigation-node-view |
| dash | dashboard-node-view |
| edit | editorial-node-view |
| price | pricing-node-view |
| form | form-node-view |
| display | display-node-view |
| side | sidebar-splitter-node-view |
| chat | chat-node-view |
| chatfb | chat-feedback-node-view |
| chatcm | chat-composer-node-view |
| color | color-mode-node-view |
| carousel | carousel-node-view |
| auth | auth-form-node-view |

Binding codes name direct state projections; optional bindings remain optional.
SM: selection value plus optional independent query and open channels.
Read/readWrite permissions and state kinds come from the component schema and
schema/generative-v2/{binding-contracts,catalog-bindings,form-bindings}.ts plus
its delegated contracts. A dash means no direct binding, not no actions/context.

- v: value; c: checked; o: open; H: menu.open; S: open/mobileOpen.
- L: panelLayout value; k: Kbd value; sh: show; ld: loading; ps: paused.
- F: disabled/submitting; e: error; IM: value/open; t: value/expanded.
- D: interactive rows/selection/sorting/filters/pagination; static Table has none.
- Q: query/selection; QO: open/query/selection; M: open and item checked/value.
- A: loading/disabled; G: value/open/mobileOpen; DS: open/query/selection.
- CP: value/status; CR: open/text; CS: text/active; CM: value/systemMode.
- CA: resolved mode; CN: currentKey/expandedKeys; CT: currentKey; tip: open.

## Inventory mapping

| Component | Registry | Fixture | Example | Route | Binding | Stage |
| --- | --- | --- | --- | --- | --- | --- |
| App | shell | catalog | = | catalog | - | I |
| Container | shell | base | = | catalog | - | I |
| Error | shell | catalog | = | catalog | - | I |
| Footer | shell | base | = | catalog | - | I |
| Header | shell | base | = | catalog | H | I |
| Main | shell | base | = | catalog | - | I |
| Sidebar | side | catalog | = | side | S | I |
| Splitter | side | catalog | = | side | L | I |
| Theme | shell | catalog | = | catalog | - | I |
| Alert | content | base | = | extra | o | I |
| Avatar | content | base | = | main | - | I |
| AvatarGroup | content | base | = | main | - | I |
| Badge | content | base | = | display | - | I |
| Banner | feed | base | = | catalog | o | I |
| Button | base | base | = | main | - | I |
| Calendar | cal | calendar | = | extra | v | I |
| Card | base | base | = | extra | - | I |
| Chip | content | base | = | main | - | I |
| Collapsible | content | base | = | main | o | I |
| FieldGroup | forms | base | = | extra | - | I |
| Icon | elem | elem | = | extra | - | I |
| Kbd | content | base | = | display | k | I |
| Progress | content | base | = | extra | v | I |
| ProgressGroup | feed | base | = | catalog | - | I |
| Separator | shell | base | = | catalog | - | I |
| Skeleton | content | base | = | display | sh | I |
| Checkbox | forms | base | = | form | c | I |
| CheckboxGroup | forms | base | = | main | v | I |
| ColorPicker | picker | picker | = | form | v | I |
| FileUpload | upload | upload | = | form | v | I |
| Form | struct | base | = | form | F | I |
| FormField | forms | forms | = | form | e | I |
| Input | base | base | = | main | v | I |
| InputDate | forms | date | = | extra | v | I |
| InputMenu | forms | base | = | form | IM | I |
| InputNumber | forms | base | = | catalog | v | I |
| InputRating | forms | catalog | = | catalog | v | I |
| InputTags | forms | catalog | = | main | v | I |
| InputTime | forms | time | = | extra | v | I |
| Listbox | listbox | catalog | = | form | v | I |
| PinInput | forms | base | = | catalog | v | I |
| RadioGroup | forms | base | = | main | v | I |
| Select | forms | base | = | form | v | I |
| SelectMenu | forms | catalog | = | form | SM | I |
| Slider | forms | base | = | form | v | I |
| Switch | forms | forms | = | form | c | I |
| Textarea | forms | forms | = | form | v | I |
| Accordion | content | base | = | main | v | I |
| Carousel | carousel | carousel | = | carousel | v | I |
| Chart | chart | chart | = | compose | - | I |
| Empty | content | base | = | display | ld | I |
| Marquee | marquee | marquee | = | compose | ps | I |
| ScrollArea | feed | catalog | = | catalog | - | I |
| Table | content | base | = | compose | D | I |
| Timeline | feed | catalog | = | catalog | v | I |
| Tree | feed | catalog | = | main | t | I |
| User | feed | base | = | catalog | - | I |
| Breadcrumb | content | base | = | main | - | I |
| CommandPalette | command | catalog | = | main | Q | I |
| FooterColumns | nav | catalog | = | main | - | I |
| Link | content | base | = | main | - | I |
| NavigationMenu | nav | catalog | = | main | - | I |
| Pagination | content | base | = | main | v | I |
| Stepper | nav | catalog | = | main | v | I |
| Tabs | content | base | = | main | v | I |
| ContextMenu | menus | catalog | = | compose | M | I |
| Drawer | panels | catalog | = | compose | o | I |
| DropdownMenu | menus | catalog | = | compose | M | I |
| Modal | content | base | = | main | o | I |
| Popover | content | base | = | main | o | I |
| Slideover | panels | catalog | = | compose | - | I |
| Toast | toast | catalog | = | compose | o | I |
| Tooltip | content | base | = | display | tip | I |
| AuthForm | auth | catalog | = | auth | A | I |
| BlogPost | edit | catalog | = | edit | - | I |
| BlogPosts | edit | catalog | = | edit | - | I |
| ChangelogVersion | edit | catalog | = | edit | - | I |
| ChangelogVersions | edit | catalog | = | edit | - | I |
| Page | struct | base | = | pnav | - | I |
| PageAnchors | pnav | catalog | = | pnav | - | I |
| PageAside | pages | catalog | = | page | - | I |
| PageBody | pages | catalog | = | main | - | I |
| PageCard | present | catalog | = | present | - | I |
| PageColumns | pages | catalog | = | main | - | I |
| PageCTA | pnav | catalog | = | main | - | I |
| PageFeature | present | catalog | = | present | - | I |
| PageGrid | pages | catalog | = | main | - | I |
| PageHeader | present | catalog | = | present | - | I |
| PageHero | present | catalog | = | main | - | I |
| PageLinks | pnav | catalog | = | pnav | - | I |
| PageList | pages | catalog | = | main | - | I |
| PageLogos | logos | catalog | = | compose | - | I |
| PageSection | present | catalog | = | present | - | I |
| PricingPlan | price | catalog | = | price | - | I |
| PricingPlans | price | catalog | = | price | - | I |
| PricingTable | price | catalog | = | price | - | I |
| DashboardGroup | dash | dash | dashboard | dash | G | I |
| DashboardNavbar | dash | dash | dashboard | dash | - | I |
| DashboardPanel | dash | dash | dashboard | dash | - | I |
| DashboardResizeHandle | dash | dash | dashboard | dash | - | I |
| DashboardSearch | dash | dash | dashboard | dash | DS | I |
| DashboardSearchButton | dash | dash | dashboard | dash | - | I |
| DashboardSidebar | dash | dash | dashboard | dash | - | I |
| DashboardSidebarCollapse | dash | dash | dashboard | dash | - | I |
| DashboardSidebarToggle | dash | dash | dashboard | dash | - | I |
| DashboardToolbar | dash | dash | dashboard | dash | - | I |
| ChatAttachment | chat | chat | = | chat | - | I |
| ChatMessage | chat | chat | = | chat | - | I |
| ChatMessages | chat | chat | = | chat | - | I |
| ChatPalette | composer | compose | = | chatcm | - | I |
| ChatPrompt | composer | compose | = | chatcm | CP | I |
| ChatPromptSubmit | composer | compose | = | main | - | I |
| ChatReasoning | chatfb | chatfb | = | chatfb | CR | I |
| ChatShimmer | chatfb | chatfb | = | chatfb | CS | I |
| ChatTool | chatfb | chatfb | = | chatfb | o | I |
| Editor | editor | editor | = | extra | v | I |
| EditorDragHandle | edrag | edrag | = | extra | - | I |
| EditorEmojiMenu | editor-menus | emenu | = | extra | - | I |
| EditorMentionMenu | editor-menus | emenu | = | extra | - | I |
| EditorSuggestionMenu | editor-menus | emenu | = | extra | - | I |
| EditorToolbar | editor | editor | = | extra | - | I |
| ContentNavigation | outline | catalog | = | display | CN | I |
| ContentSearch | search | catalog | = | compose | QO | I |
| ContentSearchButton | search | catalog | = | compose | o | I |
| ContentSurround | content | catalog | = | compose | - | I |
| ContentToc | outline | catalog | = | display | CT | I |
| ColorModeAvatar | colors | colors | color-mode | color | CA | I |
| ColorModeButton | colors | colors | color-mode | color | CM | I |
| ColorModeImage | colors | colors | color-mode | color | CA | I |
| ColorModeSelect | colors | colors | color-mode | color | CM | I |
| ColorModeSwitch | colors | colors | color-mode | color | CM | I |
| LocaleSelect | forms | locale | = | compose | v | I |

## Gaps, adaptations and provenance

Badge now has a strict literal 0.2 node, with no new state or callback feature.
All 132 pinned Nuxt entries now have integrated TSX/schema/adapter source. Native
Editor source is included alongside its document foundation. Combined local
acceptance and independent Standards/Spec reviews are closed; see combined-final.md.

Textarea is the Nuxt entry; legacy TextArea remains a separate compatibility API.
Modal is the explicit dialog primitive. Layout helpers such as VStack/HStack/Grid,
DataTable and SubmitButton extend the Nuxt inventory rather than rename its rows.
Dashboard helpers consume group context; ChatPromptSubmit consumes composer context.
Their dash bindings therefore do not imply inert or independent behavior.

Inventory provenance is specs/catalog/nuxt-ui.md: 132 unique entries from the pinned
2026-10-28 upstream snapshot. This table was cross-checked against actual source,
registry entries, exhaustive fixtures and compiled example paths. Integration proof
is in specs/integration/{b-delivery-integration,form2-composed}.md and frozen hashes
under .cache/batches/form2-owned-corrections. It is not a fresh global test result.
Schema validity does not prove browser rendering. Existing Chromium evidence and
complete combined acceptance remain separate from this source traceability.

## Additional public API audit

All 18 extensions have compiled exhaustive fixtures. Reference/own example means
per-component public files. Their own compiled tests and two live profile
journeys now pass.

| API | 0.2 route | Reference/own example |
| --- | --- | --- |
| CodeBlock | gap | yes/yes |
| CodeEditor | gap | yes/yes |
| DataTable | main | yes/yes |
| Divider | gap | yes/yes |
| Grid | main | yes/yes |
| HStack | main | yes/yes |
| Navigation | gap | yes/yes |
| Section | pnav | yes/yes |
| Spacer | gap | yes/yes |
| Spinner | gap | yes/yes |
| SplitView | gap | yes/yes |
| SubmitButton | form | yes/yes |
| Text | main | yes/yes |
| TextArea | gap | yes/yes |
| Toggle | main | yes/yes |
| Toolbar | gap | yes/yes |
| VStack | main | yes/yes |
| Viewport | gap | yes/yes |
