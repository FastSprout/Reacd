import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup7 = {
  Card: previewEntry('examples/card.tsx', () =>
    import('../../docs/examples/card.js').then((module) => ({
      default: module.CardExample,
    })),
  ),
  Grid: previewEntry('examples/grid.tsx', () =>
    import('../../docs/examples/grid.js').then((module) => ({
      default: module.GridExample,
    })),
  ),
  Text: previewEntry('examples/text.tsx', () =>
    import('../../docs/examples/text.js').then((module) => ({
      default: module.TextExample,
    })),
  ),
  Button: previewEntry('examples/button.tsx', () =>
    import('../../docs/examples/button.js').then((module) => ({
      default: module.ButtonExample,
    })),
  ),
  Input: previewEntry('examples/input.tsx', () =>
    import('../../docs/examples/input.js').then((module) => ({
      default: module.InputExample,
    })),
  ),
  SubmitButton: previewEntry('examples/submit-button.tsx', () =>
    import('../../docs/examples/submit-button.js').then((module) => ({
      default: module.SubmitButtonExample,
    })),
  ),
  TextArea: previewEntry('examples/text-area.tsx', () =>
    import('../../docs/examples/text-area.js').then((module) => ({
      default: module.TextAreaExample,
    })),
  ),
  Select: previewEntry('examples/select.tsx', () =>
    import('../../docs/examples/select.js').then((module) => ({
      default: module.SelectExample,
    })),
  ),
  Checkbox: previewEntry('examples/checkbox.tsx', () =>
    import('../../docs/examples/checkbox.js').then((module) => ({
      default: module.CheckboxExample,
    })),
  ),
  Toggle: previewEntry('examples/toggle.tsx', () =>
    import('../../docs/examples/toggle.js').then((module) => ({
      default: module.ToggleExample,
    })),
  ),
  Slider: previewEntry('examples/slider.tsx', () =>
    import('../../docs/examples/slider.js').then((module) => ({
      default: module.SliderExample,
    })),
  ),
  Form: previewEntry('examples/form.tsx', () =>
    import('../../docs/examples/form.js').then((module) => ({
      default: module.FormExample,
    })),
  ),
  Section: previewEntry('examples/section.tsx', () =>
    import('../../docs/examples/section.js').then((module) => ({
      default: module.SectionExample,
    })),
  ),
  Page: previewEntry('examples/page.tsx', () =>
    import('../../docs/examples/page.js').then((module) => ({
      default: module.PageExample,
    })),
  ),
  Toolbar: previewEntry('examples/toolbar.tsx', () =>
    import('../../docs/examples/toolbar.js').then((module) => ({
      default: module.ToolbarExample,
    })),
  ),
  Divider: previewEntry('examples/divider.tsx', () =>
    import('../../docs/examples/divider.js').then((module) => ({
      default: module.DividerExample,
    })),
  ),
  Spacer: previewEntry('examples/spacer.tsx', () =>
    import('../../docs/examples/spacer.js').then((module) => ({
      default: module.SpacerExample,
    })),
  ),
  SplitView: previewEntry('examples/split-view.tsx', () =>
    import('../../docs/examples/split-view.js').then((module) => ({
      default: module.SplitViewExample,
    })),
  ),
  Viewport: previewEntry('examples/viewport.tsx', () =>
    import('../../docs/examples/viewport.js').then((module) => ({
      default: module.ViewportExample,
    })),
  ),
  Badge: previewEntry('examples/badge.tsx', () =>
    import('../../docs/examples/badge.js').then((module) => ({
      default: module.BadgeExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;
