# Editor session conformance addendum

Status: approved test-only gap closure. Native Editor owners retain implementation.

SESSION-CONFORMANCE-001: Real private session acceptance exercises empty/code/plain
paste and inherited/stored marks without clipboard HTML execution. Empty paste emits no
business callback. Code line endings normalize canonically. A stored formatting mark
survives plain paste; existing text marks apply when stored marks are absent.

SESSION-CONFORMANCE-002: Read-only, disabled and inactive scope transitions guard
private paste/drop/update hooks, cancel owned drags and reconcile host data without
business writes. Selection-only updates cannot publish a stale native document against
the controlled host value. Matching atomic selection updates publish one exact logical
EditorEdit, never a browser event or SDK object.
Returning to the exact host selection before reconciliation emits no redundant atomic
proposal.

SESSION-CONFORMANCE-003: Call genuine registered private drop hooks to exercise local
accepted reorder, no-op, foreign and missing targets without relying on JSDOM native
hit-testing. Such tests establish capability behavior only; the separate Chromium drag
scenarios prove actual pointer interaction. No private SDK values become public props.

SESSION-CONFORMANCE-004: Preserve structural NodeSelection across host reordering.
Removing its logical block falls back to a valid selection without callbacks or stale
IDs. Record actual uncovered counters and real defects separately from harness issues.
No production changes, coverage exclusions, lowered thresholds or increased timeouts
belong to this slice. New tests stay colocated with the native session module.
