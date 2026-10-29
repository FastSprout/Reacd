import { createRef, useRef } from 'react';
import { renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { useSplitterReflow } from './use-splitter-reflow.js';
import {
  installLayout,
  resizeContainers,
} from '../../../test-support/layout-observer.js';

it('observes real rem-track geometry and reflows large panel groups', () => {
  const restore = installLayout();
  const group = document.createElement('div');
  const track = document.createElement('span');
  track.className = 'reacd-splitter-track';
  const view = renderHook(({ count }) => useSplitterReflow(useRef(group),
    useRef(track), count), { initialProps: { count: 2 } });
  expect(view.result.current).toBe(false);
  view.rerender({ count: 8 });
  expect(view.result.current).toBe(true);
  resizeContainers(320);
  expect(view.result.current).toBe(true);
  view.unmount(); restore();
});

it('waits for both DOM measurements without inventing geometry', () => {
  const missing = createRef<HTMLElement>();
  const present = createRef<HTMLElement>();
  present.current = document.createElement('div');
  expect(renderHook(() => useSplitterReflow(missing, present, 2)).result.current)
    .toBe(false);
  expect(renderHook(() => useSplitterReflow(present, missing, 2)).result.current)
    .toBe(false);
});
