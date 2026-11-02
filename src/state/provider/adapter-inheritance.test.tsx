import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { render, screen } from '@testing-library/react';
import { expect, expectTypeOf, it } from 'vitest';
import { ReacdRenderer } from '../generative/renderer.js';
import { GenerativeUI } from '../generative-ui/generative-ui.js';
import type { ThemeAdapter } from '../../renderer/contracts/theme-adapter.js';
import { Text } from '../../components/text/text.js';
import { ReacdProvider } from './provider.js';
import type { ReacdProviderProps } from './provider.js';

it('accepts an omitted adapter while retaining the explicit adapter contract', () => {
  expectTypeOf<ReacdProviderProps>().toExtend<{ adapter?: ThemeAdapter | undefined }>();
  render(
    <ReacdProvider>
      <Text>Default SDK content</Text>
    </ReacdProvider>,
  );
  expect(
    screen.getByText('Default SDK content').closest('[data-adapter]'),
  ).toHaveAttribute('data-adapter', 'shadcn-ui');
});

it.each([shadcnAdapter, muiAdapter])(
  'inherits the explicit $id application adapter for both transports',
  (adapter) => {
    render(
      <ReacdProvider adapter={adapter}>
        <ReacdRenderer
          document={{
            schemaVersion: '0.1',
            templateId: 'saas-modern-light',
            root: { type: 'Text', content: 'Legacy inherited' },
          }}
          actions={{}}
        />
        <GenerativeUI
          document={{
            schemaVersion: '0.2',
            state: [],
            root: { type: 'Text', content: 'Stateful inherited' },
          }}
        />
      </ReacdProvider>,
    );
    expect(screen.getByText('Legacy inherited')).toBeVisible();
    expect(screen.getByText('Stateful inherited')).toBeVisible();
    for (const label of ['Legacy inherited', 'Stateful inherited']) {
      expect(screen.getByText(label).closest('[data-adapter]')).toHaveAttribute(
        'data-adapter',
        adapter.id,
      );
    }
  },
);
