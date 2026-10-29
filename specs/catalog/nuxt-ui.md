# Nuxt UI catalog baseline

CATALOG-001: All entries below are required enterprise scope. No entry is accepted
merely because an export or placeholder exists.

- Reference: https://ui.nuxt.com/docs/components
- Retrieved: 2026-10-28.
- Repository: https://github.com/nuxt/ui, default branch `v4`.
- Repository HEAD observed: `366e948458689236e5b2fa98cb2e292f6e5327b3`.
- npm version observed: `@nuxt/ui@4.12.0`.
- SHA-256 of the retrieved catalog Markdown:
  `68c4ccfceed0346a25b1d8f5f157b011b5e0cf7e5d25d233e4ac8389b70c4ce2`.
- Count: 132 unique public component entries.

The documentation snapshot, repository HEAD, and npm version are independently observed
references. Their contents are not assumed to be identical releases. Individual upstream
references follow `/docs/components/<kebab-case-name>`. The raw reference snapshot is
cached locally under `.cache/references/`.

## Acceptance for each entry

An entry requires a separate component module with its own Props type, strict schema,
renderer and shadcn integration, meaningful interaction and failure coverage, consumer
type checks, browser checks, and public reference examples. Internal progress stays in
specs, outside the public documentation.

| Component                | Family     | State    |
| ------------------------ | ---------- | -------- |
| App                      | Layout     | Verified |
| Container                | Layout     | Verified |
| Error                    | Layout     | Verified |
| Footer                   | Layout     | Verified |
| Header                   | Layout     | Verified |
| Main                     | Layout     | Verified |
| Sidebar                  | Layout     | Verified |
| Splitter                 | Layout     | Verified |
| Theme                    | Layout     | Verified |
| Alert                    | Element    | Verified |
| Avatar                   | Element    | Verified |
| AvatarGroup              | Element    | Verified |
| Badge                    | Element    | Verified |
| Banner                   | Element    | Verified |
| Button                   | Element    | Verified |
| Calendar                 | Element    | Verified |
| Card                     | Element    | Verified |
| Chip                     | Element    | Verified |
| Collapsible              | Element    | Verified |
| FieldGroup               | Element    | Verified |
| Icon                     | Element    | Verified |
| Kbd                      | Element    | Verified |
| Progress                 | Element    | Verified |
| ProgressGroup            | Element    | Verified |
| Separator                | Element    | Verified |
| Skeleton                 | Element    | Verified |
| Checkbox                 | Form       | Verified |
| CheckboxGroup            | Form       | Verified |
| ColorPicker              | Form       | Verified |
| FileUpload               | Form       | Verified |
| Form                     | Form       | Verified |
| FormField                | Form       | Verified |
| Input                    | Form       | Verified |
| InputDate                | Form       | Verified |
| InputMenu                | Form       | Verified |
| InputNumber              | Form       | Verified |
| InputRating              | Form       | Verified |
| InputTags                | Form       | Verified |
| InputTime                | Form       | Verified |
| Listbox                  | Form       | Verified |
| PinInput                 | Form       | Verified |
| RadioGroup               | Form       | Verified |
| Select                   | Form       | Verified |
| SelectMenu               | Form       | Verified |
| Slider                   | Form       | Verified |
| Switch                   | Form       | Verified |
| Textarea                 | Form       | Verified |
| Accordion                | Data       | Verified |
| Carousel                 | Data       | Verified |
| Chart                    | Data       | Verified |
| Empty                    | Data       | Verified |
| Marquee                  | Data       | Verified |
| ScrollArea               | Data       | Verified |
| Table                    | Data       | Verified |
| Timeline                 | Data       | Verified |
| Tree                     | Data       | Verified |
| User                     | Data       | Verified |
| Breadcrumb               | Navigation | Verified |
| CommandPalette           | Navigation | Verified |
| FooterColumns            | Navigation | Verified |
| Link                     | Navigation | Verified |
| NavigationMenu           | Navigation | Verified |
| Pagination               | Navigation | Verified |
| Stepper                  | Navigation | Verified |
| Tabs                     | Navigation | Verified |
| ContextMenu              | Overlay    | Verified |
| Drawer                   | Overlay    | Verified |
| DropdownMenu             | Overlay    | Verified |
| Modal                    | Overlay    | Verified |
| Popover                  | Overlay    | Verified |
| Slideover                | Overlay    | Verified |
| Toast                    | Overlay    | Verified |
| Tooltip                  | Overlay    | Verified |
| AuthForm                 | Page       | Verified |
| BlogPost                 | Page       | Verified |
| BlogPosts                | Page       | Verified |
| ChangelogVersion         | Page       | Verified |
| ChangelogVersions        | Page       | Verified |
| Page                     | Page       | Verified |
| PageAnchors              | Page       | Verified |
| PageAside                | Page       | Verified |
| PageBody                 | Page       | Verified |
| PageCard                 | Page       | Verified |
| PageColumns              | Page       | Verified |
| PageCTA                  | Page       | Verified |
| PageFeature              | Page       | Verified |
| PageGrid                 | Page       | Verified |
| PageHeader               | Page       | Verified |
| PageHero                 | Page       | Verified |
| PageLinks                | Page       | Verified |
| PageList                 | Page       | Verified |
| PageLogos                | Page       | Verified |
| PageSection              | Page       | Verified |
| PricingPlan              | Page       | Verified |
| PricingPlans             | Page       | Verified |
| PricingTable             | Page       | Verified |
| DashboardGroup           | Dashboard  | Verified |
| DashboardNavbar          | Dashboard  | Verified |
| DashboardPanel           | Dashboard  | Verified |
| DashboardResizeHandle    | Dashboard  | Verified |
| DashboardSearch          | Dashboard  | Verified |
| DashboardSearchButton    | Dashboard  | Verified |
| DashboardSidebar         | Dashboard  | Verified |
| DashboardSidebarCollapse | Dashboard  | Verified |
| DashboardSidebarToggle   | Dashboard  | Verified |
| DashboardToolbar         | Dashboard  | Verified |
| ChatAttachment           | AI Chat    | Verified |
| ChatMessage              | AI Chat    | Verified |
| ChatMessages             | AI Chat    | Verified |
| ChatPalette              | AI Chat    | Verified |
| ChatPrompt               | AI Chat    | Verified |
| ChatPromptSubmit         | AI Chat    | Verified |
| ChatReasoning            | AI Chat    | Verified |
| ChatShimmer              | AI Chat    | Verified |
| ChatTool                 | AI Chat    | Verified |
| Editor                   | Editor     | Verified |
| EditorDragHandle         | Editor     | Verified |
| EditorEmojiMenu          | Editor     | Verified |
| EditorMentionMenu        | Editor     | Verified |
| EditorSuggestionMenu     | Editor     | Verified |
| EditorToolbar            | Editor     | Verified |
| ContentNavigation        | Content    | Verified |
| ContentSearch            | Content    | Verified |
| ContentSearchButton      | Content    | Verified |
| ContentSurround          | Content    | Verified |
| ContentToc               | Content    | Verified |
| ColorModeAvatar          | Color Mode | Verified |
| ColorModeButton          | Color Mode | Verified |
| ColorModeImage           | Color Mode | Verified |
| ColorModeSelect          | Color Mode | Verified |
| ColorModeSwitch          | Color Mode | Verified |
| LocaleSelect             | i18n       | Verified |

## React adaptation

Nuxt content, color mode, locale, router, and editor integrations become explicit React
contracts. Rich text is structured editor data, never a public HTML escape. The
component API remains TSX with closed logical props. Vendor CSS and DOM stay inside
trusted adapters and renderers. Layout primitives extend this baseline.
