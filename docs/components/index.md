# Components

Compose application views from reacd components. Properties describe logical intent,
values, and actions. They do not expose native tags, class names, inline styles, or
vendor-specific styling controls.

## Layout

Use `VStack`, `HStack`, [Grid](grid.md), `SplitView`, `Viewport`, `Spacer`, and
`Divider` to describe relationships between elements.

Use [Container](container.md), [Main](main.md), [Header](header.md), and
[Footer](footer.md) for application structure, and [Separator](separator.md) for
semantic or decorative separation.

## Structure and content

Use `Page`, `Section`, `Card`, and `Toolbar` to organize a screen. Use [Text](text.md),
`CodeBlock`, `Badge`, and [Link](link.md) for content.

Use [PageAside](page-aside.md) and [PageBody](page-body.md) for page regions.
[PageColumns](page-columns.md) flows uneven content across columns;
[PageGrid](page-grid.md) aligns rows. [PageList](page-list.md) preserves list semantics
with optional item separators.

Use [Avatar](avatar.md) for one identity and [AvatarGroup](avatar-group.md) for a named
collection with accessible overflow.

Use [User](user.md) for a composed identity with optional navigation or action.

Use [PageLogos](page-logos.md) for a static collection of host-provided images with
meaningful alternative text and explicit unavailable-image fallbacks.

Use [Chip](chip.md) for a named dot/value indicator and [Tooltip](tooltip.md) for
supplementary hover/focus text that preserves underlying controls.

Use [Kbd](kbd.md) for accessible keyboard notation without shortcut registration.

Use [Skeleton](skeleton.md) to reserve loading space and [Empty](empty.md) to explain
missing content with safe recovery actions and optional busy feedback.

## Actions and fields

[Calendar](calendar.md), [InputDate](input-date.md) and [InputTime](input-time.md) use
canonical date/time values with explicit reference dates and bounded edits.
[FieldGroup](field-group.md) groups safe controls without rewriting child props.
[Icon](icon.md) exposes closed semantic names and explicit accessible intent.

[ChatAttachment](chat-attachment.md), [ChatMessage](chat-message.md) and
[ChatMessages](chat-messages.md) present controlled transcript data.
[ChatReasoning](chat-reasoning.md), [ChatTool](chat-tool.md) and
[ChatShimmer](chat-shimmer.md) add explicit disclosure, approval and pending feedback.

Use [AuthForm](auth-form.md) to compose controlled credential fields, independent
provider actions, native validation and explicit loading or server-error feedback.
Authentication and application state remain host-owned.

Use [Button](button.md) and `SubmitButton` for actions. Use [Input](input.md),
`TextArea`, `CodeEditor`, and `Select` for controlled data entry. Selection controls
include `Checkbox`, `Toggle`, and `Slider`.

Use [InputNumber](input-number.md) for localized numeric entry and
[PinInput](pin-input.md) for a controlled verification code.

Use [RadioGroup](radio-group.md) for one choice and [CheckboxGroup](checkbox-group.md)
for a controlled set with optional limits and required form selection.

## Data, navigation, and feedback

Use `Form` and `Table` for data, [Tabs](tabs.md) and `Navigation` for changing views,
and `Alert`, `Progress`, and `Spinner` to communicate state.

Use [Pagination](pagination.md) for bounded page selection and
[Breadcrumb](breadcrumb.md) for ordered navigation paths. Use
[ProgressGroup](progress-group.md) for segmented progress and [Banner](banner.md) for a
controlled application notice.

Use [Accordion](accordion.md) for controlled collapsible sections. Use
[Collapsible](collapsible.md) for a single panel with shared or external open state.

Use [Modal](modal.md) for controlled dialogs with focus and background management. Use
[Popover](popover.md) for interactive fields and actions next to a named trigger.

## Shared conventions

Use [Toast](toast.md) for controlled notifications with named durations and actions.

[ContentSurround](content-surround.md) renders explicit adjacent document links.
[ContentNavigation](content-navigation.md) owns controlled hierarchical link disclosure.
[ContentToc](content-toc.md) links real semantic anchors with host-owned current state.
[ContentSearch](content-search.md) and [ContentSearchButton](content-search-button.md)
share host-controlled query, visibility and command state.

Use [DashboardGroup](dashboard-group.md) to coordinate controlled regions and
[DashboardSearch](dashboard-search.md) for explicit command and selection state. Its
sidebar, panels, navbar, toolbar and resize controls share an available-width scope.

Use [BlogPost](blog-post.md) and [BlogPosts](blog-posts.md) for editorial entries;
[ChangelogVersion](changelog-version.md) and [ChangelogVersions](changelog-versions.md)
keep ordered release content with explicit dates and display labels.

Use [Drawer](drawer.md) and [Slideover](slideover.md) for controlled edge panels.
[DropdownMenu](dropdown-menu.md) and [ContextMenu](context-menu.md) provide bounded
actions and controlled choices without exposing native event objects.

Use [Carousel](carousel.md) for controlled slides and [Marquee](marquee.md) for pausable
notices. [Chart](chart.md) keeps the original values in an accessible table;
[Table](table.md) supports static data and the controlled DataTable model.

[LocaleSelect](locale-select.md) requests a host-owned language preference.
[ColorModeButton](color-mode-button.md), [ColorModeSwitch](color-mode-switch.md) and
[ColorModeSelect](color-mode-select.md) request palette preferences;
[ColorModeAvatar](color-mode-avatar.md) and [ColorModeImage](color-mode-image.md) render
assets for the explicitly resolved mode.

- Spacing uses named tokens such as `small`, `medium`, and `large`.
- Fields receive a value and a typed change callback.
- Actions receive application callbacks rather than browser event objects.
- Appearance comes from the selected adapter and template.
- Layout behavior belongs to the framework rather than per-view CSS.

Use [VStack](v-stack.md), [HStack](h-stack.md), [Section](section.md),
[SplitView](split-view.md), [Spacer](spacer.md), [Divider](divider.md),
[Toolbar](toolbar.md) and [Viewport](viewport.md) for basic composition.
[CodeBlock](code-block.md) presents source; [CodeEditor](code-editor.md) edits text.
[Navigation](navigation.md), [Toggle](toggle.md), [TextArea](text-area.md),
[SubmitButton](submit-button.md) and [Spinner](spinner.md) retain their existing APIs.

[SelectMenu](select-menu.md) separates controlled selection from search text.
[Listbox](listbox.md) provides inline controlled selection.
