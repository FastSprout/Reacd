import { describe, expect, it } from 'vitest';
import { resolvePanelEdge } from './panel-policy.js';
describe('logical panel placement', () => {
  it('resolves inline edges independently of document language', () => {
    expect(resolvePanelEdge('start', 'ltr')).toBe('left');
    expect(resolvePanelEdge('start', 'rtl')).toBe('right');
    expect(resolvePanelEdge('end', 'ltr')).toBe('right');
    expect(resolvePanelEdge('end', 'rtl')).toBe('left');
    expect(resolvePanelEdge('top', 'rtl')).toBe('top');
    expect(resolvePanelEdge('bottom', 'ltr')).toBe('bottom');
  });
});
