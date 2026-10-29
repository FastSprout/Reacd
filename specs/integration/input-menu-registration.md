# InputMenu private registration correction

Date: 2026-10-29. Baseline: input-menu-contract-overlay over input-menu-candidate.
This delivery stays local and does not mark the complete application accepted.

The hook owns highlighted/composition ref writes through typed operations.
This satisfies typed immutable-hook lint without suppressions or public changes.
The official Autocomplete.Clear registers the private control. Its SDK handlers
are canceled before one logical clear request; accepted clearing focuses the input.
A host veto retains text, focused control and the open popup without extra callbacks.

The first new browser query expected Clear in the active-popup accessibility tree.
SDK FloatingFocusManager intentionally scopes that tree to the input and popup.
Those two failed discovery queries are retained as evidence, not a runtime defect.
The final production test proves Escape dismisses the popup, Tab focuses the named
Clear control, Space empties the value and restores input focus, and typing works.
Both profiles pass, with the nine existing production cases: 11 Chromium passes.

The final changed-file coverage run passes 23 tests across seven files. Both owned
modified runtime files are 100% in statements, branches, functions and lines:
85 statements, 85 branches, 20 functions, 74 lines. Typed lint, four strict type
projects, build and packed consumer pass. Policy and strict MkDocs also pass.
No threshold, timeout, runtime coverage exclusion or native application escape
was added. Final complete combined gates and independent review remain pending.
