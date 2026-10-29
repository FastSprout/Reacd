import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup8 = {
  Alert: previewEntry('examples/alert.tsx', () =>
    import('../../docs/examples/alert.js').then((module) => ({
      default: module.AlertExample,
    })),
  ),
  Progress: previewEntry('examples/progress.tsx', () =>
    import('../../docs/examples/progress.js').then((module) => ({
      default: module.ProgressExample,
    })),
  ),
  Spinner: previewEntry('examples/spinner.tsx', () =>
    import('../../docs/examples/spinner.js').then((module) => ({
      default: module.SpinnerExample,
    })),
  ),
  Tabs: previewEntry('examples/tabs.tsx', () =>
    import('../../docs/examples/tabs.js').then((module) => ({
      default: module.TabsExample,
    })),
  ),
  Navigation: previewEntry('examples/navigation.tsx', () =>
    import('../../docs/examples/navigation.js').then((module) => ({
      default: module.NavigationExample,
    })),
  ),
  Link: previewEntry('examples/link.tsx', () =>
    import('../../docs/examples/link.js').then((module) => ({
      default: module.LinkExample,
    })),
  ),
  CodeBlock: previewEntry('examples/code-block.tsx', () =>
    import('../../docs/examples/code-block.js').then((module) => ({
      default: module.CodeBlockExample,
    })),
  ),
  CodeEditor: previewEntry('examples/code-editor.tsx', () =>
    import('../../docs/examples/code-editor.js').then((module) => ({
      default: module.CodeEditorExample,
    })),
  ),
  Table: previewEntry('examples/table.tsx', () =>
    import('../../docs/examples/table.js').then((module) => ({
      default: module.TableExample,
    })),
  ),
  DataTable: previewEntry('examples/data-table.tsx', () =>
    import('../../docs/examples/data-table.js').then((module) => ({
      default: module.DataTableExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;
