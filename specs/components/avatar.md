# Avatar

AVATAR-001: Provide separate named Props/schema/TSX modules. Require a nonempty name
as the accessible identity. Optional src accepts absolute HTTP(S) or root-relative URLs
without credentials, backslashes, or controls. Reject native attrs, events, CSS, and
unknown props. No arbitrary icon, markup, image-optimizer, or mask escape is public.

AVATAR-002: Support logical small/medium/large sizes and optional bounded fallback text.
Generate at most two Unicode graphemes from first/last words, or the first two graphemes
of a single word. Uppercasing cannot expand the result beyond the limit. Named core
policies own sizes, fallback limits, and default values; template variables apply them.

AVATAR-003: The shadcn adapter follows its Base UI Avatar recipe. Keep fallback visible
while loading and after error; loaded images replace it. Changing source/name updates
the existing avatar correctly. Hide broken-image icons. Every state keeps one accessible
identity and a stable square footprint, independent of intrinsic image dimensions.

AVATAR-004: TSX and generative 0.2 share one contract/adapter. Generative declarations
validate source, names, fallback, and size before rendering. SSR includes fallback and
image dimensions; client hydration preserves identity without recoverable mismatch.

AVATAR-005: Require schema/type, Unicode, load/error/source-change, full per-file
coverage, adapter, portable schema, archive SSR, hydration, compiled documentation,
and browser containment/interaction acceptance at both profiles and 200% text.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/avatar
- https://ui.shadcn.com/docs/components/base/avatar
- https://base-ui.com/react/components/avatar

Nuxt native image attrs, CSS masks, color utilities, and optimizer-specific props are
adapter concerns. Tooltip and Chip remain separate required catalog entries; accepting
Avatar does not accept those integrations. Sample images are labeled local placeholders.
