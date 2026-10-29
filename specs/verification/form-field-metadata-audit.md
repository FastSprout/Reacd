# FormField metadata audit candidate

Snapshot: fork-a after Form2, core documentation and literal Badge integration.
This source audit includes a conclusive private browser probe, not final acceptance.
The initial audit did not edit runtime. The scoped correction is recorded below.

## Contract boundary

FORM-FIELD-003 requires disabled OR-composition: a child cannot re-enable a disabled
scope. FORM-FIELD-004 excludes disabled scopes from validation and native FormData.
FORM-FIELD-005 permits legacy grouping before automatic name/required/description
metadata adoption. That exception does not itself prove disabled write safety.

ShadcnFormField provides FieldMetadataContext and a native disabled fieldset.
useFieldMetadata merges the nearest name, required defaults, disabled OR, feedback
and description IDs. It does not clone application children or own application state.

## Direct metadata adoption in current source

| Adapter | Context consumption | Source path below shadcn/ |
| --- | --- | --- |
| Input | direct | input/input.adapter.tsx |
| Textarea | direct | textarea/textarea.adapter.tsx |
| Switch | direct | switch/switch.adapter.tsx |
| Checkbox | direct | checkbox/checkbox.adapter.tsx |
| Select | direct | select/select.adapter.tsx |
| Slider | direct | slider/slider.adapter.tsx |
| ColorPicker | direct | color-picker/color-picker.adapter.tsx |
| FileUpload | direct | file-upload/file-upload.adapter.tsx |

The prefix is src/adapter/shadcn/. ColorModeSwitch and ColorModeSelect delegate to
these private Switch/Select adapters; their own narrower public APIs remain separate.
InputMenu's inherited-field/required correction is being verified independently and
is not silently counted as integrated here. SelectMenu and Listbox remain pending
integration in this snapshot.

## Initial legacy grouping and disabled analysis

InputDate, InputTime, Calendar, InputNumber, InputRating, InputTags, PinInput,
RadioGroup, CheckboxGroup, LocaleSelect, TextArea and Toggle do not directly call
the shared metadata hook. Missing automatic names/required descriptions in those
adapters is a documented legacy exception, not evidence of a newly confirmed bug.

Most of these controls use native input/button descendants. A disabled fieldset
can physically block those controls and omit their native values without an adapter
reading metadata. That does not prove every SDK callback, portal or reset path is safe.
No broad write-safety claim is made for those untested paths.

InputDate and InputTime require a concrete additional check:

- input-date/input-date.adapter.tsx and input-time/input-time.adapter.tsx pass
  only their direct props to the temporal request guard and control renderer.
- temporal/use-temporal-change.ts blocks direct disabled/readOnly props only.
- input-date/date-control.tsx and input-time/time-control.tsx pass those direct
  flags as SDK isDisabled/isReadOnly. Their DateSegment editing uses contenteditables.
- Contenteditable segments are not native form-associated input/button controls.
  Native fieldset omission alone therefore cannot establish callback write safety.
- Single and range modes share this request guard. The initial probe checked single
  date/time first; range/reset behavior received separate correction acceptance.

## Private proof status

.cache/form-field-temporal-proof.mjs uses the existing production workbench with a
public 0.2 FormField disabled scope, bound date/time keys and read-only mirrors.
It makes ordinary clicks and ArrowUp requests, inspects authoritative controlled
hidden values and native FormData, and records focus/SDK attributes. It does not
patch controls, force clicks, inject HTML or change application implementation.

The first fixture incorrectly used Text readers for date/time state kinds and was
rejected before rendering. That setup failure is not evidence of a control leak.
The corrected fixture uses read-only temporal mirrors. Ordinary clicks and ArrowUp
changed controlled date 2026-10-14 to 2026-11-14 and time 12:30:00 to 13:30:00 inside
a disabled FormField. Both segments remained contenteditable and lacked aria-disabled.
Native FormData was already empty; that omission is correct and must remain intact.
Evidence: .cache/form-field-temporal-proof.json and the matching screenshot/log.

This confirms a disabled write leak in InputDate/InputTime, separately from their
documented legacy metadata status. A scoped integration correction now owns metadata
adoption for those two controls. Other legacy controls require independent evidence.

## Scoped correction acceptance

InputDate/InputTime now adopt FormField metadata in single and range modes. Their
entry adapters normalize name/required/disabled before guarded writes and reset.
Private controls apply the same effective metadata to SDK accessibility, segmented
editing, canonical native values and draft validity. Scoped descriptions and errors
reach segments without duplicating group feedback or losing local descriptions.

The correction passes 87 tests across 27 files. Each of four changed runtime files
has 100% statements, branches, functions and lines. Four production Chromium cases
cover both templates and both modes; disabled segments are neither editable nor
focusable, scope feedback is associated and native FormData remains empty. Types,
typed lint, policy, schema/examples freshness, build/bundle, package and strict
MkDocs pass. Full combined project acceptance and other legacy controls remain
separate. Exact evidence and hashes: .cache/batches/temporal-field-metadata/.
