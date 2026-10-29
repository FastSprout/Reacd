# Final browser integration corrections

The unfiltered v2 diagnostic ran all 1,041 Chromium scenarios: 995 passed and
46 failed. Preserve its log and artifacts under .cache/combined-final-browser*.
These results are diagnostic, not final acceptance.

FINAL-BROWSER-001: Keep adjacent Listbox and SelectMenu example switches uniquely
named for their region/record domains. Update meaningful example acceptance before
changing the two visible labels. Preserve controlled value and protection outcomes.

FINAL-BROWSER-002: LocaleSelect browser setup opens its mounted Actions and feedback
family. Preserve every original native interaction and geometry assertion.

FINAL-BROWSER-003: The long-content workbench journey expands every visible Full
text disclosure, with containment checked after each expansion. Require at least
one disclosure, preserve the original long-text expansion and cover the additional
Text example rather than selecting an arbitrary first match.

FINAL-BROWSER-004: Sidebar/Splitter geometry may classify a native SDK mirror only
after real-browser rectangle and clipping evidence. Keep the one-pixel tolerance,
all actual controls and visible/unclipped negative probes. Do not skip generic
hidden elements or weaken the document scroll-width assertion.

The parent independently replayed Sidebar/Splitter at 240px in Chromium. Exactly
two escaped rectangles were fixed one-pixel Base UI Select inputs at x=0..1, with
aria-hidden true, tabindex -1 and clip-path inset(50%). Visible controls and text
stayed inside x=21.4375..218.5625. Evidence: root
.cache/workspaces/sidebar-offender-proof/sidebar-offender.log. Reuse one shared
test-only classifier with AuthForm; add a Sidebar-specific negative browser probe
for visible and unclipped hidden escapes. Runtime styling remains unchanged.

Acceptance after correction: six example tests pass; both changed executable
examples reach 100% in all four metrics (68 statements, 22 branches, 11 functions,
64 lines). Four strict type projects, official typed lint, policy and ordinary
production build pass. Largest production chunk remains 450,036 bytes.

All 87 affected Chromium scenarios pass with four workers, including every
previously failing class, both templates, all original keyboard/native/business
assertions, AuthForm's negative probe, the new Sidebar negative probe and the
existing display-contents overflow regression. No timeout, retry, threshold or
coverage exclusion changed. The full unfiltered browser inventory is now 1,042.
Full fresh combined coverage and official gates remain pending at this freeze.

The fresh unfiltered v3 unit run passes all 2,783 tests across 907 files, with
1,405 executable files at all-four 100%. Packed consumer and compiled strict
MkDocs checks also pass. The subsequent complete four-worker browser diagnostic
passes 1,020 and fails 22; every failure is in the MkDocs catalog file. Actual
traces show ERR_CONNECTION_RESET and ERR_SOCKET_NOT_CONNECTED on local Python
server assets, causing failed lazy imports or missing theme functions. No native
component scenario fails. Preserve .cache/combined-final-browser-v3.log/artifacts.

Adopt BROWSER-EXECUTION-001 before a fresh complete default-worker run. No
production implementation, test assertion, timeout, retry or scope changes. The
v3 executable coverage remains applicable by exact runtime-source hash identity.
