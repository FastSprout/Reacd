# Renderer contract

RENDER-001: The renderer depends on components, schemas, and core contracts. It does not
import a concrete theme adapter or the state layer.

RENDER-002: The renderer defines the adapter-facing rendering interface. The selected
implementation is supplied from the composition root.

RENDER-003: Normal TSX and generative JSON dispatch to the same component contracts and
rendering behavior. There is no second JSON-only design system.

## Layout invariants

RENDER-004: Text and layout children may shrink to the available width. Long unbroken
strings wrap without escaping their allowed content region.

RENDER-005: Stacks and grids grow with content. Grid columns are an upper bound, not a
command to keep unreadable columns on small containers.

RENDER-006: Padding respects available container space. Nested containers remain bounded
at the largest permitted token scale.

RENDER-007: Deliberate local scrolling is restricted to components whose contract allows
it. Hiding overflow globally is not an acceptable repair.

Native form bridge inputs must stay inside their control's containing block in
LTR and RTL. Vendor inline translations must not enlarge document scroll bounds.
Physical directional effects must follow the nearest direction provider, even
when language and direction differ. Build-time CSS transforms must not replace
explicit writing direction with a language-based approximation.

RENDER-008: Focus indicators, control targets, labels, reading order, and keyboard
operation survive adapter and design-template changes.

RENDER-012: Slider thumbs are positioned within their own track container at every
supported width and text scale. Native checkbox targets are at least the named control
target size on both axes. Browser geometry checks include interactive descendants, not
only their layout wrappers.

RENDER-013: Toggle thumbs remain fully contained within their track at all supported
text scales. Checked and unchecked positions map to opposite inset edges, including
right-to-left direction. Track dimensions and thumb inset derive from named core
policy. Browser geometry checks exercise both states before and after 200% text.

## Private implementation

DOM elements, ARIA attributes, browser event handlers, refs, and engine CSS are private
rendering concerns. They are not application authoring APIs.

RENDER-009: Each rendered component implementation has a separate module. Shared
geometry and formatting helpers remain independently testable modules.

RENDER-010: Escape text content through the platform renderer. Never interpret
application strings as HTML or execute strings as code.

RENDER-011: Rendering errors are observable and structured. Unknown declarations are
rejected rather than rendered as arbitrary fallback HTML.

RENDER-014: Loading messages use polite status semantics without marking the status
itself permanently busy. Where content is being modified, mark that content's subtree
busy and keep its loading message outside the busy subtree.

## Evidence

Central renderer and adapter tests cover narrow, intermediate, wide, nested,
long-content, zoomed-text, keyboard, and error cases. Applications reuse this evidence
instead of rebuilding visual safeguards for every view.

This reduces application-specific visual work. It does not prove that a browser engine,
font, adapter, or untested interaction can never contain a defect.
## Callback boundary

RENDER-015: Trusted native event handlers invoke application callbacks with exactly the
documented logical arguments. Zero-argument actions receive no event or vendor detail
object. Value changes receive only their declared value. Accepting a callback with rest
arguments must not reveal native objects hidden by the public TypeScript signature.

Acceptance includes real DOM activation of Breadcrumb, FooterColumns and page title
actions. Each callback receives an empty argument list. Other families follow the same
boundary without changing their public signatures.
