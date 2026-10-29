import { StrictMode, createElement } from 'react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

export function mountApplication(App: ComponentType) {
  const element = document.getElementById('root');
  if (element === null) throw new Error('Mount container #root was not found.');
  const root = createRoot(element);
  root.render(createElement(StrictMode, null, createElement(App)));
  return root;
}
