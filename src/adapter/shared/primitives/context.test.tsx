import type { ButtonPrimitiveProps } from './button/button.props.js';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { shadcnPrimitives } from '../../shadcn/primitives/primitives.js';
import { Button } from './button/button.js';
import { bindPrimitives, PrimitiveScope } from './context.js';

function AlternateButton({ children, onClick }: ButtonPrimitiveProps) {
  return <button onClick={onClick}>Alternate {children}</button>;
}

it('requires an explicit private primitive scope', () => {
  expect(() => render(<Button>Save</Button>)).toThrow('primitive scope');
});

it('substitutes concrete primitives without changing component declarations', () => {
  const alternate = { ...shadcnPrimitives, Button: AlternateButton };
  render(
    <PrimitiveScope primitives={shadcnPrimitives}>
      <Button>First</Button>
      <PrimitiveScope primitives={alternate}>
        <Button>Second</Button>
      </PrimitiveScope>
      <Button>Third</Button>
    </PrimitiveScope>,
  );
  expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Alternate Second' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Third' })).toBeInTheDocument();
});

it('binds private adapter components and preserves their display names', () => {
  const alternate = { ...shadcnPrimitives, Button: AlternateButton };
  const BoundButton = bindPrimitives(Button, alternate, 'AlternateAction');
  expect(BoundButton.displayName).toBe('AlternateAction');
  render(
    <PrimitiveScope primitives={alternate}>
      <BoundButton>Save</BoundButton>
    </PrimitiveScope>,
  );
  expect(screen.getByRole('button', { name: 'Alternate Save' })).toBeInTheDocument();
});
