import { act, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  installLayout,
  resizeContainers,
} from '../../../../test-support/layout-observer.js';
import { usePageWidth } from './use-page-width.js';

it('measures available text-scaled width and disconnects after removal', () => {
  const restore = installLayout(1280);
  const view = renderHook(() => usePageWidth());
  expect(view.result.current.widthRem).toBe(0);
  expect(view.result.current.measured).toBe(false);
  const element = document.createElement('div');
  element.style.fontSize = '32px';
  document.body.append(element);
  act(() => view.result.current.setElement(element));
  expect(view.result.current.widthRem).toBe(40);
  expect(view.result.current.measured).toBe(true);
  resizeContainers(2560);
  expect(view.result.current.widthRem).toBe(80);
  element.style.fontSize = '0px';
  resizeContainers(1280);
  expect(view.result.current.widthRem).toBe(80);
  view.unmount();
  resizeContainers(320);
  expect(view.result.current.widthRem).toBe(80);
  element.remove();
  restore();
});
