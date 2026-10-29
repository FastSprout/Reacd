# Marquee

Status: approved curated contract before implementation.

MARQUEE-001: Provide a closed TSX Marquee for a bounded readonly list of unique-id,
nonempty text items. Required label and controlled paused/onPausedChange express host
motion intent. No React children, HTML, links, buttons or arbitrary render functions are
allowed inside moving content. Named core policy owns semantic pace, direction, duration
and repetition behavior.

MARQUEE-002: Explicit Pause/Resume buttons request boolean host updates and never mutate
paused internally. Hover and reading-focus temporarily pause motion. A readable original
content path remains available independently of visual motion. Visual copies are
aria-hidden and inert with no ids or focusable descendants; repeated content must never
produce duplicate accessibility announcements or keyboard stops.

MARQUEE-003: Forced static layout applies for reduced-motion preference and readOnly.
Static mode presents the original text list and explanatory state without dead motion
controls. Unknown preference uses explanatory text without claiming the user requested
reduced motion. SSR uses a deterministic static snapshot; hydration observes the client
media query after hydration without recoverable mismatches. Do not use ambient clocks or
global application stores. Empty lists render explicit empty content without controls.

MARQUEE-004: Forward/backward direction is logical and follows App RTL. Optional pace is
a closed named choice, never duration/pixel/CSS input. Labels wrap, moving content is
contained locally and the readable path never clips long text or widens the page. All
controls retain shared touch targets and visible keyboard focus.

MARQUEE-005: Generative transport uses boolean state references for paused, with
explicit read/readWrite access. Read bindings force static readOnly presentation.
Read/write failures preserve host state. Apps and SSR requests use isolated stores.

MARQUEE-006: Acceptance covers strict text-only schemas, duplicates/budgets, controlled
pause/rejection, readOnly/reduced-motion, media-query updates, accessible original
content, inert hidden copies, actual RTL, long content, SSR/hydration and both
templates. Every owned executable file requires 100% statements, branches, functions and
lines. Schema tests do not prove browser animation or geometry correctness.

Primary reference: official Nuxt Marquee source and WCAG pause/stop/hide requirements.
Interactive moving children and arbitrary animation styling are intentionally excluded.
