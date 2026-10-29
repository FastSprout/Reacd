# Form2 and controlled-selection integration

Status: local source candidate; combined acceptance is pending.
Baseline: immutable fork-a b-combined-source checkpoint. Its manifest includes
20 generated demo-dist files; these are outside maintained source and are not
part of this delivery. Only maintained source/spec/docs deltas are delivered.

Requirements come from the immutable Form2, Checkbox, Select, Slider and
numberRange batches. Their acceptance preceded implementation. Import source
only after payload hash validation. Review extensions to existing modules and
merge shared registrations by intent.

ColorPicker and FileUpload have separate closed TSX modules, schemas, adapters,
compiled references and optional state bindings. FileUpload carries canonical
base64 content with bounded metadata and real native form serialization. Its
fileList state definition reuses the exact validated DTO foundation. Initial
transport budgets remain unchanged; runtime file selection is independent.

Checkbox has its own mixed/read-only binding route. The former generic Boolean
route now handles Toggle only. Its unresolved-binding regression stays present;
Checkbox retains its own separate unresolved-reference acceptance tests.
Select and Slider delegate state validation to their component-owned helpers.
Single callers remain supported; explicit modes add multiple selections and
ordered numeric ranges. NumberRange remains a general readonly data type,
exported publicly without moving component Props into core.

Only numberRange and fileList from the shared state proposal are integrated.
The unavailable richDocument foundation and unfinished Editor surface are not
copied. Existing panelLayout and all temporal/base state kinds remain present.
The registry still validates whole updates before publishing. Source copies and
modified extensions are recorded in .cache/form2-path-review.json.

All five controls are registered in the typed catalog, exhaustive adapter
fixture, generative schema, binding dispatcher, FormNodeView and live Fields
catalog. New CSS and theme variables stay in trusted layers. The existing
reviewed React Aria chunk grouping already covers the Form2 grouping proposal;
no build limit or configuration is replaced.

Source policy and all four strict TypeScript projects pass after reproducing the
already-reviewed two assertion line wraps from fork-a. Logs are retained in
.cache/form2-policy-final-source.log and .cache/form2-types.log. Focused tests,
complete coverage, packed consumer, production browser and final combined checks
are still required. No inventory entry is marked Verified by this record.
