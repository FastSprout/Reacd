# Official shadcn registry sources

Revision: `c0d63c339d6cd2fc26135590a54cf1f362269451` in https://github.com/shadcn-ui/ui.

License: MIT; retained in LICENSE.md.

The following additions/updates preserve official component code. Imports are
relocated to local utils/button modules. The upstream radix-ui namespace imports
are resolved to their corresponding official @radix-ui/react-* packages.
No control rendering, keyboard, focus or portal mechanism is replaced.

- `input-otp.tsx`: `apps/v4/registry/new-york-v4/ui/input-otp.tsx`
  SHA-256: `9f81898aeaabbb104cc22ffda551a333eb22608c543c4800412e2faaa802e311`
  The adapter uses the exported render/context API for visual masking only;
  native slot state, caret, selection and editing remain owned by input-otp.

- `dialog.tsx`: `apps/v4/registry/new-york-v4/ui/dialog.tsx`
  SHA-256: `2ade6074e5fad0a4eb171ead44c43d3301a3c83d186d7236fb1fdbea80ee556b`
- `radio-group.tsx`: `apps/v4/registry/new-york-v4/ui/radio-group.tsx`
  SHA-256: `cfc4f99ee68be2fbbd70de3ffad82e1462d5e8e0bb0aecfd190a4f5115325862`
- `spinner.tsx`: `apps/v4/registry/new-york-v4/ui/spinner.tsx`
  SHA-256: `5d040fc49cb54c0296070644053b5a8840ddbfca89a430546bf308df3fffad65`
- `slider.tsx`: `apps/v4/registry/new-york-v4/ui/slider.tsx`
  SHA-256: `6a531f6182de6efec2c25d30a7626b66cbf11cf52d505e47f907124934f7188e`
- `popover.tsx`: `apps/v4/registry/new-york-v4/ui/popover.tsx`
  SHA-256: `3f99d3add6c9fa4f03721e81297ee10e1310785ee1d9d9d4c82a114d84ab0757`

## Documented SDK composition extensions

- DialogContent exposes optional showOverlay and forwards forceMount to its
  existing official Portal, Overlay and Content. This maps reacd overlay and
  retained-content variants without replacing any SDK focus or dismissal logic.
- Slider forwards its existing aria-label to the official SDK thumbs, matching
  the declared accessible control name without a custom interaction engine.
  Its optional thumbProps forwards the official Thumb API for SDK form refs
  and logical ARIA metadata; native thumb geometry and interactions are unchanged.
- Progress forwards its existing value to the SDK Root as well as the official
  Indicator, keeping SDK completion/indeterminate state aligned with the value.

## Additional official compositions

- `form.tsx`: `apps/v4/registry/new-york-v4/ui/form.tsx`
  SHA-256: `dfa22e6614b807df60bbe7e40dd44ef74cf894b358f37c3ed356ebbeef9b4599`
- `table.tsx`: `apps/v4/registry/new-york-v4/ui/table.tsx`
  SHA-256: `bd1a9fc83a5a2149e504038e274bb7e5a0351af59f6896df52ac4d5b439695ac`
- `skeleton.tsx`: `apps/v4/registry/new-york-v4/ui/skeleton.tsx`
  SHA-256: `f51ce0fcd31e5c31437382e80ea0af94b4fc3d64221d27091d36824546780a43`
- `avatar.tsx`: `apps/v4/registry/new-york-v4/ui/avatar.tsx`
  SHA-256: `0c5c48b8a1dff4fdc5ff9b6cb79cc9cd138682b7d86868068f571befe9675e88`
- `aspect-ratio.tsx`: `apps/v4/registry/new-york-v4/ui/aspect-ratio.tsx`
  SHA-256: `b1c157886236782cb92d8fbcd4749532aaf6d8aabefd6e157ca40358f902f407`
- `tooltip.tsx`: `apps/v4/registry/new-york-v4/ui/tooltip.tsx`
  SHA-256: `611e4305879b2773eafe76bf3c5caa69d8e47367fd97887a71634a27828f4433`
- `kbd.tsx`: `apps/v4/registry/new-york-v4/ui/kbd.tsx`
  SHA-256: `c0c0ae6a7d1adb7749b9b34cab8f4d2f5caf333e819b64c2051e77f918d3661f`

TooltipContent exposes showArrow around its existing official Arrow. This maps
the canonical arrow option without replacing SDK positioning or interaction.
DialogContent additionally forwards overlayClassName to its existing native
Overlay. The adapter uses this SDK className API for reduced-motion preference.
- `field.tsx`: `apps/v4/registry/new-york-v4/ui/field.tsx`
  SHA-256: `4a4d17fcb933513f637f9f7e2daf5d8348f7de086b29738337dec7e6dd1819a0`
