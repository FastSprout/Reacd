import { ActiveTestTheme } from './active-test-theme.js';
import type { ReactNode } from 'react';
import { renderToString as renderServer } from 'react-dom/server';

export function renderToString(
  children: ReactNode,
  options?: Parameters<typeof renderServer>[1],
) {
  return renderServer(
    <ActiveTestTheme>
      {children}
    </ActiveTestTheme>,
    options,
  );
}
