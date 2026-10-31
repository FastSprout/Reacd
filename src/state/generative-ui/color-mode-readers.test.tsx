import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { ColorModeNodeView } from './color-mode-node-view.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

it('reports unresolved preference, system and asset readers', () => {
  const registry = success(createStateRegistry([]));
  const control = {
    label: 'Appearance',
    value: { state: 'missing', mode: 'readWrite' },
  } as const;
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ColorModeNodeView
        node={{ ...control, type: 'ColorModeButton', systemMode: 'light' }}
        registry={registry}
      />
      <ColorModeNodeView
        node={{
          ...control,
          type: 'ColorModeSwitch',
          systemMode: { state: 'system', mode: 'read' },
        }}
        registry={registry}
      />
      <ColorModeNodeView
        node={{
          type: 'ColorModeImage',
          alt: 'Missing image mode',
          light: '/light.svg',
          dark: '/dark.svg',
          mode: { state: 'system', mode: 'read' },
        }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(3);
  expect(screen.queryByRole('button')).toBeNull();
});