- `native-select.tsx`: `apps/v4/registry/new-york-v4/ui/native-select.tsx`
  SHA-256: `4bdbce5575dce610fed747df4547a3d494713f4df8d28e09b3ccee62e4d72f93`

NativeSelect exposes htmlSize on its existing native select, wrapperClassName on
its existing wrapper and showIcon around its existing decorative icon. These SDK
configuration forwards support inline listbox composition; no native interaction,
focus, keyboard or form behavior is replaced.
- `empty.tsx`: `apps/v4/registry/new-york-v4/ui/empty.tsx`
  SHA-256: `54f529ccf72c18c4b5abd5586a7cf1f2a4c8d207aac366029d66ed095cb2965d`

SelectContent, PopoverContent, TooltipContent and DialogContent forward container
to their existing official Portal. Table forwards containerProps to its existing
native scroll wrapper. These expose SDK-supported native portal/attribute APIs
without custom portal, focus, keyboard, scrolling or table rendering engines.

## Documentation chrome additions

Same pinned revision as above; imports only relocated to local modules and the
corresponding official Radix package. No widget behavior or styling changed.

- `sheet.tsx`: `apps/v4/registry/new-york-v4/ui/sheet.tsx`
  SHA-256: `ea473d38a26a9b0b879e5a13139899ad45e9782e896b3fa205c7763a6c506876`
- `navigation-menu.tsx`: `apps/v4/registry/new-york-v4/ui/navigation-menu.tsx`
  SHA-256: `fbe81d7c358df0d21e49b03174ef53be7d66226a3dce1a97ff3d4a260ed833a3`
- `command.tsx`: `apps/v4/registry/new-york-v4/ui/command.tsx`
  SHA-256: `319e9264567dd46f04d705028bc345470663ca5919f31292c4ec43ea5ceb9336`

- `scroll-area.tsx`: `apps/v4/registry/new-york-v4/ui/scroll-area.tsx`
  SHA-256: `8b73bb9be51300079c7f561bafbe43ee10f6f464cf39c8c1b25123cd4edb94dd`

ScrollArea forwards viewportProps to its existing official Viewport. This exposes
native label, focus and attribute APIs without replacing scrolling or keyboard.

## Prose typography composition

The owned prose/typography.tsx and prose inline/block recipes adapt the semantic
Typography recipes from the same pinned revision, not a common renderer painter:
`apps/v4/registry/new-york-v4/examples/typography-demo.tsx` and the associated
Typography heading/large/small examples. Content is parameterized; h5/h6 preserve
semantic levels while using the documented large/small recipes. Table, Checkbox
and Separator use the actual vendored SDK components above. Structured syntax
spans contain escaped text and validated color literals, never highlighted HTML.

SheetContent forwards container to its existing official Portal, preserving native
containment and theme ownership for nested framework header navigation.

## Additional native controls

Same pinned revision; imports only relocated to local modules and the official
Radix dependency. Native interaction and rendering are unchanged.

- `collapsible.tsx`: `apps/v4/registry/new-york-v4/ui/collapsible.tsx`
  SHA-256: `c6598e5584f4258b5d9fefadbc5ad6a66888ad58729f4b634a0bb2d9c513188b`
- `pagination.tsx`: `apps/v4/registry/new-york-v4/ui/pagination.tsx`
  SHA-256: `224843c4f509e8b8c9848adefa43d1491846f0851138fa9b51cc6ba1319c5653`

InputNumber composes official Base UI NumberField render slots with these actual
shadcn Input/Button/Field components. Base UI owns parsing, localized formatting,
stepping, nullable values and constraints; no numeric interaction is recreated.

## Navigation and keyboard notation

Pinned revision remains c0d63c339d6cd2fc26135590a54cf1f362269451. Imports are
relocated to local utils and the equivalent official Radix Slot package only.

- `breadcrumb.tsx`: `apps/v4/registry/new-york-v4/ui/breadcrumb.tsx`
  SHA-256: `c75fcd3d9e8470188bc0dd4b27a2b26fff3ad42b9c9c534a953dc090ae2cba33`
- `kbd.tsx`: `apps/v4/registry/new-york-v4/ui/kbd.tsx`
  SHA-256: `c0c0ae6a7d1adb7749b9b34cab8f4d2f5caf333e819b64c2051e77f918d3661f`

## Native overlays

Same pinned revision; imports relocated to local utils and official native Radix
packages. Existing Popover/Sheet expose Portal forceMount alongside Content, and
Sheet exposes showOverlay. New recipes expose native Portal container/forceMount
and existing overlay configuration. Drawer forwards native Portal options.

- `hover-card.tsx`: `apps/v4/registry/new-york-v4/ui/hover-card.tsx`
  SHA-256: `73f59aa759656501ed615604ac3f2c04ba564acaea4529288fe3a487ad934953`
