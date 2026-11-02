import { ActiveTestTheme } from './active-test-theme.js';
import type { PropsWithChildren, ReactNode } from 'react';
import { render as renderUi } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';

export function render(children: ReactNode, options?: RenderOptions) {
  const CallerWrapper = options?.wrapper;
  function TestScope({ children: content }: PropsWithChildren) {
    return (
      <ActiveTestTheme>
        {CallerWrapper ? <CallerWrapper>{content}</CallerWrapper> : content}
      </ActiveTestTheme>
    );
  }
  return renderUi(children, { ...options, wrapper: TestScope });
}
