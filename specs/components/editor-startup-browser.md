# Editor native startup fault acceptance

Status: approved browser contribution; the Editor owner implements recovery.

STARTUP-BROWSER-001: Inject one real SDK startup failure in Chromium by subclassing the
original window MutationObserver before navigation. Throw once only when observe
receives an Element carrying the native ProseMirror class. Delegate every other
observation to the original implementation. Do not mock React children, alter
application source, add public test hooks or introduce arbitrary delay/timeouts.

STARTUP-BROWSER-002: In both templates, the first Project notes native editor must fail
inside its trusted local boundary with a truthful startup diagnostic and real Retry
editor action. Native startup failure cannot crash the page, prevent neighboring Notes
reader use or emit a business edit. Root navigation remains available.

STARTUP-BROWSER-003: While that editor is unavailable, a genuine host replacement must
update the live neighboring reader. Retrying mounts a fresh private SDK view from the
latest controlled host document, with no stale initial value or synthesized edit.
Subsequent native typing updates both views exactly once. Navigating away and back
preserves accepted host data, and the injected fault cannot recur.

STARTUP-BROWSER-004: Preserve the initial production-browser failure as evidence if
startup containment, retry or cleanup fails. Run green acceptance against a fresh
official shared build after the owner fixes real findings. A caught render-only unit
failure does not prove SDK startup containment. No coverage threshold, bundle budget or
timeout is raised. Final official outputs remain coordinator-owned and local.

STARTUP-BROWSER-005: Caret placement must use an explicit editable selection before
suffix typing, independent of operating-system End-key behavior. Preserve the exact
suffix, one business callback and navigation retention assertions. This is a browser
harness correction, not an SDK startup or document synchronization change.
Wait for the genuine formatting capability to be enabled, then observe actual native
selection collapse at the editable content end before typing. Use state assertions,
not arbitrary sleeps or increased timeouts, to distinguish startup readiness from a
document-selection defect.
