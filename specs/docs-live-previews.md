# Embedded documentation previews

DOCSPREVIEW-001: Every public component reference embeds a live example before its
runnable source. This includes all 132 primary entries and the additional public
components. The preview imports that exact existing TSX example, not another widget. The
static registry is exhaustive against the public component catalog.

DOCSPREVIEW-002: Each frame mounts an isolated ReacdProvider with the shadcn adapter and
its own Jotai store. It supports both shipped templates and reading directions. Visible
compact-appearance and reading-direction controls preserve example state. Application
example code uses public reacd exports. Native bootstrap, iframe markup and containment
belong only to trusted documentation tooling and theme templates.

DOCSPREVIEW-003: The URL accepts only a registered component, a shipped template and a
closed direction. Reject duplicate, unknown or malformed parameters. Never form an
import path from external text. Missing or failed examples expose an accessible error;
loading has an accessible status. Switching examples clears the previous error state.

DOCSPREVIEW-004: Frames have descriptive titles, fluid width and a bounded, scrollable
height. Keyboard focus and scrolling remain usable on narrow screens. The frame's
sandbox permits examples and native forms without top-level navigation. A direct link
opens the identical example. Previews do not replace API documentation with JSON.

DOCSPREVIEW-005: A trusted MkDocs template renders the frame at a maintained marker.
Each reference declares its registry key and includes its actual example source. A local
check rejects missing keys, markers, source includes or compiled exports.

DOCSPREVIEW-006: npm run docs:check builds the preview and strict MkDocs output, copies
only generated preview assets into the generated site, and validates every built
reference frame. npm run check retains this command. There is no deployment step.
Missing tooling, failed compilation, broken frames or absent assets fail the check.

DOCSPREVIEW-007: Generated preview output lives under .cache/docs-preview-dist and
site/assets/previews. These are generated artifacts, not maintained source. All new
runtime modules retain 100% statement, branch, function and line coverage. No runtime
coverage exclusion is added. Native browser acceptance loads the built MkDocs page,
operates its actual frame and confirms independent example state and narrow reflow.
The source-policy discovery includes maintained trusted tooling TSX and HTML templates.

DOCSPREVIEW-008: Preserve root-relative local public assets used by the exact TSX
examples. Copy the declared built public assets to the generated site root. Missing
assets fail the gate. Verify successful placeholder and palette-image requests and
native image decoding in browser acceptance. Deliberately unavailable/undecodable
fallback fixtures remain intentional; do not rewrite example logic to hide failures.

## Initial evidence

The final-review source has 150 public component reference pages. The built Button page
contains its runnable source and no iframe or live preview URL. This contradicts
DOCS-009 through DOCS-011; the separate catalog is not an embedded site preview.
