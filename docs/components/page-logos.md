---
template: preview.html
reacd_preview: PageLogos
reacd_preview_height: 560
---

# PageLogos

PageLogos renders a static, responsive collection of host-supplied images.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-logos.tsx"
```

Required props are label and items. Each item has a unique key, a validated HTTP(S) or
root-relative src, and meaningful alt text. Optional title and emptyLabel provide a
heading and an empty state. The same image DTOs are available in generative transport.

Images reserve intrinsic dimensions and preserve their full content without cropping.
Failed sources expose Image unavailable plus the alternative text. Replacing a source
retries it; stable keys preserve identity when items reorder.

This adapter provides a static grid. It does not expose marquee animation or accept
native image props, HTML, classes or CSS. Supply your own licensed brand assets. The
reference example deliberately uses unavailable-image placeholders and makes no customer
or partnership claim.
