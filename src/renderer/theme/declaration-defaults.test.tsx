import { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { RenderContext } from '../../components/shared/port.js';
import type { RenderPort } from '../../core/render-port.js';
import { DeclarationDefaults } from './declaration-defaults.js';

function Probe({ name = 'Button', properties = {}, report = false }: {
  name?: string;
  properties?: Record<string, unknown>;
  report?: boolean;
}) {
  const port = useContext(RenderContext);
  if (port === null) return 'No rendering port';
  return report
    ? port.report([{ path: 'value', message: 'Invalid declaration.' }])
    : port.render(name, properties);
}

it('preserves missing-provider handling without creating visual elements', () => {
  render(<DeclarationDefaults><Probe /></DeclarationDefaults>);
  expect(screen.getByText('No rendering port')).toBeVisible();
});

it('merges scoped defaults while preserving explicit values and diagnostics', () => {
  const draw = vi.fn<RenderPort<Record<string, unknown>>['render']>(() => null);
  const report = vi.fn<RenderPort<Record<string, unknown>>['report']>(() => null);
  const port = { render: draw, report };
  const view = render(
    <RenderContext.Provider value={port}>
      <DeclarationDefaults defaults={{ Button: { intent: 'secondary' } }}>
        <Probe properties={{ label: 'Save', intent: undefined }} />
        <Probe name="toString" />
        <Probe report />
      </DeclarationDefaults>
    </RenderContext.Provider>,
  );
  expect(draw).toHaveBeenCalledWith('Button', { label: 'Save', intent: 'secondary' });
  expect(draw).toHaveBeenCalledWith('toString', {});
  expect(report).toHaveBeenCalledWith([
    { path: 'value', message: 'Invalid declaration.' },
  ]);
  view.rerender(
    <RenderContext.Provider value={port}>
      <DeclarationDefaults defaults={{ Button: { intent: 'secondary' } }}>
        <Probe properties={{ intent: 'danger' }} />
      </DeclarationDefaults>
    </RenderContext.Provider>,
  );
  expect(draw).toHaveBeenLastCalledWith('Button', { intent: 'danger' });
});

it('inherits outer defaults and lets nested scopes override them', () => {
  const draw = vi.fn<RenderPort<Record<string, unknown>>['render']>(() => null);
  const port = { render: draw, report: () => null };
  render(
    <RenderContext.Provider value={port}>
      <DeclarationDefaults defaults={{ Text: { role: 'headline', weight: 'bold' } }}>
        <DeclarationDefaults defaults={{ Text: { role: 'caption' } }}>
          <DeclarationDefaults><Probe name="Text" /></DeclarationDefaults>
        </DeclarationDefaults>
      </DeclarationDefaults>
    </RenderContext.Provider>,
  );
  expect(draw).toHaveBeenCalledWith('Text', { role: 'caption', weight: 'bold' });
});
