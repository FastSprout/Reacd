import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { BoundText } from './bound-text.js';
import { BoundInput } from './bound-input.js';
import { BoundBoolean } from './bound-boolean.js';
import { BoundSlider } from './bound-slider.js';
import { BoundProgress } from './bound-progress.js';

const READ = { state: 'missing', mode: 'read' } as const;
const WRITE = { state: 'missing', mode: 'readWrite' } as const;

const examples: readonly ((registry: StateRegistry) => ReactNode)[] = [
  (registry) => <BoundText registry={registry} reference={READ} />,
  (registry) => (
    <BoundInput
      registry={registry}
      node={{ type: 'Input', label: 'Name', value: WRITE }}
    />
  ),
  (registry) => (
    <BoundBoolean
      registry={registry}
      node={{ type: 'Toggle', label: 'Enabled', checked: WRITE }}
    />
  ),
  (registry) => (
    <BoundSlider
      registry={registry}
      node={{ type: 'Slider', label: 'Amount', value: WRITE, min: 0, max: 100 }}
    />
  ),
  (registry) => <BoundProgress registry={registry} label="Amount" reference={READ} />,
];

describe('binding boundary failures', () => {
  it.each(examples)(
    'reports unresolved state instead of rendering invalid controls',
    (example) => {
      const result = createStateRegistry([]);
      if (!result.success) throw new Error('Expected an empty registry');
      render(
        <ReacdProvider adapter={shadcnAdapter}>{example(result.data)}</ReacdProvider>,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    },
  );
});
