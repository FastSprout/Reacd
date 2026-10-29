import { describe, expect, it } from 'vitest';
import { initialLayerFocus } from './initial-layer-focus.js';

describe('initial focus across retained layers', () => {
  it('uses default keyboard focus and touch panel focus without a child dialog', () => {
    const panel = document.createElement('div');
    expect(initialLayerFocus(null, 'keyboard')).toBe(true);
    expect(initialLayerFocus(panel, 'keyboard')).toBe(true);
    expect(initialLayerFocus(panel, 'touch')).toBe(panel);
  });
  it('lets an active child dialog own focus when its retained parent reopens', () => {
    const panel = document.createElement('div');
    const child = document.createElement('div');
    child.setAttribute('role', 'dialog');
    panel.append(child);
    expect(initialLayerFocus(panel, 'keyboard')).toBe(true);
    child.setAttribute('data-open', '');
    expect(initialLayerFocus(panel, 'keyboard')).toBe(false);
    expect(initialLayerFocus(panel, 'touch')).toBe(false);
  });
});
