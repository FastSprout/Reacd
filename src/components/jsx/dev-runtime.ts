import { jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime';
import { assertComponent } from './guard.js';

export { Fragment } from 'react/jsx-dev-runtime';
export type { JSX } from './namespace.js';

export const jsxDEV: typeof reactJsxDEV = (
  type,
  props,
  key,
  isStatic,
  source,
  self,
) => {
  assertComponent(type);
  return reactJsxDEV(type, props, key, isStatic, source, self);
};
