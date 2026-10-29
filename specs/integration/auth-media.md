# AuthForm and PageLogos integration

Frozen two-component delivery from `.cache/workspaces/layout`. Import only the exact
paths in `.cache/batches/auth-media/manifest.json`. Shared files are merge proposals;
do not replace the integrating snapshot's complete aggregates. All work remains local.

## Contracts and implementation

- AuthForm has schema-derived named props, closed safe content slots, uniquely keyed
  provider actions and one engine-owned submit control. Existing Form/Input public
  contracts are unchanged. Business values and authentication remain host-owned.
- Native required/email validation works. Loading/disabled block fieldsets, providers
  and submission, including direct submit events. Error/status announcements are plain
  text. Provider and submit callbacks receive zero native arguments.
- Optional 0.2 transport uses registered submit/provider actions and read-only boolean
  loading/disabled references. Every child/content slot is traversed for prevalidation.
  Own-property action lookup is repeated on activation, so deleted/inherited handlers
  cannot execute. Credential children keep their independently defined state bindings.
- PageLogos is a static responsive keyed image collection. Explicit label/alt/source,
  empty state, failed-image text and source-change retry are supported. B's Marquee is
  text-only; no unsupported image animation or fabricated brand content is claimed.
- Private SafeImage is shared with EditorialImage. Named core media dimensions retain
  editorial 640/360 behavior and reserve logo 160/80 dimensions. Core editorial aliases
  now reference the shared source of truth. Native rendering stays in trusted layers.

## Shared FormSurface hardening

The integrating agent approved this private renderer delta before implementation.
Public B Form/Input contracts are unchanged. A FormScopeContext replaces an inner
FormSurface with a diagnostic, preserving the outer form and preventing invalid native
nesting and duplicate submission through arbitrary safe child composition. Direct TSX
and generated nested AuthForm DOM/SSR regressions pass. The original failing regression
is recorded in `.cache/auth-media-nesting-red.log`.

Exact pre-change SHA256 values:

- `src/renderer/form/form.renderer.tsx`:
  `58e5a117a7d44affcea22b26dfcbcf0228a8323671ddb2c78dbfec8338ea7e15`
- `src/core/errors.ts`:
  `72e1f9118fed4338b7f5823725d6518cc6bc62c8fbcb17b39d29ab561ff2e749`

Merge the private context, FormSurface guard/provider and nestedForm diagnostic into
any newer B form implementation, preserving its public contract and newer behavior.

## Aggregate additions

- Add AuthForm/PageLogos imports, named props, component names, SDK exports, shadcn
  registry entries, exhaustive examples, style imports and MkDocs navigation.
- Add AuthFormNode directly to the recursive union and PageLogosNode as a leaf;
  add both runtime factories to the existing discriminated union.
- Visit AuthForm leading/header/footer in addition to generic children. Its action
  references contain submitAction and every provider action. Boolean flag bindings
  require boolean kind/read mode.
- Route AuthForm to AuthFormNodeView with registry/actions/renderChild. PageLogos
  needs only its scalar DTO props. Preserve all other root/B union and dispatch cases.
- Add the AuthMediaExamples demo mount after existing layout examples. Compile the
  two docs examples and include their colocated tests and browser conformance file.
- Reuse the previously accepted `@source inline('sr-only')` adapter rule. AuthForm
  uses it for the native fieldset legend; no arbitrary styling escapes are exposed.
- Do not copy the old snapshot's PageHeading or Button callbacks. The integrating
  snapshot already has hardened logical callback wrappers; preserve them.

## Verification evidence

- 112 focused unit, consumer, example, SSR, hydration and adapter-conformance tests
  pass in 16 files. Dedicated tests verify isolated Jotai credential values, stable
  hydration, exact zero-argument submit/provider callbacks and form nesting rejection.
- All 24 component/shared executable files have 100% statement/branch/function/line
  coverage. Four type-only/barrel files are empty. Totals: 88 statements, 43 branches,
  35 functions and 83 lines. Scope: `.cache/auth-media-owned.json`; report:
  `.cache/coverage/auth-media/coverage-summary.json`.
- Strict types, actual lint, source policy, production build, packed TSX consumer and
  strict MkDocs pass. Logs use the `.cache/auth-media-` prefix and the suffixes
  `{types,lint,policy,build,package,docs}.log`.
- Sixteen final production Chromium cases pass: both templates, 240/320/768/1440,
  scoped LTR/RTL and 200% text. Tests exercise required/email validity, native Tab/Enter
  submission, independent providers, blocked controls, keyed logo reversal, actual
  lazy-image failure, retained values on appearance changes and measured containment.
- Browser log: `.cache/auth-media-browser.log`. Inspected Compact 320px RTL screenshot:
  `.cache/auth-media-Compact-320-rtl.png`. Preview 5176 terminates after the run.

## Antislop delivery gate

- Hard gate PASS: measured mobile containment and keyboard journeys pass; examples
  explicitly identify local authentication actions and unavailable image placeholders.
  No new assets, customer claims, dead links, unsolicited motion or palette overrides.
- Purpose gate PASS: no gradients, decorative icons, glows or template animations were
  introduced. Existing template typography, contrast-validated colors and spacing apply.
- Liveliness PASS: approved technical catalog direction remains ENERGY 1 / RHYTHM 2 /
  MOTION 1. The form title anchors hierarchy; spacing groups providers, fields and
  feedback. Existing primary intent identifies actions without decorative branding.
- Craftsmanship PASS: both templates/directions and keyboard/error/loading/disabled/
  empty states are covered; reference content is explicit and factual. Native image
  dimensions reserve space; shared failure handling and callback boundaries are tested.

The integrating snapshot still owns combined coverage, generated schema freshness,
browser regressions and inventory acceptance. This scoped delivery is not a claim that
schema validation proves layout correctness or that enterprise scope is complete.
