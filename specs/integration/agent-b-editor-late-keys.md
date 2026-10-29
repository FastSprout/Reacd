# Agent B retained Editor menu keyboard callbacks

Date: 2026-10-29. Separate follow-up to the immutable editor-wrapping-late artifact and
EDITOR-MENU-009. A released menu must ignore every retained SDK callback, including
keyboard callbacks; it must not report ownership of a shortcut after its lease or editor
is destroyed. Active menu navigation remains unchanged.

Acceptance uses the same delegated real Suggestion factory and genuine payload captured
from native at-sign typing. Before disposal it retains the actual SDK view and range.
After disposal it invokes retained ArrowDown, ArrowUp and Enter callbacks and requires
false without catalog reads, menu updates or DOM effects. No fake NativeSuggestion,
cast, fabricated SDK state or production test hook is introduced. Both lifecycle cases
fail against the original implementation: .cache/menu-late-keys-before.log reports true
rather than false on ArrowDown.

Chat owns the native fix. The requested design validates nullable current-menu ownership
at the keyboard boundary, passes a nonoptional snapshot to cursor movement, and selects
enabled indices without a mathematically unreachable array fallback. This artifact owns
only its one acceptance test delta and this record. Previous freezes remain immutable.
Parent owns complete runtime coverage and the final browser/package/documentation gates.
All work stays local without commits, pushes, publication, deployment or DNS changes.

The additional menu-navigation-conformance test uses three enabled mentions and a
disabled middle item. Native ArrowDown/ArrowUp skip disabled choices and wrap both ends;
filtering resets the cursor to the first enabled match. Enter inserts the exact
canonical mention atom and suffix. It exercises the iterator nonmatching-position branch
with real supported keyboard interactions.

Final full menu-directory run: .cache/menu-final-proof.log, 34 tests in nine files pass.
Report .cache/menu-final-proof/coverage-summary.json proves each of the six
menu-directory runtime modules, including MenuPlugin, has 100% statements, branches,
functions and lines. This focused command retains global includes and thresholds, so
unrelated unexercised files still cause exit 1; none are excluded. The red late-key
cases now pass under Chat's owned lifecycle/cursor correction. Typed no-ignore lint and
strict whole tsconfig noEmit pass in .cache/menu-late-final-lint.log and
.cache/menu-late-final-types.log. Source policy for these three owned paths is
.cache/menu-late-final-policy.json. Parent's final whole snapshot gates remain separate
from these focused proofs.
