import { createContext } from 'react';
import type { RenderPort } from '../../core/render-port.js';

export const RenderContext = createContext<RenderPort<Record<string, unknown>> | null>(
  null,
);
