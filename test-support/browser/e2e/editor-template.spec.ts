import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from '@playwright/test';
import { Editor, ReacdProvider, Theme, templates } from '../../../src/index.js';
import { templateSchema } from '../../../src/schema/design/templates.schema.js';
import { UnsupportedAdapterComponentError } from
  '../../../src/core/unsupported-adapter-component-error.js';
import { openUnsupportedExample } from '../native-capabilities.js';

const SPACING_REM = 4;
const TEXT = 'Unbroken_editor_content_'.repeat(20);

for (const profile of ['saas-modern-light', 'erp-compact'] as const) {
  test(`${profile} SSR reports the selected native Editor gap at maximum spacing`,
    async ({ page }, testInfo) => {
      const adapter = testInfo.project.name === 'mui' ? muiAdapter : shadcnAdapter;
      const template = templateSchema.parse({
        ...templates[profile],
        spacing: { small: SPACING_REM, medium: SPACING_REM, large: SPACING_REM },
      });
      let diagnostic: unknown;
      try {
        renderToString(createElement(ReacdProvider, { adapter },
          createElement(Theme, { template }, createElement(Editor, {
            label: 'Template boundary',
            value: { version: 1, blocks: [{ type: 'paragraph', id: 'intro',
              content: [{ type: 'text', text: TEXT }] }] },
            onValueChange: () => undefined,
          })),
        ));
      } catch (error) {
        diagnostic = error;
      }
      expect(diagnostic).toBeInstanceOf(UnsupportedAdapterComponentError);
      expect(diagnostic).toMatchObject({
        adapterId: adapter.id, componentName: 'Editor',
        message: `Adapter "${adapter.id}" does not support component "Editor".`,
      });
      await openUnsupportedExample(page,
        profile === 'erp-compact' ? 'Compact' : 'Spacious',
        'Content and data', 'Editor');
      await expect(page.locator('[data-adapter]').first())
        .toHaveAttribute('data-adapter', adapter.id);
    },
  );
}
