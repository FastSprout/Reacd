# Color mode components

Status: specified for Agent B implementation; integrated acceptance is separate.

COLOR-001: ColorModeButton, ColorModeSwitch and ColorModeSelect are controlled TSX
components. Required value is light, dark or system; required resolvedMode is light or
dark. The host passes onValueChange with exactly one declared preference value.
Explicit light/dark preferences must agree with resolvedMode. System resolution is
supplied by the host so SSR does not read an ambient browser preference.

COLOR-002: Button switches to the opposite resolved mode and has a visible host label.
Switch represents dark mode as checked and requests explicit light/dark preferences.
Select offers System, Light and Dark with host-overridable closed labels. Disabled and
readOnly prevent writes. Readonly controls retain focus and allow inspecting choices.
Adapters expose no HTML, styling props, vendor details or native events.

COLOR-003: ColorModeAvatar and ColorModeImage require explicit resolved mode plus light
and dark HTTP(S) or root-relative sources. Avatar reuses the verified initials fallback
and logical size contract. Image has required alt, logical aspect ratio and reserved
intrinsic dimensions. Failed images retain an accessible text fallback. A mode/source
change resets image loading/failure state without rendering a stale previous source.

COLOR-004: Jotai owns a preference atom scoped to each application store. useColorMode
takes explicit systemMode and returns value, resolvedMode and setValue. No persistence,
document mutation or global theme service is implicit. Host TSX applies the resolved
design template through Theme or ReacdProvider. Validated templates own their complete
palette and contrast; controls never invert colors or rewrite CSS.
useColorMode requires ReacdProvider and uses that application's explicit store, even
inside a nested foreign Jotai Provider. It never falls back to a shared global store.

COLOR-005: Optional useSystemColorMode takes a required server fallback. It subscribes
to prefers-color-scheme after hydration with useSyncExternalStore, returns that fallback
on the server, updates on system changes and releases listeners. Missing browser media
support uses the same explicit fallback. Every application remains independently scoped.

COLOR-006: Generative value uses existing text-kind bindings in read/readWrite mode.
The required systemMode is a light/dark literal or read binding. The bridge computes
resolvedMode from preference and systemMode, keeping ordinary preference writes atomic.
Asset mode is a resolved literal or read binding. Enum constraints protect host writes.
No SDK instances, functions, media queries or local CSS enter JSON.

COLOR-007: Acceptance covers closed props, preference consistency, exact callback
arguments, host rejection, protection, system updates, image errors/source changes,
isolated stores, SSR/hydration and live template changes preserving application state.
Both profiles, both palettes, narrow screens, 200% text, RTL, keyboard and themed option
portals receive real browser checks. All executable files require 100% in four metrics.

References checked 2026-10-29:

- https://ui.nuxt.com/docs/components/color-mode-button
- https://ui.nuxt.com/docs/components/color-mode-switch
- https://ui.nuxt.com/docs/components/color-mode-select
- https://ui.nuxt.com/docs/components/color-mode-avatar
- https://ui.nuxt.com/docs/components/color-mode-image
- https://react.dev/reference/react/useSyncExternalStore

React adaptation: controlled declarations and isolated Jotai preference replace the Nuxt
color-mode plugin. System fallback and template mapping remain explicit host choices.

COLOR-008: Passive outlined mode buttons explicitly use the template foreground.
Unhovered and unfocused dark-mode text must not fall back to native ButtonText. Browser
acceptance waits for hover transitions to settle and measures the actual control color
against its actual background, rather than checking token values alone.
