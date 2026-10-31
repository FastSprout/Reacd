import type { ComponentPropsWithRef } from 'react';

export type ChoiceMarkProps = ComponentPropsWithRef<'span'> & {
  readonly appearance: 'radio' | 'checkbox' | 'rating';
};
