# Combined composition correction integration

Apply the immutable owned payload against final-review-source, checking every
baseline SHA before modification. Preserve separate Chat/Editor fixes and current
public docs preview metadata/source. The payload has no public docs snapshots.

## Shared Vite addition

Apply only shared-proposals/vite.config.ts.patch: add compositionSafety pointing
to demo/composition-safety.html in the existing ordinary MPA input map. Preserve
index, temporalRecovery, listboxFieldMetadata, editorFieldMetadata and any later
docs preview input, plus all semantic vendor groups and fixed budgets. Do not
copy the isolated Vite snapshot, which predates the Editor fixture input.

The maintained composition fixture, host-event constants and browser suite are
owned payloads. Its explicit host events exercise state changes while a modal
owns pointer focus; final ordinary closing uses actual UI and checks restoration.
No private standalone build or fixture-only browser exclusion is required.

## Public documentation append proposals

Append these short paragraphs to the current references by intent, retaining
preview frontmatter, current source links and all other prose. They describe
existing closed props; no new API table or app HTML/CSS example is needed.

Form (docs/components/form.md):

> Disabled or submitting forms also suspend user interaction in open child
> portals. Submitting retains enabled canonical FormData; disabled omits it.
> Client mounting rejects actual native form ancestry before creating nested
> markup. SSR uses logical form scope, so trusted server markup must avoid raw
> native form ancestors that the server cannot inspect through browser DOM.

Tabs (docs/components/tabs.md):

> Retained inactive panels keep their local state while their child portals
> become inactive. Controlled open intent remains unchanged; returning to the
> panel restores its retained content. Shared fallback content follows the same
> rule, and enclosing inactivity cannot be overridden by selecting a tab.

Modal (docs/components/modal.md):

> Ordinary close restores focus to its active trigger. When an ancestor becomes
> inactive, closing the retained modal does not restore focus into that stale
> scope or reactivate an automatic tab. Host-controlled open intent stays intact.

## Compatibility notes

Form renderer and boundary changes are paired: preserve inherited metadata,
PortalActive propagation, native disabled versus submitting serialization, and
existing zero-argument submission guards. Tabs and the Modal finalFocus guard are
paired: do not accept hiding while retaining stale-scope focus restoration.

Preserve the existing shared metadata helper, Editor effective metadata fix and
Chat loading guards. Time's two private barrels re-export the existing shared
validity/focus helpers; the completion value references DATE_TIME_POLICY. Do not
replace independent Date/Time component declarations. Runtime component-name
imports now use component-names.ts directly, avoiding the type-only catalog cycle.

The generated manifest names six changed executable runtime files, two newly empty
private Time re-exports and two unchanged shared helpers covered by the final
scope. Use the verification record for exact gate counts and physical SSR limits.
This is a narrow source freeze, not root acceptance or inventory verification.
