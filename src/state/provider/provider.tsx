import type { z } from 'zod';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { ActiveProvider } from './provider-content.js';
import { providerSchema } from './provider.schema.js';

export type ReacdProviderProps = z.infer<typeof providerSchema>;

export function ReacdProvider(properties: ReacdProviderProps) {
  const result = providerSchema.safeParse(properties);
  if (!result.success) {
    return (
      <Issues
        issues={result.error.issues.map((issue) => ({
          path: ['ReacdProvider', ...issue.path.map(String)].join('.'),
          message: issue.message,
        }))}
      />
    );
  }
  return <ActiveProvider {...result.data} />;
}
