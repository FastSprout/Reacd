import { jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime';
import { assertComponent } from './guard.js';

export { Fragment } from 'react/jsx-runtime';
export type { JSX } from './namespace.js';

export const jsx: typeof reactJsx = (type, props, key) => {
  assertComponent(type);
  return reactJsx(type, props, key);
};

export const jsxs: typeof reactJsxs = (type, props, key) => {
  assertComponent(type);
  return reactJsxs(type, props, key);
};
