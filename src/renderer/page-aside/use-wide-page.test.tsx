import { act, render, renderHook, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWidePage } from './use-wide-page.js';
import { ShadcnPageAside } from '../../adapter/shadcn/page-aside/page-aside.adapter.js';
import { PAGE_COMPOSITION_POLICY } from '../../core/page-composition-policy.js';

class MediaProbe extends EventTarget {
  matches = true;
}

afterEach(() => vi.unstubAllGlobals());

describe('wide page behavior', () => {
  it('preserves accessible in-flow content without browser media support', () => {
    vi.stubGlobal('matchMedia', undefined);
    render(
      <ShadcnPageAside label="Page navigation" top="Context" bottom="Help">
        Destinations
      </ShadcnPageAside>,
    );
    expect(
      screen.getByRole('complementary', { name: 'Page navigation' }),
    ).toHaveAttribute('data-wide', 'false');
    for (const text of ['Context', 'Destinations', 'Help']) {
      expect(screen.getByText(text)).toBeVisible();
    }
  });

  it('reacts to the engine query and releases its subscription', () => {
    const media = new MediaProbe();
    const query = vi.fn(() => media);
    const remove = vi.spyOn(media, 'removeEventListener');
    vi.stubGlobal('matchMedia', query);
    const view = renderHook(useWidePage);
    expect(query).toHaveBeenCalledWith(
      `(min-width: ${PAGE_COMPOSITION_POLICY.wideAsideRem}rem)`,
    );
    expect(view.result.current).toBe(true);
    act(() => {
      media.matches = false;
      media.dispatchEvent(new Event('change'));
    });
    expect(view.result.current).toBe(false);
    view.unmount();
    expect(remove).toHaveBeenCalled();
  });

  it('uses the stable in-flow server snapshot even with a wide client', () => {
    vi.stubGlobal('matchMedia', () => new MediaProbe());
    expect(
      renderToStaticMarkup(
        <ShadcnPageAside label="Server navigation">Links</ShadcnPageAside>,
      ),
    ).toContain('data-wide="false"');
    vi.stubGlobal('window', undefined);
    expect(
      renderToStaticMarkup(<ShadcnPageAside label="Server navigation" />),
    ).toContain('data-wide="false"');
  });
});
