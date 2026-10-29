import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BooleanRead } from './boolean-read.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

describe('private boolean read adapter', () => {
  it('reports unavailable bindings without invoking child rendering', () => {
    render(
      <BooleanRead
        value={{ state: 'missing', mode: 'read' }}
        registry={success(createStateRegistry([]))}
        fallback={false}
      >
        {() => 'Should not render'}
      </BooleanRead>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('Should not render')).toBeNull();
  });
});
