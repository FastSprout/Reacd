import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { templates } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';
import { ShadcnTheme } from './theme.adapter.js';

it('scopes native SDK tokens without shared control rendering', () => {
  const view = render(<ShadcnTheme>Content</ShadcnTheme>);
  expect(screen.getByText('Content')).toBeVisible();
  view.rerender(<ShadcnTheme template={templates['erp-compact']}>Content</ShadcnTheme>);
  expect(screen.getByText('Content')).toHaveAttribute('data-adapter', 'shadcn-ui');
});