- `drawer.tsx`: official resolved `registry/base-nova/ui/drawer.tsx` from
  `https://ui.shadcn.com/r/styles/base-nova/drawer.json`
  SHA-256: `bf78b90781d6000c16d299f938875767356a250799909f56f0a783b172489f00`
  Template: `apps/v4/registry/bases/base/ui/drawer.tsx` at the pinned revision.
  Template SHA-256:
  `7180299dff3cc1659ab75130f0521ba485e18b38625b904e1da4049f23479060`

No focus, timers, dismissal stack, positioning or swipe behavior is replaced.

## Native chat recipes

Same pinned revision c0d63c339d6cd2fc26135590a54cf1f362269451. Sources are
under `apps/v4/registry/new-york-v4/ui/`. Imports move to local utils/Button
and the equivalent official Radix Slot package. Default action icon sizes map
to the existing SDK Button's supported `icon` size; no behavior is replaced.

- `message-scroller.tsx`: SHA-256:
  `9f7580a8c9a59d28c30da4974a7d17bfe3a710ee945fc72765e8721cd1a6669a`
- `message.tsx`: SHA-256:
  `64e9ae0f9d1e268b0ed7b738a53d374d273fe1e7e2dd7b35ad7417e50a9bbe6c`
- `attachment.tsx`: SHA-256:
  `243feb168430d01288586d2460822e7789ffde8ebf2d0c436fa73c59c3d764e5`
- `bubble.tsx`: SHA-256:
  `df1e461e33e835b7f69296939c2325e8cd76941b5ec69375d80d639793c5c4e2`

MessageScroller delegates scroll state/measurement/following to the separately
pinned official `@shadcn/react` 0.3.1 package. The adapter uses its supported
scroll command hook with a native SDK Button to preserve focus. It contains no
replacement scroll-follow engine. Vendored recipes retain upstream formatting.

## Native dropdown menus

Pinned revision c0d63c339d6cd2fc26135590a54cf1f362269451:
`apps/v4/registry/new-york-v4/ui/dropdown-menu.tsx`.
SHA-256: `d954efb735f13734751207ad22cb0cddd7f6ec53c59d16675d103dae08cb61fb`.
Relocate cn and the equivalent official Radix package import. Expose the native
Portal container option through Content; no selection or interaction changes.

## Native resizing

`resizable.tsx` uses the same pinned revision, source path
`apps/v4/registry/new-york-v4/ui/resizable.tsx`. Only the utils import is relocated.
SHA-256: `aaf3ea20e8060c75dd86e06fedfca053d49f81071123ba647b5699efcbc010ea`

react-resizable-panels owns all sizing, pointer and keyboard interaction.

## Controlled native ContextMenu

- `context-menu.tsx`: official resolved `registry/base-nova/ui/context-menu.tsx`
  from `https://ui.shadcn.com/r/styles/base-nova/context-menu.json`
  SHA-256: `5be9c316de7e552c1a80e8d3ac8b1a94f9e6692b884632c47a14e9e8e5db0b22`
  Template: `apps/v4/registry/bases/base/ui/context-menu.tsx` at the pinned revision.
  Template SHA-256:
  `e4359306eb2242681388aa1b3a541de49dce46c375db1593f8d3362f6bb023ca`

Imports are relocated; generated icon placeholders resolve to their declared
Lucide icons. ContextMenuContent forwards supported Portal container and native
Positioner collisionPadding and anchor. Native menu, keyboard, gesture and portal
behavior is unchanged. The adapter supplies controlled business values and SDK
callbacks.

## Native multiple selection and thumb metadata

- `base-select.tsx`: official resolved `registry/base-nova/ui/select.tsx`
  from `https://ui.shadcn.com/r/styles/base-nova/select.json`.
  SHA-256:
  `6918ba753234e510c57db3fe395f8b67936421db1efa2ed88694d186aa736c59`
  Template: `apps/v4/registry/bases/base/ui/select.tsx` at the pinned revision.
  Template SHA-256:
  `6348d30035b68867d5efffe9b0b1611718226bef9fdeef9554349d6b98252110`

Imports are relocated and declared Lucide icon placeholders resolved. Content
forwards the supported Portal container option. Base UI owns selection, popup,
readonly and native repeated form inputs; no custom behavior is introduced.

Slider's optional thumbProps forwarding also accepts an indexed callback to
forward supported native Thumb name, identity and accessibility properties.
The native Root preserveThumbOrder API owns no-swap interaction behavior.

## Native selection composition

Official Base Nova resolved sources from ui.shadcn.com/r/styles/base-nova/:

- combobox.json, registry/base-nova/ui/combobox.tsx
  SHA2560df11848e07ee063e55845f475fe89797299079b0951a016a0784ddd832aff65
