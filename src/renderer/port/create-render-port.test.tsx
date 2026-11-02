import { forwardRef, memo } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UnsupportedAdapterComponentError } from
  '../../core/unsupported-adapter-component-error.js';
import { buttonComponentSchema } from '../../schema/button/button.schema.js';
import { renderEntry } from '../contracts/render-entry.js';
import { createRenderPort } from './create-render-port.js';
import { defineThemeAdapter, isThemeAdapter } from '../contracts/validate-adapter.js';
import type { AdapterSurfaceProps } from '../contracts/theme-adapter.js';

const adapter = {
  id: 'native-test',
  Surface: ({ children }: AdapterSurfaceProps) => children,
  components: {
    Button: renderEntry('Button', buttonComponentSchema, ({ label }) => label),
  },
};

describe('adapter rendering port', () => {
  it('throws an identifiable exception for a missing SDK component', () => {
    const port = createRenderPort(defineThemeAdapter(adapter));
    expect(() => port.render('Grid', {})).toThrow(UnsupportedAdapterComponentError);
    try {
      void port.render('Grid', {});
    } catch (error) {
      expect(error).toMatchObject({
        name: 'UnsupportedAdapterComponentError',
        adapterId: 'native-test',
        componentName: 'Grid',
      });
      expect(String(error)).toContain('native-test');
      expect(String(error)).toContain('Grid');
    }
  });

  it('retains schema diagnostics and registered rendering', () => {
    const port = createRenderPort(adapter);
    const invalid = render(port.render('Button', {}));
    expect(screen.getByRole('alert')).toHaveTextContent('Button.label');
    invalid.unmount();
    render(port.render('Button', { label: 'Native action', onPress() {} }));
    expect(screen.getByText('Native action')).toBeVisible();
  });

  it.each([
    null,
    [],
    {},
    { id: 1 },
    { id: '' },
    { id: ' ' },
    { id: 'x', Surface: {} },
    { ...adapter, components: null },
    {
      ...adapter,
      components: {
        ...adapter.components,
        Unexpected: { name: 'Unexpected', render() {} },
      },
    },
    {
      ...adapter,
      components: {
        ...adapter.components,
        Text: { name: 'Other', render() {} },
      },
    },
    {
      ...adapter,
      components: {
        ...adapter.components,
        Text: { name: 'Text', render: 1 },
      },
    },
    { ...adapter, components: { Text: undefined } },
  ])('rejects invalid adapter metadata: %o', (value) => {
    expect(isThemeAdapter(value)).toBe(false);
  });

  it('accepts ordinary, memo, and forwardRef provider surfaces', () => {
    expect(isThemeAdapter(adapter)).toBe(true);
    expect(isThemeAdapter({ ...adapter, components: {} })).toBe(true);
    expect(
      isThemeAdapter({ ...adapter, Surface: memo(adapter.Surface) }),
    ).toBe(true);
    expect(isThemeAdapter({ ...adapter, Surface: forwardRef(() => null) })).toBe(
      true,
    );
  });

  it('validates and freezes adapter definitions', () => {
    const definition = defineThemeAdapter(adapter);
    expect(Object.isFrozen(definition)).toBe(true);
    expect(Object.isFrozen(definition.components)).toBe(true);
    const invalid = { ...adapter, id: '' };
    expect(() => defineThemeAdapter(invalid)).toThrow(
      'A theme adapter must declare valid SDK-backed component entries.',
    );
  });
});
