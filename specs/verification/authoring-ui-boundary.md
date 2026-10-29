# Application UI dependency boundary

Status: scoped policy gates passed; complete composed acceptance is pending.

## Confirmed escape

A strict TSX application imported Root as Label from installed Radix Label 2.1.17,
placed it inside ReacdProvider/VStack beside a normal reacd Text, and passed the exact
application checker without diagnostics. TypeScript 7 compiled it with strict checks and
jsxImportSource=reacd. Emitted code imported reacd/jsx-runtime. Actual built-package SSR
then emitted a native label supplied by that vendor component.

The unchanged application source hash is
`b1d7a09248a2f6699673dfdbd1dd1664aa59582c99972f016bd59fe56dd24085`. Original source,
compiled output, zero-diagnostic result, type/runtime logs and exact source provenance
are retained in the authoring-boundary proof evidence.

ARCH-005/006 prohibit adapter-specific UI imports in applications. The previous
RAW_RUNTIME check did not match react-label because it required slash or end after
react. Uppercase JSX passed the native-tag check. React component types and non-string
runtime guards intentionally permit business compositions, so they cannot distinguish
this vendor wrapper from an ordinary application composition.

## Correction

Requirements were updated before the exact accepted-source regression was run red. The
new named dependency policy rejects only explicit trusted UI scopes/packages and
framework styling utilities, including package subpaths. The existing import visitor
applies it to static, type-only, reexport, literal dynamic and literal require forms.

Known UI scopes are Radix, Base UI, TipTap, React Aria/Stately and Tailwind's
integration scope. Exact packages cover DayPicker React, react-aria-components,
react-dom, lucide-react, input-otp, clsx, class-variance-authority, tailwind-merge and
tailwindcss. Similar package names outside those exact boundaries remain permitted by
this rule. Named React hooks/types, Jotai, public reacd APIs, local business code and
ordinary validation/date utilities remain available. Repository tests prove that the
same vendor import remains valid in trusted renderer/adapter modules and fails in an
application.

The original source now produces one application diagnostic rather than being accepted.
No public Props, JSX branding, library runtime, package dependency, browser rendering or
styling implementation changed. This remains a checked application source boundary; it
does not claim to sandbox arbitrary third-party wrappers or malicious JavaScript.

## Verification

The first focused red returned no diagnostic for the exact accepted SDK Label source.
After implementation, 96 focused tests across three files pass. The first green run also
revealed diagnostic precedence for TipTap's core package: the old private-path rule
reported it first. The explicit trusted UI rule now owns that diagnostic. Both
intermediate logs are retained.

All 125 tooling tests across six files pass. Each of the eight policy runtime files has
100% statements, branches, functions and lines: 132/102/30/124 measured paths. This
includes the new helper at 5/4/3/5 and the modified application checker at 31/30/8/31.
No thresholds were lowered and no production paths were excluded.

All four strict TypeScript projects, affected typed lint, complete source policy,
schema/example freshness, packed consumer/SSR/export checks and strict MkDocs pass.
Shipped library/UI runtime and package dependencies are unchanged by this overlay; no
new browser or rendering claim is made. The prior 21-path correction batch remains
immutable and its source hashes still match. Complete composed acceptance remains the
integrator's next gate.
