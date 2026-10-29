# Portal-aware native form boundary

This integration delta supersedes the conservative context-only guard recorded in the
frozen auth-media delivery. Public Form/Input/AuthForm props remain unchanged.

## Shared implementation review

Reviewed Agent B's private TrustedFormBoundary, shared context, tests and
display-contents style. Exact upstream SHA256 values are recorded in
`.cache/form-portal-upstream.json`.
The boundary/tests/style were copied at those hashes. The existing single
`src/renderer/form/form-scope.ts` context was retained. B's `.tsx` context was not
added.
The boundary diagnostic maps to current FRAMEWORK_ERRORS.nestedForm.

The logical scope rejects direct native nesting before commit and during SSR. A private
callback ref checks physical native ancestry before allowing a form in a separate
portal. Nested forms inside that portal stay rejected. Hydration preserves stable
initial markup and reports no recoverable errors. Native FormSurface submit handling
prevents default behavior and stops propagation before invoking its zero-argument
capability, preventing an inner portal submit from invoking its logical ancestor.

## Acceptance evidence

- The initial SDK Form/AuthForm portal regression failed against the conservative
  guard: `.cache/form-portal-red.log`.
- Private direct nesting, same-portal nesting, StrictMode, SSR/hydration and SDK portal
  action tests pass. A live compiled Modal/Form/AuthForm journey verifies inner-only
  submission followed by independent outer submission and visible feedback.
- Eight scoped tests across four files cover five runtime files at 100% statements,
  branches, functions and lines: 24 statements, six branches, nine functions and 21
  lines. Report: `.cache/form-portal-coverage/coverage-summary.json`.
- Four production Chromium cases pass at 320px/200% text across both templates and
  scoped directions. They verify a real SDK Modal, physically separate native forms,
  native submission, Escape, independent counters and measured modal/page containment.
  Log: `.cache/form-portal-browser.log`.
- Strict types, source policy, production build and typed lint passed in preflight.
  Complete combined acceptance remains pending the final Toast import.

Preserve this boundary/context and submit propagation handling when importing B's newer
Form implementation. Do not stack a second provider or restore the context-only guard.
