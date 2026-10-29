# Generative state verification

Scope: GENSTATE-001 through GENSTATE-018 and RENDER-012 in the current catalog. This is
not acceptance of the entire enterprise component inventory.

GENSTATE-019 is also accepted by the compiled `docs/examples/generative-state.tsx` and
`docs/examples/generative-table.tsx` with colocated tests. Two editors and a reader
share `customer.name`; `service.status` rejects component writes but permits a
registered host refresh. The table example declares all five kinds/keys and verifies
selection preservation plus pagination reset through actual adapter controls.

## Behavioral evidence

- Unique keys, kinds, modes, permissions, budgets, and readonly snapshots:
  `src/schema/state/` and `src/state/registry/` tests.
- Several writers/readers and constrained host updates:
  `src/state/generative-ui/use-bound-value.test.tsx` and
  `src/state/generative-ui/generative-ui.test.tsx`.
- Stable sorting, typed filters, pagination, selection, dataset refresh, atomic failure,
  and active constraints: `src/state/data-table/` tests.
- Independent JSON Schema validation: `src/schema/generative-v2/json-schema.test.ts`.
- Closed Props, read-only bindings, and immutable query types:
  `src/state/generative-ui/public-types.test.ts`.
- SSR hydration and request/client isolation:
  `src/state/generative-ui/hydration.test.tsx`.
- Both visual profiles, controls, JSON validation, table interactions, and geometry:
  `demo/e2e/workbench.spec.ts`.
- Public guides: `docs/guides/generative-ui.md` and `docs/components/data-table.md`;
  internal contracts remain outside public docs.

## UI direction

Existing technical catalog for application developers, using the approved closed
component system. ENERGY 1 / RHYTHM 2 / MOTION 1. The editor and rendered view are the
main comparison; green identifies primary actions. Monospace marks source. Cards group
related controls. Motion is limited to interaction feedback.

## antislop delivery check

- R-02 PASS: English interface copy uses plain punctuation.
- R-03 PASS: 18 Chromium scenarios check containment and enlarged text.
- R-17 PASS: displayed row counts derive from explicitly labeled sample data.
- R-18 PASS: the catalog contains no testimonials or invented customers.
- R-23 PASS: the view uses the requested reacd name and existing catalog navigation.
- R-24 PASS: the local documentation link returns HTTP 200.
- R-25 PASS: template validation checks both profiles' text/control contrast.
- R-26 PASS: browser flows exercise actions, fields, filters, sorting, and paging.
- R-27 PASS: DataTable tests cover loading, empty, error, and ready states.
- R-28 PASS: the technical catalog has no filler FAQ.
- R-32 PASS: browser flows exercise keyboard slider control and visible focus.
- R-33 PASS: corrections are maintained renderer CSS and adapter source.
- R-34 PASS: both existing token profiles pass the browser matrix.
- R-35 PASS: production build and browser interaction checks passed locally.
- R-36 PASS: public copy makes no security or performance certification claims.
- R-37 PASS: work extends the established catalog direction described above.
- R-38 PASS: example rows are labeled Sample; no fabricated social proof appears.
- R-39 PASS: named controls, native semantics, focus, and targets are tested.
- R-40 PASS: this view introduces no media, remote scripts, or performance claims.
- R-01 PASS: no decorative gradient or glow was introduced.
- R-04 PASS: shadcn chevrons indicate menus; checkmarks indicate selection.
- R-06 PASS: monospace is restricted to editable source code.
- R-07 PASS: no decorative grid or blueprint background was introduced.
- R-08 PASS: text action labels describe the operation without arrow decoration.
- R-09 PASS: no promotional pill or duplicate title badge was added.
- R-10 PASS: panels use solid surfaces, with no glass effect.
- R-12 PASS: existing low panel shadows distinguish grouped surfaces.
- R-13 PASS: controls use focus outlines rather than decorative glow.
- R-14 PASS: panels follow editor/control content rather than equal feature cards.
- R-19 PASS: reduced-motion CSS disables motion; no new animation was added.
- R-22 PASS: no stock illustration was introduced.
- DIALS PASS: ENERGY 1, RHYTHM 2, MOTION 1 retained in the existing catalog.
- FOCUS PASS: source and rendered output remain the main comparison.
- SPACE PASS: stack and card gaps separate controls through design tokens.
- ACCENT PASS: the existing primary action color is retained.
- IDENTITY PASS: component-only source/result comparison defines this workbench.
- READ PASS: the existing technical-catalog direction is recorded above.
- C-1 PASS: component choices follow state editing, display, and query needs.
- C-2 PASS: enabled controls have tested transitions or registered actions.
- C-3 PASS: added content demonstrates named state and table transitions.
- C-4 PASS: browser geometry and interactions pass for both token profiles.
- C-5 PASS: row counts describe local sample records only.
- R-05 PASS: the page is a technical workbench, with no marketing filler sections.
- R-11 PASS: existing component radii remain token-driven, without capsule styling.
- R-15 PASS: labels name operations such as Save note, Sort Amount, and Next page.
- R-16 PASS: public copy describes behavior without promotional AI claims.
- R-20 PASS: the paired declaration/output editor has a product-specific purpose.
- R-21 PASS: the existing two light token profiles remain explicit choices.
- R-29 PASS: colors come from the validated template contract.
- R-30 PASS: the page extends reacd's existing workbench structure.
- R-31 PASS: typography, spacing, and surfaces use the established adapter system.

Screenshots inspected: `.cache/generative-desktop.png` and
`.cache/generative-mobile.png`. The desktop slider regression and checkbox target
regression failed against the previous build. Corrected browser checks pass.
