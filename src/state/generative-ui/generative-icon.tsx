import type { z } from 'zod';
import { Icon } from '../../components/icon/index.js';
import { iconSchema } from '../../schema/icon/index.js';
import type { iconNodeSchema } from '../../schema/icon/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';

export function GenerativeIcon({ node }: { node: z.infer<typeof iconNodeSchema> }) {
  const { type: _type, ...properties } = node;
  const result = iconSchema.safeParse(properties);
  if (!result.success)
    return (
      <Issues
        issues={result.error.issues.map((issue) => ({
          path: ['Icon', ...issue.path.map(String)].join('.'),
          message: issue.message,
        }))}
      />
    );
  return <Icon {...result.data} />;
}
