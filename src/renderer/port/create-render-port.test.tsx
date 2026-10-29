import { forwardRef, memo } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createRenderPort } from './create-render-port.js';
import { shadcnAdapter } from '../../adapter/shadcn/shadcn.adapter.js';
import { defineThemeAdapter, isThemeAdapter } from '../contracts/validate-adapter.js';

describe('adapter rendering port', () => {
  it('fails closed for unknown components and invalid adapter properties', () => {
    const port = createRenderPort(shadcnAdapter);
    const first = render(port.render('Unknown', {}));
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    first.unmount();
    render(port.render('Button', {}));
    expect(screen.getByRole('alert')).toHaveTextContent('Button.label');
  });

  it.each([
    null,
    [],
    {},
    { id: 1 },
    { id: '' },
    { id: ' ' },
    { id: 'x', Surface: {} },
    { ...shadcnAdapter, components: null },
    { ...shadcnAdapter, components: {} },
    {
      ...shadcnAdapter,
      components: {
        ...shadcnAdapter.components,
        Unexpected: { name: 'Unexpected', render() {} },
      },
    },
    {
      ...shadcnAdapter,
      components: {
        ...shadcnAdapter.components,
        Text: { name: 'Other', render() {} },
      },
    },
    {
      ...shadcnAdapter,
      components: {
        ...shadcnAdapter.components,
        Text: { name: 'Text', render: 1 },
      },
    },
  ])('rejects incomplete adapters: %o', (adapter) => {
    expect(isThemeAdapter(adapter)).toBe(false);
  });

  it('accepts ordinary, memo, and forwardRef provider surfaces', () => {
    expect(isThemeAdapter(shadcnAdapter)).toBe(true);
    expect(
      isThemeAdapter({ ...shadcnAdapter, Surface: memo(shadcnAdapter.Surface) }),
    ).toBe(true);
    expect(isThemeAdapter({ ...shadcnAdapter, Surface: forwardRef(() => null) })).toBe(
      true,
    );
  });

  it('validates and freezes adapter definitions', () => {
    expect(Object.isFrozen(defineThemeAdapter(shadcnAdapter))).toBe(true);
    const invalid = { ...shadcnAdapter, id: '' };
    expect(() => defineThemeAdapter(invalid)).toThrow('complete reacd catalog');
  });
});
