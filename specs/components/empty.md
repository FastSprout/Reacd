# Empty

EMPTY-001: Provide a separate closed schema, named Props/function, adapter and tests.
Require a nonempty title. Accept description, safe leading/body/actions/footer content,
logical small/medium/large size and outline/solid/soft/subtle/naked variants. No raw
tags, icons, styles, dimensions, vendor slots or native event props are public.

EMPTY-002: Render a named region with stable title/description relationships. Actions
remain actual reacd controls with logical callbacks. Optional loading and loadingLabel
communicate a busy operation without silently disabling or activating child controls.
Loading owns no business transition. Decorative media must use its own safe contract.
Mark the body busy, not the whole region containing the live status. Keep the status
outside any busy subtree so assistive technology need not defer its message.

EMPTY-003: Long title, description, media, content and action labels wrap within the
container at narrow widths, RTL and enlarged text. Variants express token-based border
and surface emphasis; child controls retain their own validated palette. Sizes use
named policies, not public CSS. There is no fixed panel height or hidden action text.

EMPTY-004: Follow shadcn Empty's header/media/title/description/content composition.
Preserve safe child state across loading, variant and template changes. SSR/hydration
preserves identity and application isolation. The title stays visible while busy.

EMPTY-005: Generative 0.2 recursively validates all leading/body/actions/footer nodes,
including missing registered actions. Loading accepts a literal or boolean read
binding. A display cannot mutate that state; host operations validate its kind.
Use the same complete adapter as TSX, not an independent renderer implementation.

EMPTY-006: Require schema/type/meaningful action tests, full per-file coverage,
portable schema, packed consumer, hydration, compiled documentation and browser
acceptance at both templates, eight widths, RTL and 200% text. Verify busy changes,
keyboard actions, safe media, closed props and host-controlled values.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/empty
- https://ui.shadcn.com/docs/components/base/empty

Nuxt's leading/avatar, body, actions and footer slots become safe component content.
Arbitrary icon values are replaced by composing existing closed media components.
Variants carry surface intent rather than matching upstream utility classes.
