import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup6 = {
  Banner: previewEntry('examples/banner.tsx', () =>
    import('../../docs/examples/banner.js').then((module) => ({
      default: module.BannerExample,
    })),
  ),
  InputNumber: previewEntry('examples/input-number.tsx', () =>
    import('../../docs/examples/input-number.js').then((module) => ({
      default: module.InputNumberExample,
    })),
  ),
  PinInput: previewEntry('examples/pin-input.tsx', () =>
    import('../../docs/examples/pin-input.js').then((module) => ({
      default: module.PinInputExample,
    })),
  ),
  Pagination: previewEntry('examples/pagination.tsx', () =>
    import('../../docs/examples/pagination.js').then((module) => ({
      default: module.PaginationExample,
    })),
  ),
  Breadcrumb: previewEntry('examples/breadcrumb.tsx', () =>
    import('../../docs/examples/breadcrumb.js').then((module) => ({
      default: module.BreadcrumbExample,
    })),
  ),
  Skeleton: previewEntry('examples/skeleton.tsx', () =>
    import('../../docs/examples/skeleton.js').then((module) => ({
      default: module.SkeletonExample,
    })),
  ),
  Empty: previewEntry('examples/empty.tsx', () =>
    import('../../docs/examples/empty.js').then((module) => ({
      default: module.EmptyExample,
    })),
  ),
  Kbd: previewEntry('examples/kbd.tsx', () =>
    import('../../docs/examples/kbd.js').then((module) => ({
      default: module.KbdExample,
    })),
  ),
  Popover: previewEntry('examples/popover.tsx', () =>
    import('../../docs/examples/popover.js').then((module) => ({
      default: module.PopoverExample,
    })),
  ),
  Chip: previewEntry('examples/chip.tsx', () =>
    import('../../docs/examples/chip.js').then((module) => ({
      default: module.ChipExample,
    })),
  ),
  Tooltip: previewEntry('examples/tooltip.tsx', () =>
    import('../../docs/examples/tooltip.js').then((module) => ({
      default: module.TooltipExample,
    })),
  ),
  Avatar: previewEntry('examples/avatar.tsx', () =>
    import('../../docs/examples/avatar.js').then((module) => ({
      default: module.AvatarExample,
    })),
  ),
  AvatarGroup: previewEntry('examples/avatar-group.tsx', () =>
    import('../../docs/examples/avatar-group.js').then((module) => ({
      default: module.AvatarGroupExample,
    })),
  ),
  RadioGroup: previewEntry('examples/radio-group.tsx', () =>
    import('../../docs/examples/radio-group.js').then((module) => ({
      default: module.RadioGroupExample,
    })),
  ),
  CheckboxGroup: previewEntry('examples/checkbox-group.tsx', () =>
    import('../../docs/examples/checkbox-group.js').then((module) => ({
      default: module.CheckboxGroupExample,
    })),
  ),
  Collapsible: previewEntry('examples/collapsible.tsx', () =>
    import('../../docs/examples/collapsible.js').then((module) => ({
      default: module.CollapsibleExample,
    })),
  ),
  Modal: previewEntry('examples/modal.tsx', () =>
    import('../../docs/examples/modal.js').then((module) => ({
      default: module.ModalExample,
    })),
  ),
  Accordion: previewEntry('examples/accordion.tsx', () =>
    import('../../docs/examples/accordion.js').then((module) => ({
      default: module.AccordionExample,
    })),
  ),
  VStack: previewEntry('examples/v-stack.tsx', () =>
    import('../../docs/examples/v-stack.js').then((module) => ({
      default: module.VStackExample,
    })),
  ),
  HStack: previewEntry('examples/h-stack.tsx', () =>
    import('../../docs/examples/h-stack.js').then((module) => ({
      default: module.HStackExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;
