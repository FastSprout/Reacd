# CommandPalette

Status: specified Agent A implementation batch. Root acceptance is pending.

COMMAND-001: CommandPalette is an inline, closed command-search component. Its required
label visibly names the search input. query/onQueryChange are controlled by the host.
ContentSearch and DashboardSearch may compose it with Modal; palette itself does not
install global shortcuts or claim ownership of a dialog's open state.

COMMAND-002: Keyed groups contain globally unique keyed command items with labels,
optional plain descriptions/keywords, disabled flags, and either safe href or onPress.
An optional onSelect(key) runs before any target. False vetoes all engine selection
effects. The engine captures the target before invoking the callback. If no item target
exists, the declaration requires onSelect. No Promise return is supported; an invalid
runtime callback return must fail closed before any command action/navigation occurs.

COMMAND-003: Group, per-group, total-item, query and visible-result limits are named
core policies. Local filtering normalizes Unicode diacritics and casing without ambient
locale, requires all query tokens, and ranks exact/prefix label matches first, retaining
declaration order for ties. Admission to the visible-result budget is ranked across all
groups, so earlier description matches cannot exclude later exact or prefix matches.
Visible groups retain declaration order; each group ranks its admitted items locally.
External filtering preserves host order without interpreting the query. This
deterministic text search replaces Nuxt's Fuse-based fuzzy matching.

COMMAND-004: Base UI owns inline combobox/listbox semantics and active option focus.
Keyboard arrows and Enter activate enabled commands, pointer activation has the same
veto semantics, and IME composition cannot submit a command prematurely. Selection does
not replace the controlled query with a command label. Native browsing operations belong
to Link/NavigationMenu; palette href targets are explicit same-window command actions.
The private input boundary respects native isComposing even when Enter uses key code 13
rather than 229. Browser acceptance includes that native Chromium event sequence.

COMMAND-005: status is ready/loading/error. Loading and error states have visible,
accessible messages and block stale result activation while allowing query edits unless
globally disabled. Empty results are announced. All labels/descriptions wrap, the list
has an engine-bounded scroll region, and input/popup layout uses no public CSS props.

COMMAND-006: Each module has its own schema-derived Props, public TSX component, shadcn
entry, consumer tests, reference page and runnable Jotai example. HTML/CSS/DOM, vendor
callbacks/types, custom renderers and filter functions remain private.

COMMAND-TRANSPORT-001: Optional JSON binds query to readWrite text state. An optional
selection readWrite text binding records accepted keys; initial empty text is allowed,
and other values must identify declared commands. A rejected write vetoes activation.
Item actions are registered names and validated before partial rendering. Actions may
read the selected key from state; no action context expansion or state kind is required.

Acceptance covers schema rejection, total budgets/global key uniqueness, deterministic
matching, no-op prevention, callback veto and invalid return, safe captured navigation,
pointer/keyboard/IME, all status modes, shared write refusal/recovery, SSR/hydration,
both templates, scoped RTL, narrow layouts, long text and 200% text. All owned
executable files require 100% statements, branches, functions and lines.

Primary references retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/command-palette.md
- https://ui.shadcn.com/docs/components/base/command
- https://ui.shadcn.com/docs/components/base/combobox
- https://base-ui.com/react/components/combobox

shadcn Command uses cmdk; this adapter uses already installed Base UI's inline combobox
primitive and shadcn input styling rather than adding another private interaction
engine. The distinction and the local matching adaptation must remain explicit in public
docs.