- input-group.json, registry/base-nova/ui/input-group.tsx
  SHA256d6c74e82a2aa02980b337da519fc5b74dfc841e92453e32dd241e6baa1d9d9a6
- button.json, registry/base-nova/ui/button.tsx
  SHA256313353436d0fcc8e44ab470adb614b9fd013d28626f624328ea0d66d41a6c81b
- input.json, registry/base-nova/ui/input.tsx
  SHA256dab990dfefa0ba78854ab6602ad074270dba9d7d1262184d9bfbb62bd990903b
- textarea.json, registry/base-nova/ui/textarea.tsx
  SHA25682601c91ffc6c727d924162c78d7cb853114bcced4e2eb922a68ca12d4239c0f

Templates correspond to bases/base/ui files at the existing pinned revision.
Imports relocate and declared Lucide placeholders resolve. ComboboxContent
forwards supported native Portal container; ComboboxChip forwards supported
ChipRemove props for accessible names. Native focus/keyboard/selection unchanged.

## Calendar native SDK recipe

- `calendar.tsx`: `apps/v4/registry/new-york-v4/ui/calendar.tsx` at the same
  pinned revision. SHA-256 of the upstream source:
  `78ed2cc49dafc5bb5df7b1d4a325e5fc314237386747362e5f0761a2c539a934`.
- Imports relocated to local Button/utils and the official @daypicker/react
  re-export package. Index-signature accesses use brackets for strict typing.
- CalendarDayButton forwards an optional buttonRef to its actual native Button,
  composing the existing internal ref and retaining upstream focused-day effects.
  It does not replace any keyboard, selection or focus behavior.
- The focused modifier is assigned to a local constant before its effect,
  preserving behavior while allowing the strict hook dependency lint to verify it.
- Canonical adapter data-day overrides the recipe's ambient locale-only marker.
  Captions/labels use explicit Gregorian Intl and UTC through native SDK APIs.

## Native Chart

Pinned revision c0d63c339d6cd2fc26135590a54cf1f362269451:
`apps/v4/registry/bases/base/ui/chart.tsx`.
SHA-256: `cdaa7c2e82aaf7b233c4764cf506cd9912aa1a49d5a02d4fd2f9a8c134687877`.
The cn import is relocated. Private chart.types.ts replaces unsafe inherited
Tooltip/Legend metadata types with the curated string/number key and typed raw
record contract; formatter types match the unchanged raw-payload runtime call.
Only type imports/annotations change; automatic-JSX ESM transforms before/after
are byte-identical. No rendering, style, callback or SDK behavior is rewritten.
Native ChartContainer/ResponsiveContainer and
its supported initialDimension API are unchanged. Recharts 3.10.1 owns all plot
scales, paths, markers, bars and sectors; adapter SVG definitions configure native
fill patterns only. No handwritten plotting or interaction engine is added.

## Native Toast

Pinned revision c0d63c339d6cd2fc26135590a54cf1f362269451:
`apps/v4/public/r/styles/new-york/toast.json`, file `ui/toast.tsx`.
Upstream source SHA-256:
`723d1642dc0505f598126581b27cf8a9f2a1ee383af5b3af06d3b908d9728e4a`.
Only the cn import relocates. Original generated formatting is retained.
Exact @radix-ui/react-toast 1.3.1 owns controlled Root, collection, clocks,
announcements, focus and swipe. The official shadcn legacy recipe is deprecated
in favor of Sonner; shadcn states no technical or security rationale for that
recommendation. The maintained Radix primitive supplies the controlled API.
No module-global useToast reducer or Toaster is imported. Per-Surface bounded
FIFO admission is pure data; native interaction behavior is not replaced.

## Native Base UI DropdownMenu

`dropdown-menu.tsx` now uses the official Base Nova recipe from
`https://ui.shadcn.com/r/styles/base-nova/dropdown-menu.json`, source path
`registry/base-nova/ui/dropdown-menu.tsx`.
Resolved upstream source SHA-256:
`ba92acc16e141ad77880f8c4a27f9854b8024075130df6f04b6b0bf9cfa9d3f2`.
Its template at pinned revision c0d63c339d6cd2fc26135590a54cf1f362269451 is
`apps/v4/registry/bases/base/ui/dropdown-menu.tsx`, SHA-256:
`18c1829679694a9b9850afcabf1158a80ec3624fb5e03d0d4b13339b729e0503`.

The cn import relocates and declared icon placeholders resolve to Lucide icons.
DropdownMenuContent forwards the supported native Portal container plus
Positioner collisionPadding and collisionAvoidance props. The remaining recipe
keeps official rendering, styling, animation, focus, pointer and keyboard APIs.
The adapter configures native placement-axis shifting for narrow submenus.
No custom popup offsets, transforms, gesture or focus engine is introduced.
Existing MIT license and generated vendor-source exclusions still apply.
