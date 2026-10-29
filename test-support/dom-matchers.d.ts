import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import 'vitest';

type DomMatchers<T, R> = Pick<
  TestingLibraryMatchers<T, R>,
  | 'toBeInTheDocument'
  | 'toBeVisible'
  | 'toHaveAttribute'
  | 'toHaveStyle'
  | 'toHaveValue'
  | 'toHaveTextContent'
  | 'toBeDisabled'
  | 'toHaveFocus'
  | 'toHaveAccessibleDescription'
>;

declare module 'vitest' {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > extends DomMatchers<T, R> {}
}
