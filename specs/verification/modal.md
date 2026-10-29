# Modal acceptance

Scope: MODAL-001 through MODAL-008, current shadcn adapter, 2026-10-29.
This accepts one required catalog entry, not the complete 132-entry inventory.

- MODAL-001 PASS: named ModalProps and closed TSX declarations compile. Schema tests
  reject missing labels, invalid callbacks, native children, and styling escapes.
- MODAL-002 PASS: Chromium checks programmatic opening, focus containment and return,
  background exclusion, nested Escape dismissal, and accessible dialog semantics.
- MODAL-003 PASS: unit and browser tests cover non-dismissible outside/Escape requests,
  explicit close actions, disabled triggers, and interactive non-modal backgrounds.
- MODAL-004 PASS: both profiles pass eight viewport widths from 240 to 1920, long
  content, fullscreen, and 200% text. Portal tokens update with the host profile.
- MODAL-005 PASS: retained local edits and selections survive reopening; closed
  content is hidden without retaining background locks or an active focus trap.
- MODAL-006 PASS: generative tests validate writable boolean bindings, shared state,
  recursive body/footer actions, missing bindings, and wrong state kinds.
- MODAL-007 PASS: strict types, lint, schema freshness, per-file coverage, compiled
  documentation, packed-consumer SSR, and browser conformance passed.
- MODAL-008 PASS: Select mounts inside the nearest modal host and accepts input.
  Closing a retained host clears its transient menu while retaining selected values.
  Tests also suppress nested dialogs while their ancestor is inactive.

## Commands and runtime evidence

- `npm run check`: passed; 350 tests and 36 Chromium scenarios.
- Per-file coverage: 219 measured runtime files, 100% in all four categories.
- Statements: 1273/1273; branches: 755/755; functions: 394/394; lines: 1160/1160.
- The coverage reporter skips 93 empty files; executable CLI coverage is still pending.
- `npm run test:package`: validates Modal exports, strict TSX, and portal-free SSR.
- `mkdocs build --strict`: passed; compiled example source is embedded in its page.
- Browser tests check native aria-modal, keyboard wrap, dismissal, nested focus,
  retained edits, Select interaction, profile changes, and page/console errors.
- Inspected `.cache/modal-desktop.png`: open Select is above content within the dialog.
- Inspected `.cache/modal-mobile.png`: 320 px and 200% text remain within the dialog;
  vertical scrolling keeps lower controls reachable.
- Final full-check log: `.cache/modal-check.log`; docs log: `.cache/modal-docs.log`.

Browser tests exposed a real mismatch missed by JSDOM: a body-mounted Select list
was behind the dialog and could not receive clicks. The private portal host fixes
stacking and focus containment. A further regression test exposed retained menus after
parent closure; the adapter now resets transient menu state on host visibility changes.
Business values remain controlled by their original state owners.

## UI delivery check

The full technical-catalog checklist and design direction in
[Generative state verification](generative-state.md) remain applicable.
Dials remain ENERGY 1 / RHYTHM 2 / MOTION 1.

- R-03 PASS: dialog containment passes the viewport/text matrix and visual inspection.
- R-25 PASS: text and controls inherit the existing validated template color pairs.
- R-26 PASS: opening, closing, toggles, input, Select, and nested actions change state.
- R-32 PASS: focus wrap, visible focus, nested Escape, and focus return pass in
  Chromium.
- R-33 PASS: portal hosting and geometry are maintained renderer/adapter source.
- R-35 PASS: production build, archive consumer, and all dialog interactions passed.
- R-39 PASS: named fields, title/description, native dialog semantics, and close action
  are exercised by tests; non-modal dialogs expose aria-modal=false.
- Purpose PASS: the overlay identifies the blocked background; dialog elevation
  expresses stacking; the Select chevron communicates a menu; spacing separates
  title, editable content, and actions. Typography and colors inherit the host theme.
- Liveliness PASS: the open dialog provides the focal point; grouped spacing and the
  existing restrained accent support the declared technical-catalog direction.
- C-1 PASS: dialog layout follows editing, nesting, and dismissal tasks.
- C-2 PASS: every added example control has tested behavior.
- C-3 PASS: example copy demonstrates controlled state and retention.
- C-4 PASS: tested widths, profiles, keyboard states, and retention remain functional.
- C-5 PASS: copy makes no invented customer, performance, or compliance claims.

No remote publication occurred. The canonical domain remains configuration only.
