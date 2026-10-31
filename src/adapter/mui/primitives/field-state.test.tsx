import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiInputPrimitive } from './input/input.js';
import { MuiTextareaPrimitive } from './textarea/textarea.js';

it.each([true, false, 'true', 'false', 'grammar', 'spelling', undefined] as const)(
  'maps native invalid state %s to the Material outline for both field controls',
  (invalid) => {
    const { container } = render(
      <>
        <MuiInputPrimitive aria-label="Name" aria-invalid={invalid} />
        <MuiTextareaPrimitive aria-label="Notes" aria-invalid={invalid} />
      </>,
    );
    const expected = invalid !== undefined && invalid !== false && invalid !== 'false';
    const outlines = container.querySelectorAll('.MuiOutlinedInput-root');
    expect(outlines).toHaveLength(2);
    for (const outline of outlines) {
      expect(outline.classList.contains('Mui-error')).toBe(expected);
    }
  },
);
