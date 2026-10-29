# Closed selection data contracts

SELECTION-001: Provide a reusable strict readonly SelectionOption DTO with canonical
nonempty value, visible label, optional description and disabled. Values are unique
within a readonly bounded catalog. Labels may normalize surrounding whitespace;
canonical values must reject surrounding whitespace rather than silently changing keys.
Core SELECTION_POLICY owns catalog/key budgets and the empty single-value sentinel. No
icons, HTML, render callbacks, arbitrary metadata or styling enter this shared DTO.

SELECTION-002: Single selection is a string key or exact empty string. Multiple
selection is a readonly unique string-key array; empty array means unselected. Values
must exist in the current catalog. Export selectionOptionsSchema,
singleSelectionValueSchema(items) and multipleSelectionValueSchema(items). Factories
validate catalogs before creating membership constraints. No public SDK objects.

SELECTION-003: Disabled options cannot be newly selected through user interaction.
Previously controlled disabled values remain valid and retain form data, avoiding silent
data loss when availability changes. Removal/clear remains a logical request. Export
canRequestSelection(previousKeys,nextKeys,items) for trusted adapters; reject
unknown/duplicate/newly-disabled keys while preserving existing disabled selections.

SELECTION-004: These are data contracts, not a global component Props object. Select,
InputMenu, SelectMenu and Listbox each retain their own named Props/schema/module and
interaction requirements. A owns the latter three after its assigned scope. Callbacks
receive canonical logical values only; mode-specific schema/state contracts remain
explicit. Use existing text and selection state kinds.

SELECTION-005: Acceptance includes closed DTOs, canonical key normalization, catalog
uniqueness/budgets, single/multiple membership/empty values, duplicate rejection,
immutable output and interaction availability. JSON Schema proves structural bounds;
catalog membership and canonical/ordering semantics are runtime checks. Require 100%
per-file statements, branches, functions and lines.
