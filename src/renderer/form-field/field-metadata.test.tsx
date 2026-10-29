import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { FieldMetadataContext, useFieldMetadata } from './field-metadata.js';

describe('field metadata precedence', () => {
  it('inherits defaults and descriptions with disabled safety', () => {
    const value = {
      name: 'account',
      required: true,
      disabled: true,
      error: 'Server error',
      descriptionIds: ['outer', 'shared'],
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FieldMetadataContext value={value}>{children}</FieldMetadataContext>
    );
    const initialProps: { name?: string; required?: boolean; disabled?: boolean } = {};
    const { result, rerender } = renderHook(
      (props) => useFieldMetadata(props, ['own', 'shared']),
      { wrapper, initialProps },
    );
    expect(result.current).toEqual({
      ...value,
      descriptionIds: ['outer', 'shared', 'own'],
    });
    rerender({ name: 'override', required: false, disabled: false });
    expect(result.current.name).toBe('override');
    expect(result.current.required).toBe(false);
    expect(result.current.disabled).toBe(true);
  });

  it('uses safe standalone defaults and explicit control flags', () => {
    const initialProps: { required?: boolean; disabled?: boolean } = {};
    const { result, rerender } = renderHook((props) => useFieldMetadata(props), {
      initialProps,
    });
    expect(result.current).toEqual({
      name: undefined,
      required: false,
      disabled: false,
      error: '',
      descriptionIds: [],
    });
    rerender({ required: true, disabled: true });
    expect(result.current.required).toBe(true);
    expect(result.current.disabled).toBe(true);
  });
});
