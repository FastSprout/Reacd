import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import './browser-apis.js';

expect.extend({
  toBeInTheDocument: matchers.toBeInTheDocument,
  toBeVisible: matchers.toBeVisible,
  toHaveAttribute: matchers.toHaveAttribute,
  toHaveStyle: matchers.toHaveStyle,
  toHaveValue: matchers.toHaveValue,
  toHaveTextContent: matchers.toHaveTextContent,
  toBeDisabled: matchers.toBeDisabled,
  toHaveFocus: matchers.toHaveFocus,
  toHaveAccessibleDescription: matchers.toHaveAccessibleDescription,
});
afterEach(cleanup);
