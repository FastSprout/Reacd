# PageLogos

Status: implemented in the isolated Agent A batch; verification recorded separately.

LOGO-001: PageLogos requires a nonempty accessible label and a readonly array of
uniquely keyed logo records. Every record requires an approved HTTP(S) or root-relative
image source and meaningful nonempty alternative text. Optional title and emptyLabel
are plain bounded text. No native image attributes, styling bags or vendor props enter
the public contract.

LOGO-002: The first implementation is a static responsive image grid. B's Marquee
accepts text labels only and cannot provide image composition. No marquee option,
fake motion, invented brands or unsupported animation capability is exposed. Empty
collections show an explicit message; failed images retain their alternative text
and reserved dimensions. Changing a source resets its image failure state.

LOGO-003: A private shared SafeImage implementation owns source failure and dimensions
for editorial and logo media. EditorialImage retains its current semantics and public
contract. Media dimensions and defaults have named core ownership. Logos preserve
their intrinsic content with object-fit contain, without cropping or fixed text height.

LOGO-004: TSX is primary. Optional generative transport uses the same keyed image DTOs.
The root label, optional title and empty state are accessible in SSR and hydration.
Heading levels inherit the engine's existing scope. No business state is implicit.

## Acceptance

- Schema rejects duplicate keys, unsafe sources, missing alt, raw classes and HTML.
- Unit tests verify empty, failed, recovered and successful media and keyed identity.
- Shared media regression tests preserve editorial dimensions and failure text.
- Compiled TSX documentation examples use honest unavailable-image placeholders.
- Both templates at 240/320/768/1440 and scoped RTL/LTR, with 200% text, verify real
  geometry and image fallback without document overflow.
- All owned runtime files retain 100% statement, branch, function and line coverage.

Reference: https://ui.nuxt.com/docs/components/page-logos. Static React adaptation
intentionally has no upstream marquee option until image-capable composition exists.
