import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import { TEXTAREA_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/textarea-policy.js';

function positive(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function useAutoRows(
  ref: RefObject<HTMLTextAreaElement | null>,
  enabled: boolean | undefined,
  value: string,
  rows: number,
  maxRows: number,
): void {
  useLayoutEffect(() => {
    const control = ref.current;
    if (!enabled || control === null) return;
    const measure = () => {
      control.rows = rows;
      const style = window.getComputedStyle(control);
      const fontSize = positive(style.fontSize, TEXTAREA_POLICY.fallbackFontSizePx);
      const lineHeight = positive(
        style.lineHeight,
        fontSize * TEXTAREA_POLICY.fallbackLineHeightRatio,
      );
      const padding = positive(style.paddingTop, 0) + positive(style.paddingBottom, 0);
      // scrollHeight rounds to integer pixels; plain textarea lines are discrete.
      const measured = Math.round((control.scrollHeight - padding) / lineHeight);
      control.rows = Math.max(rows, Math.min(maxRows, measured));
    };
    measure();
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(control);
    window.addEventListener('resize', measure);
    document.fonts?.addEventListener('loadingdone', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      document.fonts?.removeEventListener('loadingdone', measure);
    };
  }, [ref, enabled, value, rows, maxRows]);
}
