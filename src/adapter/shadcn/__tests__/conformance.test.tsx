import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { COMPONENT_NAMES } from '../../../components/component-names.js';
import { Button, ReacdProvider, ReacdRenderer } from '../../../index.js';
import { documentWith } from '../../../../test-support/documents.js';
import { EXAMPLES } from './examples.js';

describe('complete adapter contract', () => {
  it('has an exact implementation and example for every reacd declaration', () => {
    expect(Object.keys(shadcnAdapter.components).sort()).toEqual(
      [...COMPONENT_NAMES].sort(),
    );
    expect(Object.keys(EXAMPLES).sort()).toEqual([...COMPONENT_NAMES].sort());
  });

  it.each(COMPONENT_NAMES)('renders %s through the shadcn adapter', (name) => {
    const { container } = render(
      <ReacdProvider adapter={shadcnAdapter}>{EXAMPLES[name]}</ReacdProvider>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(container.querySelector('[data-adapter="shadcn-ui"]')).toBeInTheDocument();
    expect(
      renderToString(
        <ReacdProvider adapter={shadcnAdapter}>{EXAMPLES[name]}</ReacdProvider>,
      ),
    ).toContain('data-adapter="shadcn-ui"');
  });

  it('uses the selected adapter for TSX and generative declarations', () => {
    const receive = vi.fn();
    const adapter = {
      ...shadcnAdapter,
      id: 'conformance',
      components: {
        ...shadcnAdapter.components,
        Button: {
          name: 'Button' as const,
          render(properties: unknown) {
            receive(properties);
            return shadcnAdapter.components.Button.render(properties);
          },
        },
      },
    };
    const action = vi.fn();
    render(
      <ReacdProvider adapter={adapter}>
        <Button label="TSX action" onPress={action} />
        <ReacdRenderer
          actions={{ run: action }}
          document={documentWith({
            type: 'Button',
            label: 'Inherited adapter',
            action: 'run',
          })}
        />
      </ReacdProvider>,
    );
    render(
      <ReacdRenderer
        adapter={adapter}
        actions={{ run: action }}
        document={documentWith({ type: 'Button', label: 'JSON action', action: 'run' })}
      />,
    );
    expect(receive).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'TSX action',
      }),
    );
    expect(receive).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'JSON action',
      }),
    );
    expect(receive).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Inherited adapter',
      }),
    );
  });
});
