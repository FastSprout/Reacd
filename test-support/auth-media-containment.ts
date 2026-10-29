import type { Locator } from '@playwright/test';
import { measureControlEscapes } from './control-containment.js';

export function measureAuthMediaEscapes(region: Locator, tolerance: number) {
  return measureControlEscapes(region, tolerance, 'input,button,p,h2,h3,[role=img]');
}
