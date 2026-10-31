import { ActiveTestTheme } from './active-test-theme.js';
import type { ReactNode } from 'react';
import { renderToString as renderServer } from 'react-dom/server';
import { PrimitiveScope } from '../src/adapter/shared/primitives/context.js';
import { testPrimitives } from './active-test-primitives.js';

export function renderToString(
  children: ReactNode,
  options?: Parameters<typeof renderServer>[1],
) {
  return renderServer(
    <ActiveTestTheme>
      <PrimitiveScope primitives={testPrimitives}>{children}</PrimitiveScope>
    </ActiveTestTheme>,
    options,
  );
}
