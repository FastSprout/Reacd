import { useContext } from 'react';
import type { ReactNode } from 'react';
import type { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { RenderContext } from './port.js';

export function useDeclaration<P extends object>(
  name: string,
  schema: z.ZodType<P>,
  props: P,
): ReactNode {
  const port = useContext(RenderContext);
  if (port === null) throw new Error(FRAMEWORK_ERRORS.missingProvider);
  const result = schema.safeParse(props);
  if (!result.success) {
    return port.report(
      result.error.issues.map((issue) => ({
        path: [name, ...issue.path.map(String)].join('.'),
        message: issue.message,
      })),
    );
  }
  return port.render(name, result.data);
}
