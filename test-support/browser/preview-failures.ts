import type { Page } from '@playwright/test';

export interface PreviewFailure {
  readonly name: string;
  readonly message: string;
  readonly adapterId: string | null;
  readonly componentName: string | null;
}

export function watchPreviewFailures(page: Page): () => Promise<PreviewFailure[]> {
  const pending: Promise<PreviewFailure | null>[] = [];
  page.on('console', message => {
    if (message.type() !== 'error') return;
    for (const argument of message.args()) {
      pending.push(argument.evaluate((value: unknown) => {
        if (!(value instanceof Error)) return null;
        return {
          name: value.name,
          message: value.message,
          adapterId: 'adapterId' in value && typeof value['adapterId'] === 'string'
            ? value['adapterId'] : null,
          componentName: 'componentName' in value
            && typeof value['componentName'] === 'string'
            ? value['componentName'] : null,
        };
      }).catch(() => null));
    }
  });
  return async () => (await Promise.all(pending)).filter(value => value !== null);
}
