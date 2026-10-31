import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, expectTypeOf, it } from 'vitest';
import { ReacdRenderer } from '../generative/renderer.js';
import { GenerativeUI } from '../generative-ui/generative-ui.js';
import type { ThemeAdapter } from '../../renderer/contracts/theme-adapter.js';
import { ReacdProvider } from './provider.js';
import type { ReacdProviderProps } from './provider.js';

it('requires a complete adapter in the public provider type', () => {
  expectTypeOf<ReacdProviderProps>().toExtend<{ adapter: ThemeAdapter }>();
});

it('inherits an explicitly selected application adapter for both transports', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
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
});
