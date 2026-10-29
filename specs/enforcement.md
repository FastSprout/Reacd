# Architectural enforcement

ENFORCE-001: The dependency checker parses TypeScript syntax. It checks static imports,
re-exports, import types, dynamic imports, and CommonJS require calls. Type-only imports
obey the same layer direction as executable imports.

ENFORCE-002: Internal layer imports cannot use the public facade to bypass direction
checks. An unknown internal directory is an error, not an exemption. Layer order is
`core`, `schema`, `components`, `renderer`, `adapter`, `state`.

ENFORCE-003: Application checks reject native JSX, spread JSX attributes, styling props,
CSS imports, direct DOM globals, private framework imports, React createElement, raw JSX
runtimes, and dangerouslySetInnerHTML.

ENFORCE-004: Application TSX uses a closed reacd JSX namespace. Native tag names also
fail at runtime. Business components and React fragments remain supported. The JSX
runtime belongs to the components boundary and must not import adapters.

ENFORCE-005: Runtime component declarations validate properties using strict schemas
before invoking the rendering port. Native React children and unknown properties are
errors. Missing providers fail with an actionable diagnostic.

ENFORCE-006: Checkers have positive and negative fixtures for each rule. Their
diagnostics include filename, position, and rule identifier. Build commands return a
failing status for violations; checks must not silently skip files.

ENFORCE-007: Source checks apply the 300-line, 88-column, two-space policy to maintained
files. Named generated/vendor exclusions are documented in quality policy and never used
for owned rendering or component code.

ENFORCE-008: A component catalog reports implementation and verification separately. All
132 pinned Nuxt UI entries stay in scope until accepted.
