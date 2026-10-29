# Agent B form callback compatibility delta

Date: 2026-10-29. Snapshot: .cache/workspaces/fork-b. This is a separate compatibility
follow-up; frozen Date/InputTime deliveries are unchanged.

Requirements: FORM-CALLBACK-001/002 in specs/components/form-callback-boundary.md.

Existing Toggle spread its onCheckedChange handler into the SDK. Existing Select passed
onValueChange directly. Both now invoke the application callback explicitly with one
logical value. No public prop shape, callback count or state behavior changes.

The SDK-shaped acceptance supplies a second event-details object. Both assertions failed
before the fix: .cache/form-callback-before.log. After the explicit wrappers, all three
tests in two files pass. Real Base UI NumberField/CheckboxGroup and Radix Rating
interactions also assert exact one-value callback argument arrays.

Modified existing paths:

- src/adapter/shadcn/toggle/toggle.adapter.tsx
- src/adapter/shadcn/select/select.adapter.tsx

New paths:

- src/adapter/shadcn/select/callback-boundary.test.tsx
- src/adapter/shadcn/input-number/callback-boundary.test.tsx
- specs/components/form-callback-boundary.md
- specs/integration/agent-b-form-callback.md

Source snapshots before mutation: .cache/form-callback-before/src/. Coverage evidence:
.cache/coverage-form-callback/coverage-summary.json. Both modified executable files
reach 100% statements, branches, functions and lines. The focused command retains the
repository's global coverage configuration and exits 1 for unrelated unexercised files;
it does not establish full-project coverage. Full integrated gates remain parent-owned.

InputNumber, CheckboxGroup, RadioGroup, InputTags, PinInput, Rating, Calendar and the
frozen Date/Time adapters already explicitly project logical values. No change was
needed there. New Switch/Textarea/FormField work is delivered independently.
