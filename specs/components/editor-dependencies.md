# Private Editor dependency boundary

EDITOR-SDK-001: The trusted adapter pins @tiptap/core, @tiptap/react, @tiptap/pm,
@tiptap/starter-kit and @tiptap/suggestion to 3.32.1. Suggestion supplies the
native trigger/IME/keyboard lifecycle for closed slash/mention/emoji menus. Its required
core/pm peers match these exact pins; its Floating UI DOM peer reuses the existing
compatible installation. Do not expose extension arrays or SDK options in public APIs.

EDITOR-SDK-002: Native clipboard, identity, selection, reorder and suggestion state stay
private to each editor. Application state stores validated reacd DTOs only. No Mention
or Emoji SDK package is added; the reviewed closed atom nodes remain authoritative.
No HTML/CSS or rendering callbacks enter component declarations.

EDITOR-SDK-003: Install into an independent per-agent dependency directory and deliver
manifest/lock additions for deliberate A integration. Keep existing unrelated pins and
bundle budgets. Complete browser/build/package acceptance follows native integration;
a successful install or schema test does not accept menu behavior.

Compatibility sources checked on 2026-10-29:

- https://tiptap.dev/docs/editor/api/utilities/suggestion
- https://registry.npmjs.org/@tiptap/suggestion/3.32.1

The npm registry reports core/pm peers 3.32.1 and @floating-ui/dom ^1.0.0.
The local installation resolves suggestion 3.32.1. No remote publication is performed.
