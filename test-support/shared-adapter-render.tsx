import { ActiveTestTheme } from './active-test-theme.js';
import type { PropsWithChildren, ReactNode } from 'react';
import { render as renderUi } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { PrimitiveScope } from '../src/adapter/shared/primitives/context.js';
import { testPrimitives } from './active-test-primitives.js';

export function render(children: ReactNode, options?: RenderOptions) {
  const CallerWrapper = options?.wrapper;
  function TestScope({ children: content }: PropsWithChildren) {
    return (
      <ActiveTestTheme>
        <PrimitiveScope primitives={testPrimitives}>
          {CallerWrapper ? <CallerWrapper>{content}</CallerWrapper> : content}
        </PrimitiveScope>
      </ActiveTestTheme>
    );
  }
  return renderUi(children, { ...options, wrapper: TestScope });
}
