# Embedded MkDocs previews integration

Status: scoped checks pass; final combined acceptance remains pending.

The actual built Button reference contained runnable TSX but no iframe. The saved red
proof is .cache/docs-preview-red.json. DOCS-009 through DOCS-011 and the supplemental
DOCSPREVIEW requirements own this correction.

The exhaustive typed registry maps all 150 public components to existing compiled
example exports. Eight small groups retain literal imports; query text never forms a
module path. Every reference includes its matching source and declares the trusted
MkDocs preview template. The template inserts a titled, sandboxed, scrollable frame
before that source. The dedicated preview build reuses the ordinary vendor groups but
keeps independent relative assets under .cache/docs-preview-dist. Generated assets are
copied into site/assets/previews only after strict MkDocs compilation.

The host uses the trusted existing mount function. Example views use public reacd
components and an isolated ReacdProvider/Jotai store per frame. Loading and failed
imports have separate accessible feedback; a different example clears an earlier
boundary failure. Invalid, duplicate, unregistered or oversized URL queries fail closed.
Both shipped templates and reading directions are accepted through closed parameters.

The main local check now builds documentation before browser acceptance. Its browser
servers serve both the ordinary four-entry production workbench and the generated MkDocs
site. Existing browser cases and fixed bundle budgets are retained. New browser cases
load all 150 actual MkDocs frames and exercise independent Button state plus narrow RTL
Grid behavior, rather than treating schema validity as browser proof.

No deployment, DNS, source runtime coverage exclusion or reduced threshold is added.
Generated .cache/docs-preview-dist and site/assets/previews retain generated formats.
The final combined gate remains required after all review corrections are merged.

## Scoped verification

Final owned checks pass. There are 192 tests across ten files; all 22 executable files
have 100% statement, branch, function and line coverage: 399 statements, 38 branches,
323 functions and 239 lines. Evidence is in .cache/docs-preview-complete-coverage. The
separate existing-consumer run passes 43 tests across fourteen files.

All four strict TypeScript projects pass. Explicit no-ignore typed lint and repository
policy pass, including trusted tooling TSX/HTML. npm run docs:check compiles the
preview, builds strict MkDocs and validates all 150 same-source frames and declared
public assets. Largest preview JavaScript chunk is 473,926 bytes, below the unchanged
500,000-byte limit. Missing, empty or oversized compiled output fails the gate.

Fresh production Chromium passes all 154 cases at one worker and zero retries: all 150
component references plus isolated state, template/direction changes, narrow RTL,
unknown requests, character typing, decoded palette images and root asset requests. Only
three explicitly named unavailable image fixtures are exempt from HTTP-failure
assertions; they demonstrate existing fallback behavior. No scripts/styles are exempt.
The inspected native image screenshot also confirms the palette illustration renders.

Commands and logs:

- node scripts/typecheck.mjs: .cache/docs-preview-types-complete.log
- Explicit oxlint paths: .cache/docs-preview-lint-complete.log
- Policy CLI: .cache/docs-preview-policy-final.log
- Scoped Vitest: .cache/docs-preview-complete-coverage.log
- Existing consumer tests: .cache/legacy-control-consumers-final.log
- node scripts/docs.mjs: .cache/docs-preview-build-budget.log
- Playwright two docs specs: .cache/docs-preview-browser-all.log

## Corrections during verification

The first compiler found invalid test matcher options and a duplicated Editor fixture
entry introduced during overlay merging. These test/configuration mistakes were fixed;
the four-entry workbench and all existing vendor groups are preserved. Typed lint then
required static lazy declarations and an inline memo initializer. The preview registry
now creates stable lazy component types outside rendering, preserving example state.

The first preview build exposed a 517 KB entry. A semantic adapter split reduces that
chunk; the copier enforces the original byte limit instead of suppressing its warning.
The first native image assertion queried the accessible wrapper as an HTML image. Its
HTTP 200 response and screenshot showed the image rendered. The final assertion checks
the actual native descendant, its decoded dimensions and the dark source transition. All
initial diagnostic logs remain local; no failure is presented as a final pass.

The independent source mapping audit matches all 150 entries and 137 TSX modules.
DataTable uses its primary TSX example; optional generative examples remain separate.
Editor mention lookup is an auxiliary recipe outside the 150-component public catalog.
This delivery does not change inventory Verified states or claim whole-project
acceptance. Final Root corrections, combined checks and changed-path review remain.
